import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // Default to gpt-4o-mini if no model is specified
    const selectedModel = model || 'gpt-4o-mini';

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    const result = streamText({
      model: openai(selectedModel),
      system: `You are a helpful AI assistant. Be concise and helpful in your responses.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 