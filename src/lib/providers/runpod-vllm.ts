import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export interface RunpodVLLMSettings {
  endpointId: string;
  apiKey: string;
  model?: string;
}

// Custom fetch to intercept and log RunPod request/response IDs
async function fetchRunPod(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const startTime = Date.now();
  
  try {
    // Make the actual request
    const response = await fetch(input, init);
    
    // Log request details
    const url = input.toString();
    const method = init?.method || 'GET';
    console.log(`🔄 RunPod Request: ${method} ${url}`);
    
    // For streaming responses (SSE), try to extract request ID from first chunk
    if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
      const duration = Date.now() - startTime;
      console.log(`✅ RunPod Streaming Response: ${response.status} (${duration}ms)`);
      
      // Try to extract request ID from first chunk without consuming the stream
      const clonedResponse = response.clone();
      
      try {
        const reader = clonedResponse.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          const { value } = await reader.read();
          reader.releaseLock();
          
          if (value) {
            const chunk = decoder.decode(value);
            const match = chunk.match(/"id":"([^"]+)"/);
            if (match) {
              const openaiCompatibleId = match[1];
              console.log(`✅ OpenAI-compatible ID: ${openaiCompatibleId} (streaming)`);
              console.log(`ℹ️  Note: RunPod job ID not accessible via streaming endpoint`);
            }
          }
        }
      } catch (error) {
        // If we can't extract ID, just continue - the response is still valid
        console.log(`⚠️  Could not extract response ID from stream: ${error}`);
      }
      
      return response;
    }
    
    // For non-streaming responses, we can clone and peek at the response
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const clonedResponse = response.clone();
      
      try {
        const data = await clonedResponse.json();
        const runpodRequestId = data.id;
        const duration = Date.now() - startTime;
        
        if (runpodRequestId) {
          console.log(`✅ RunPod Request ID: ${runpodRequestId} (${duration}ms)`);
        } else {
          console.log(`✅ RunPod Response: ${response.status} (${duration}ms)`);
        }
      } catch (error) {
        // If we can't parse JSON, just log the response
        const duration = Date.now() - startTime;
        console.log(`✅ RunPod Response: ${response.status} (${duration}ms)`);
      }
    }
    
    return response;
    
      } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ RunPod Request Failed: ${error} (${duration}ms)`);
      
      // Try to extract any useful information from the error
      if (error instanceof TypeError && error.message.includes('terminated')) {
        console.log(`🔍 Connection terminated - likely cold start timeout`);
        console.log(`💡 To find RunPod job ID: Check RunPod dashboard for recent jobs around ${new Date().toISOString()}`);
      }
      
      throw error;
    }
}

export function createRunpodVLLM(settings: RunpodVLLMSettings) {
  const { endpointId, apiKey, model = 'inflatebot/MN-12B-Mag-Mell-R1' } = settings;
  
  // Use OpenAI Compatible provider for RunPod's vLLM OpenAI-compatible endpoint
  const provider = createOpenAICompatible({
    name: 'runpod-vllm',
    baseURL: `https://api.runpod.ai/v2/${endpointId}/openai/v1`,
    apiKey,
    fetch: fetchRunPod, // Custom fetch to intercept and log request IDs
  });

  return provider(model);
}

// Create the provider instance using environment variables
function createRunpodVLLMProvider() {
  // Return a function that reads env vars at call time, not module load time
  return () => {
    const endpointId = process.env.RUNPOD_ENDPOINT_ID;
    const apiKey = process.env.RUNPOD_API_KEY;

    if (!endpointId || !apiKey) {
      // Log helpful info instead of throwing
      console.warn('⚠️  RunPod vLLM provider configuration missing:');
      if (!endpointId) console.warn('   - RUNPOD_ENDPOINT_ID environment variable not set');
      if (!apiKey) console.warn('   - RUNPOD_API_KEY environment variable not set');
      console.warn('   RunPod models will not be available until these are configured.');
      
      throw new Error('RunPod vLLM provider not configured. Please set RUNPOD_ENDPOINT_ID and RUNPOD_API_KEY environment variables.');
    }

    return createRunpodVLLM({
      endpointId,
      apiKey,
    });
  };
}

export const runpodVLLM = createRunpodVLLMProvider(); 