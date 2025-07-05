import { createOpenAI } from '@ai-sdk/openai';

export interface RunpodVLLMSettings {
  endpointId: string;
  apiKey: string;
  model?: string;
}

export function createRunpodVLLM(settings: RunpodVLLMSettings) {
  const { endpointId, apiKey, model = 'inflatebot/MN-12B-Mag-Mell-R1' } = settings;
  
  // Use OpenAI client with RunPod's vLLM OpenAI-compatible endpoint
  const openai = createOpenAI({
    baseURL: `https://api.runpod.ai/v2/${endpointId}/openai/v1`,
    apiKey,
  });

  return openai(model);
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