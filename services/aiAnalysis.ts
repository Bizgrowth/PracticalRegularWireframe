
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeWithAI(query: string): Promise<string> {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a crypto and Bitcoin investment expert. Provide detailed, accurate information about:
          - Bitcoin and cryptocurrency fundamentals
          - Investment strategies and risk management
          - Market analysis and trends
          - Trading techniques
          - Portfolio diversification
          - Regulatory considerations
          
          Always provide balanced, educational content and remind users that all investments carry risk.`
        },
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze with AI: ' + (error as Error).message);
  }
}

export async function generateTop10Investments(): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a crypto investment analyst. Generate a top 10 list of cryptocurrency investments based on:
          - Recent 90-day performance data
          - Future growth potential
          - Risk-adjusted returns
          - Market fundamentals
          
          Format as a numbered list with brief explanations for each choice.`
        },
        {
          role: 'user',
          content: 'Generate today\'s top 10 cryptocurrency investment recommendations'
        }
      ],
      max_tokens: 800,
      temperature: 0.6
    });

    return response.choices[0]?.message?.content || 'No recommendations generated';
  } catch (error) {
    console.error('Investment Analysis Error:', error);
    throw new Error('Failed to generate investment recommendations');
  }
}
