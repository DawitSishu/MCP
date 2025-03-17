import OpenAI from 'openai';

export interface Message {
  role: string;
  content: string;
}

/**
 * Summarizes chat history using OpenAI
 * @param messages Array of chat messages to summarize
 * @returns A summary of the chat history
 */
export async function summarizeChat(messages: Message[]): Promise<string> {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Initialize the OpenAI client with the current API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  
    // Format messages for OpenAI
    const formattedMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    // Add a system message to instruct the model
    const systemMessage = {
      role: 'system' as const,
      content: 'Please provide a concise summary of the conversation so far, highlighting key points, questions, and decisions. The summary should be comprehensive but brief.'
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...formattedMessages],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'No summary generated';
  } catch (error) {
    console.error('Error summarizing chat:', error);
    throw error; // Re-throw the error to be handled by the tool
  }
} 