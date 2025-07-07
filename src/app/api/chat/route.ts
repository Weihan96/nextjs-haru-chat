import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { runpodVLLM } from '@/lib/providers/runpod-vllm';

// Allow streaming responses up to 90 seconds (30s for stream + 60s for error handling)
export const maxDuration = 90;


export async function POST(req: Request) {
  const { messages, model } = await req.json();

  // Default to gpt-4o-mini if no model is specified
  const selectedModel = model || 'gpt-4o-mini';

  console.log('🔄 API Route called with model:', selectedModel);

  // Check if API key is available
  if (selectedModel !== 'runpod' && !process.env.OPENAI_API_KEY) {
    return Response.json({ 
      error: 'Missing API key',
      details: 'OpenAI API key is required for this model.',
      code: 'MISSING_API_KEY'
    }, { status: 500 });
  }

  try {
    // Use Promise.race for timeout since RunPod doesn't support AbortController directly
    const streamPromise = streamText({
      model: selectedModel === 'runpod' ? runpodVLLM() : openai(selectedModel),
      system: `You are a helpful AI assistant. Be concise and helpful in your responses.`,
      messages,
      // RunPod-specific configuration
      ...(selectedModel === 'runpod' && 
        {
          maxRetries: 3,
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'runpod-chat',
          }
        }
      ),
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Stream timeout after 30 seconds')), 30000);
    });
    
    const result = await Promise.race([streamPromise, timeoutPromise]);
    return result.toDataStreamResponse();
  } catch (error) {
    // Handle RunPod cold start detection
    if (selectedModel === 'runpod') {
      const coldStartResponse = await handleColdStartDetection(error);
      if (coldStartResponse) {
        return coldStartResponse;
      }
    }
    return await handleStreamingError(error);
  }
} 

// Handle RunPod cold start detection
async function handleColdStartDetection(error: unknown): Promise<Response | null> {
  // Check if error indicates potential cold start (inline isPotentialColdStart logic)
  let isPotentialColdStart = false;
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Socket errors (often cold start related)
    if (errorMessage.includes('socket') || 
        errorMessage.includes('other side closed') ||
        errorMessage.includes('terminated') ||
        errorMessage.includes('pipe response')) {
      isPotentialColdStart = true;
    }
    
    // Timeout errors
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('aborted') ||
        errorMessage.includes('signal')) {
      isPotentialColdStart = true;
    }
  }

  if (!isPotentialColdStart) {
    return null;
  }

  console.log('🔍 Potential cold start detected, diagnosing...');
  
  try {
    // Post-flight health check for RunPod cold start diagnosis (inline diagnoseRunPodFailure logic)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Health check failed - unable to determine cause');
      return null;
    }

    const health = await response.json();
    
    // Check if workers are initializing (definite cold start)
    if (health.workers?.initializing > 0) {
      const message = `${health.workers.initializing} workers are initializing. The model is starting up, please try again in 60-90 seconds.`;
      console.log('❄️ Cold start confirmed:', message);
      return Response.json({
        error: 'Cold start timeout',
        details: message,
        code: 'COLD_START_TIMEOUT',
        retryAfter: 60
      }, { status: 504 });
    }

    // Check if no workers are ready (need to start)
    if (health.workers?.ready === 0 && health.workers?.idle === 0) {
      const message = 'No workers available. Starting new worker, please try again in 60-90 seconds.';
      console.log('❄️ Cold start confirmed:', message);
      return Response.json({
        error: 'Cold start timeout',
        details: message,
        code: 'COLD_START_TIMEOUT',
        retryAfter: 60
      }, { status: 504 });
    }

    // Workers exist but model loading likely caused the timeout
    if (health.workers?.ready > 0 || health.workers?.idle > 0) {
      const message = 'Workers are ready but the model was loading. Please try again in 30-60 seconds.';
      console.log('❄️ Cold start confirmed:', message);
      return Response.json({
        error: 'Cold start timeout',
        details: message,
        code: 'COLD_START_TIMEOUT',
        retryAfter: 60
      }, { status: 504 });
    }

    console.log('Workers status unclear, please try again');
    return null;

  } catch (healthCheckError) {
    console.error('❌ Health check error:', healthCheckError);
    // Fall through to regular error handling
  }

  return null;
}

// Generic error handling
async function handleStreamingError(error: unknown): Promise<Response> {
  console.error('❌ Streaming error details:', error);
  
  // Check for HTTP errors with status codes
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as any).status;
    
    switch (status) {
      case 429:
        return Response.json({
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again in a moment.',
          retryAfter: 60,
          code: 'RATE_LIMIT_EXCEEDED'
        }, { status: 429 });
      
      case 401:
        return Response.json({
          error: 'Authentication failed',
          details: 'Invalid API key or authentication token.',
          code: 'AUTH_ERROR'
        }, { status: 401 });
      
      case 403:
        return Response.json({
          error: 'Access forbidden',
          details: 'You do not have permission to access this resource.',
          code: 'FORBIDDEN'
        }, { status: 403 });
      
      case 503:
        return Response.json({
          error: 'Service unavailable',
          details: 'The AI service is temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE'
        }, { status: 503 });
      
      case 504:
        return Response.json({
          error: 'Request timeout',
          details: 'The request took too long to complete. Please try again.',
          code: 'TIMEOUT_ERROR'
        }, { status: 504 });
    }
  }
  
  // Handle other error types
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Network connection errors
    if (errorMessage.includes('fetch failed') || 
        errorMessage.includes('network') || 
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('connection refused')) {
      return Response.json({
        error: 'Connection failed',
        details: 'Unable to connect to the AI service. Please check your network and try again.',
        code: 'CONNECTION_ERROR'
      }, { status: 503 });
    }
    
    // Rate limit (if not caught by status code)
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return Response.json({
        error: 'Rate limit exceeded',
        details: 'Too many requests. Please try again in a moment.',
        retryAfter: 60,
        code: 'RATE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }
  }
  
  // Generic server error fallback
  return Response.json({
    error: 'Service error',
    details: 'An error occurred while processing your request. Please try again.',
    code: 'UNKNOWN_ERROR',
    debug: error instanceof Error ? error.message : 'Unknown error'
  }, { status: 500 });
}