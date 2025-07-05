import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { runpodVLLM } from '@/lib/providers/runpod-vllm';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // Default to gpt-4o-mini if no model is specified
    const selectedModel = model || 'gpt-4o-mini';

    console.log('🔄 API Route called with model:', selectedModel);

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY && selectedModel !== 'runpod') {
      return Response.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }
    
    let streamConfig;
    if (selectedModel === 'runpod') {
      try {
        const runpodModel = runpodVLLM();
        
        streamConfig = {
          model: runpodModel,
          system: `You are a helpful AI assistant. Be concise and helpful in your responses.`,
          messages,
          maxRetries: 3,
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'runpod-chat',
          },
        };
      } catch (error) {
        console.error('❌ Failed to initialize RunPod provider:', error);
        return Response.json({ 
          error: 'RunPod provider initialization failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      streamConfig = {
        model: openai(selectedModel),
        system: `You are a helpful AI assistant. Be concise and helpful in your responses.`,
        messages,
      };
    }

    const result = streamText(streamConfig);
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('❌ API Route error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('socket')) {
        return Response.json({ 
          error: 'Connection to RunPod failed',
          details: 'Network error or RunPod service unavailable',
          originalError: error.message
        }, { status: 503 });
      }
      
      if (error.message.includes('timeout')) {
        return Response.json({ 
          error: 'Request timeout',
          details: 'RunPod response took too long',
          originalError: error.message
        }, { status: 504 });
      }
    }
    
    return Response.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 