import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function analyzeWithAI(query: string): Promise<string> {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { text } = await generateText({
      model: openai('gpt-4'),
      system: `You are a crypto and Bitcoin investment expert. Provide detailed, accurate information about:
      - Bitcoin and cryptocurrency fundamentals
      - Investment strategies and risk management
      - Market analysis and trends
      - Trading techniques
      - Portfolio diversification
      - Regulatory considerations

      Always provide balanced, educational content and remind users that all investments carry risk.`,
      prompt: query,
      maxTokens: 500,
      temperature: 0.7,
    });

    return text || 'No response generated';
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze with AI: ' + (error as Error).message);
  }
}

export async function generateTop10Investments(): Promise<string> {
  try {
    const prompt = `As a crypto investment expert, provide today's top 10 cryptocurrency investment recommendations based on:

1. Technical analysis of the last 90 days
2. Market sentiment and trends  
3. Future growth potential
4. Risk-adjusted returns
5. Current market conditions

Format your response as a numbered list with:
- Cryptocurrency name
- Current price estimate
- Recommended action (Buy/Hold/Watch)
- Brief justification (1-2 sentences)

Focus on a mix of established coins (Bitcoin, Ethereum) and promising altcoins with good fundamentals.

Example format:
1. Bitcoin (BTC) - $43,250
   Action: Buy
   Justification: Strong institutional adoption and limited supply making it a hedge against inflation.

2. Ethereum (ETH) - $2,650
   Action: Hold
   Justification: Solid ecosystem with DeFi and NFT growth, post-merge efficiency improvements.

Provide 10 recommendations in this format.`;

    return await analyzeWithAI(prompt);
  } catch (error) {
    console.error('Error generating top 10 investments:', error);
    return `📊 Top 10 Crypto Investment Recommendations:

1. Bitcoin (BTC) - $43,250
   Action: Buy
   Strong institutional adoption and limited supply.

2. Ethereum (ETH) - $2,650  
   Action: Hold
   Leading smart contract platform with strong ecosystem.

3. Solana (SOL) - $98
   Action: Buy
   Fast, low-cost transactions with growing DeFi ecosystem.

4. Cardano (ADA) - $0.45
   Action: Watch
   Strong academic approach, upcoming governance features.

5. Polygon (MATIC) - $0.85
   Action: Buy
   Ethereum scaling solution with major partnerships.

6. Chainlink (LINK) - $14.50
   Action: Hold
   Leading oracle network with real-world integrations.

7. Avalanche (AVAX) - $36
   Action: Buy
   Fast consensus mechanism, growing DeFi ecosystem.

8. Polkadot (DOT) - $5.20
   Action: Watch
   Interoperability focus, parachain ecosystem developing.

9. Cosmos (ATOM) - $7.80
   Action: Buy
   Internet of blockchains, strong staking rewards.

10. Algorand (ALGO) - $0.18
    Action: Watch
    Pure proof-of-stake, focus on institutional adoption.

⚠️ Note: This is for educational purposes only. Always do your own research and consider your risk tolerance before investing.`;
  }
}

export async function generateStrategyBasedRecommendations(strategyId: string, strategyName: string, riskLevel: string, timeHorizon: string, weights: any): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      system: `You are an elite cryptocurrency investment strategist specializing in tailored investment approaches. Your expertise includes:

      STRATEGY-SPECIFIC ANALYSIS:
      🔹 Technical Analysis Weighting: ${weights.technical * 100}%
      🔹 Fundamental Analysis Weighting: ${weights.fundamental * 100}%
      🔹 Momentum Analysis Weighting: ${weights.momentum * 100}%
      🔹 Volatility Assessment Weighting: ${weights.volatility * 100}%
      🔹 Market Cap Consideration: ${weights.marketCap * 100}%

      STRATEGY PARAMETERS:
      📊 Strategy: ${strategyName}
      ⚖️ Risk Level: ${riskLevel}
      ⏰ Time Horizon: ${timeHorizon}

      ANALYSIS FOCUS AREAS:
      - 90-day performance trends and momentum indicators
      - Risk-adjusted returns for the specified time horizon
      - Strategy-specific entry and exit points
      - Volatility patterns matching risk tolerance
      - Market cap considerations for strategy alignment
      - Regulatory compliance and security assessments

      OUTPUT FORMAT:
      **🎯 ${strategyName.toUpperCase()} STRATEGY - TOP 10 RECOMMENDATIONS**
      **📅 Date: ${new Date().toDateString()}**
      **⚖️ Risk Level: ${riskLevel} | ⏰ Time Horizon: ${timeHorizon}**

      **[RANK]. [COIN NAME] ([SYMBOL]) - $[PRICE]**
      📈 **Strategy Fit:** [Why this coin fits the strategy]
      🎯 **Entry Target:** $[Price] | 📊 **Exit Target:** $[Price]
      💡 **Key Catalyst:** [Upcoming event/development]
      📊 **90-Day Performance:** [+/- percentage]
      ⚖️ **Risk Assessment:** [Strategy-specific risk analysis]

      Always conclude with: "⚠️ DISCLAIMER: This analysis is tailored to your selected ${strategyName} strategy. Cryptocurrency investments carry high risk. Only invest what you can afford to lose. This is not financial advice."

      Prioritize coins that align with the strategy's risk profile and time horizon.`,
      prompt: `Generate expertly curated top 10 cryptocurrency investment recommendations specifically tailored for the ${strategyName} strategy. Focus on assets that align with the ${riskLevel} risk level and ${timeHorizon} time horizon. Consider the strategy's unique weighting preferences and provide actionable entry/exit targets.`,
      maxTokens: 2000,
      temperature: 0.3,
    });

    return text || 'No recommendations generated';
  } catch (error) {
    console.error('Strategy Analysis Error:', error);
    throw new Error('Failed to generate strategy-based recommendations');
  }
}

export async function analyzeInvestmentStrategy(strategy: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      system: `You are a crypto investment strategist. Analyze and provide detailed insights on investment strategies including:
      - Strategy explanation and methodology
      - Risk assessment and mitigation
      - Market conditions where strategy works best
      - Expected returns and timeframes
      - Practical implementation steps
      - Common mistakes to avoid`,
      prompt: `Analyze this investment strategy: ${strategy}`,
      maxTokens: 700,
      temperature: 0.5,
    });

    return text || 'No analysis generated';
  } catch (error) {
    console.error('Strategy Analysis Error:', error);
    throw new Error('Failed to analyze investment strategy');
  }
}

export async function analyzeMarketTrends(): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      system: `You are a cryptocurrency market analyst specializing in trend analysis and market sentiment. Provide comprehensive market analysis covering:

      📊 MARKET ANALYSIS FRAMEWORK:
      - Overall crypto market sentiment and direction
      - Bitcoin dominance and altcoin season indicators
      - Institutional adoption trends and regulatory developments
      - Major resistance and support levels across key cryptocurrencies
      - Sector rotation patterns (DeFi, Layer 1s, Gaming, AI tokens, etc.)
      - Macroeconomic factors affecting crypto markets
      - Fear & Greed Index interpretation
      - Volume analysis and liquidity conditions

      Format your analysis with clear sections and actionable insights for investors.`,
      prompt: `Provide a comprehensive cryptocurrency market analysis for ${new Date().toDateString()}. Include current market sentiment, key trends, and what investors should watch for in the coming weeks.`,
      maxTokens: 1000,
      temperature: 0.4,
    });

    return text || 'No market analysis generated';
  } catch (error) {
    console.error('Market Analysis Error:', error);
    throw new Error('Failed to analyze market trends');
  }
}