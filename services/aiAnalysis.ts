
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
          content: `You are an expert cryptocurrency investment analyst with deep knowledge of market trends, technical analysis, and blockchain fundamentals. Generate a comprehensive top 10 cryptocurrency investment list based on:

          ANALYSIS CRITERIA:
          - 90-day performance trends and momentum
          - Technical indicators (RSI, MACD, moving averages)
          - Fundamental analysis (technology, team, partnerships)
          - Market capitalization and liquidity
          - Adoption rates and real-world utility
          - Risk-adjusted return potential
          - Regulatory compliance and legal standing
          - Community strength and developer activity

          FORMAT REQUIREMENTS:
          - Rank 1-10 with coin name and symbol
          - Brief investment thesis (2-3 sentences max)
          - Risk level (Low/Medium/High)
          - Expected timeframe for returns
          - Current market sentiment

          RISK DISCLAIMER: Always remind users that cryptocurrency investments are highly volatile and risky.`
        },
        {
          role: 'user',
          content: `Generate today's top 10 cryptocurrency investment recommendations for ${new Date().toDateString()}. Focus on coins with strong fundamentals and growth potential over the next 3-6 months.`
        }
      ],
      max_tokens: 1200,
      temperature: 0.4
    });

    return response.choices[0]?.message?.content || 'No recommendations generated';
  } catch (error) {
    console.error('Investment Analysis Error:', error);
    throw new Error('Failed to generate investment recommendations');
  }
}

export async function analyzeInvestmentStrategy(strategy: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a crypto investment strategist. Analyze and provide detailed insights on investment strategies including:
          - Strategy explanation and methodology
          - Risk assessment and mitigation
          - Market conditions where strategy works best
          - Expected returns and timeframes
          - Practical implementation steps
          - Common mistakes to avoid`
        },
        {
          role: 'user',
          content: `Analyze this investment strategy: ${strategy}`
        }
      ],
      max_tokens: 700,
      temperature: 0.5
    });

    return response.choices[0]?.message?.content || 'No analysis generated';
  } catch (error) {
    console.error('Strategy Analysis Error:', error);
    throw new Error('Failed to analyze investment strategy');
  }
}
