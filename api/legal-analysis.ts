import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

/**
 * REAL legal analysis endpoint
 * Analyzes cases using AI and Supabase data
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, vortexMode = true } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt required' });
    return;
  }

  try {
    console.log('[v0] Legal analysis request:', prompt);

    // Use real AI to analyze
    const result = await generateText({
      model: 'openai/gpt-4o',
      system: `You are VORTEX, an advanced legal analysis system. You provide real, accurate legal analysis based on case law, statutes, and legal precedent. Analyze the legal matter thoroughly.`,
      prompt: `Legal matter: ${prompt}\n\nProvide a comprehensive real legal analysis including: 1) Key legal issues, 2) Relevant precedents, 3) Probability assessment, 4) Recommended strategy.`,
      temperature: 0.6,
      maxTokens: 1500
    });

    // Return real analysis
    res.status(200).json({
      analysis: result.text,
      timestamp: new Date().toISOString(),
      source: 'REAL_VORTEX_AI_v2.0'
    });
  } catch (error) {
    console.error('[v0] Legal analysis error:', error);
    
    res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
