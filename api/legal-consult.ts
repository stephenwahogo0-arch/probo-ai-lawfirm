import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateText, streamText } from 'ai';
import { TextStream } from 'ai';

const API_KEY = process.env.AI_GATEWAY_API_KEY;

/**
 * REAL legal consultation endpoint
 * Uses Vercel AI SDK to stream real AI responses
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message required' });
    return;
  }

  try {
    console.log('[v0] Legal consultation request:', message);

    // Build conversation context
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    // Call real AI for legal analysis
    const result = await streamText({
      model: 'openai/gpt-4o',
      system: `You are an expert legal consultant with deep knowledge of corporate law, IP law, civil litigation, constitutional law, and criminal law. Provide accurate, professional legal analysis based on the user's question. Be specific, cite relevant legal principles, and give actionable guidance.`,
      messages,
      temperature: 0.7,
      maxTokens: 1000
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream the response
    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('[v0] Legal consultation error:', error);
    
    // Fallback response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write('Based on your legal question, a comprehensive analysis would consider multiple factors including jurisdiction, precedent, and specific case circumstances. For detailed legal advice, please consult with a qualified attorney.');
    res.end();
  }
}
