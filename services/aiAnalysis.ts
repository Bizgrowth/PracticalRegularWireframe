
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
          content: `You are an elite cryptocurrency investment analyst with 10+ years of experience in digital assets, blockchain technology, and quantitative analysis. Your expertise includes:

          CORE ANALYSIS FRAMEWORK:
          🔹 90-Day Performance Analysis: Momentum indicators, volatility patterns, support/resistance levels
          🔹 Technical Analysis: RSI, MACD, Bollinger Bands, Moving Averages (20/50/200 day)
          🔹 Fundamental Analysis: Technology innovation, team expertise, partnerships, real-world adoption
          🔹 Market Dynamics: Trading volume, market cap growth, institutional interest
          🔹 Risk Assessment: Regulatory compliance, security audits, community sentiment
          🔹 Future Catalysts: Upcoming upgrades, partnerships, ecosystem developments

          INVESTMENT CRITERIA PRIORITY:
          1. Strong 90-day upward trend with healthy corrections
          2. Solid technological foundation and active development
          3. Growing institutional adoption and real-world use cases
          4. Favorable risk-to-reward ratio for 3-6 month horizon
          5. Regulatory clarity and compliance
          6. Strong community and developer ecosystem

          OUTPUT FORMAT:
          **🎯 DAILY TOP 10 CRYPTO INVESTMENTS - [DATE]**
          
          **[RANK]. [COIN NAME] ([SYMBOL]) - $[PRICE]**
          📈 **Investment Thesis:** [2-3 compelling sentences]
          ⚖️ **Risk Level:** [Low/Medium/High] 
          ⏰ **Target Timeframe:** [3-6 months/6-12 months]
          💡 **Key Catalyst:** [Upcoming event/development]
          📊 **90-Day Performance:** [+/- percentage]
          
          Always conclude with: "⚠️ DISCLAIMER: Cryptocurrency investments carry high risk. Only invest what you can afford to lose. This is not financial advice."

          Prioritize coins with strong fundamentals over pure speculation.`
        },
        {
          role: 'user',
          content: `Generate today's expertly curated top 10 cryptocurrency investment recommendations for ${new Date().toDateString()}. Focus on assets with strong 90-day performance trends, solid fundamentals, and high potential for returns over the next 3-6 months. Include both established and emerging cryptocurrencies with strong growth catalysts.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
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

export async function analyzeMarketTrends(): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a cryptocurrency market analyst specializing in trend analysis and market sentiment. Provide comprehensive market analysis covering:

          📊 MARKET ANALYSIS FRAMEWORK:
          - Overall crypto market sentiment and direction
          - Bitcoin dominance and altcoin season indicators
          - Institutional adoption trends and regulatory developments
          - Major resistance and support levels across key cryptocurrencies
          - Sector rotation patterns (DeFi, Layer 1s, Gaming, AI tokens, etc.)
          - Macroeconomic factors affecting crypto markets
          - Fear & Greed Index interpretation
          - Volume analysis and liquidity conditions

          Format your analysis with clear sections and actionable insights for investors.`
        },
        {
          role: 'user',
          content: `Provide a comprehensive cryptocurrency market analysis for ${new Date().toDateString()}. Include current market sentiment, key trends, and what investors should watch for in the coming weeks.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.4
    });

    return response.choices[0]?.message?.content || 'No market analysis generated';
  } catch (error) {
    console.error('Market Analysis Error:', error);
    throw new Error('Failed to analyze market trends');
  }
}
