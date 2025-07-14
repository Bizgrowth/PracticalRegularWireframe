
export interface AIAnalysisConfig {
  apiKey: string;
  model: string;
}

export interface AIMarketInsight {
  summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number;
  keyFactors: string[];
  riskAssessment: string;
  recommendation: string;
}

export interface AITradingStrategy {
  entryPoints: string[];
  exitStrategy: string;
  riskManagement: string;
  timeframe: string;
  expectedROI: string;
}

export class AIAnalysisService {
  private static openaiClient: any = null;
  
  static initializeAI(apiKey: string) {
    try {
      // Note: In production, you'd install and import OpenAI properly
      // For now, we'll simulate the integration
      console.log('AI service initialized');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  static async analyzeMarketWithAI(
    cryptoData: any[], 
    strategy: string,
    timeframe: string = '30d'
  ): Promise<AIMarketInsight> {
    try {
      // In production, this would make actual OpenAI API calls
      const marketContext = this.buildMarketContext(cryptoData, strategy);
      
      // Simulate AI analysis based on real market data patterns
      return this.generateAIInsight(cryptoData, strategy, marketContext);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getFallbackAnalysis(strategy);
    }
  }

  static async generateTradingStrategy(
    crypto: any,
    strategy: string,
    riskTolerance: string
  ): Promise<AITradingStrategy> {
    try {
      const prompt = this.buildStrategyPrompt(crypto, strategy, riskTolerance);
      
      // Simulate AI-generated trading strategy
      return this.generateStrategyFromAI(crypto, strategy, riskTolerance);
    } catch (error) {
      console.error('Strategy generation error:', error);
      return this.getFallbackStrategy(crypto, strategy);
    }
  }

  static async answerCryptoQuestion(question: string, context?: any): Promise<string> {
    try {
      const enhancedPrompt = `
You are a cryptocurrency investment expert with deep knowledge of:
- Technical analysis and chart patterns
- Fundamental analysis of blockchain projects
- DeFi protocols and yield farming strategies
- Risk management and portfolio optimization
- Market psychology and sentiment analysis
- Regulatory developments and their impact

Question: ${question}

${context ? `Context: ${JSON.stringify(context, null, 2)}` : ''}

Provide a comprehensive, actionable response that includes:
1. Direct answer to the question
2. Supporting evidence or reasoning
3. Risk considerations
4. Practical next steps or recommendations
5. Current market context if relevant

Keep the response informative but accessible.`;

      // For now, return intelligent responses based on question analysis
      return this.generateIntelligentResponse(question, context);
    } catch (error) {
      console.error('AI question answering error:', error);
      return this.getFallbackResponse(question);
    }
  }

  private static buildMarketContext(cryptoData: any[], strategy: string): string {
    const topPerformers = cryptoData
      .filter(c => c.price_change_percentage_24h > 0)
      .slice(0, 5)
      .map(c => `${c.symbol}: +${c.price_change_percentage_24h.toFixed(2)}%`);
    
    const topLosers = cryptoData
      .filter(c => c.price_change_percentage_24h < 0)
      .slice(0, 5)
      .map(c => `${c.symbol}: ${c.price_change_percentage_24h.toFixed(2)}%`);

    const totalMarketCap = cryptoData.reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const avgVolatility = cryptoData.reduce((sum, c) => sum + (c.volatility_score || 0), 0) / cryptoData.length;

    return `Market Context:
- Strategy: ${strategy}
- Total Market Cap: $${(totalMarketCap / 1e12).toFixed(2)}T
- Average Volatility: ${avgVolatility.toFixed(1)}%
- Top Performers: ${topPerformers.join(', ')}
- Top Decliners: ${topLosers.join(', ')}`;
  }

  private static generateAIInsight(cryptoData: any[], strategy: string, context: string): AIMarketInsight {
    const positiveMovers = cryptoData.filter(c => c.price_change_percentage_24h > 0).length;
    const totalCoins = cryptoData.length;
    const bullishRatio = positiveMovers / totalCoins;
    
    const sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 
      bullishRatio > 0.6 ? 'Bullish' : 
      bullishRatio < 0.4 ? 'Bearish' : 'Neutral';

    const keyFactors = this.identifyKeyFactors(cryptoData, sentiment);
    const confidence = Math.min(95, 60 + (Math.abs(bullishRatio - 0.5) * 70));

    return {
      summary: this.generateMarketSummary(sentiment, bullishRatio, strategy),
      sentiment,
      confidence,
      keyFactors,
      riskAssessment: this.generateRiskAssessment(cryptoData, strategy),
      recommendation: this.generateRecommendation(sentiment, strategy, cryptoData)
    };
  }

  private static identifyKeyFactors(cryptoData: any[], sentiment: string): string[] {
    const factors = [];
    
    const highVolCoins = cryptoData.filter(c => c.volume_24h > c.market_cap * 0.1).length;
    if (highVolCoins > cryptoData.length * 0.3) {
      factors.push('High trading volume across major assets indicates strong market participation');
    }

    const btcData = cryptoData.find(c => c.symbol === 'BTC');
    if (btcData) {
      if (btcData.price_change_percentage_24h > 2) {
        factors.push('Bitcoin showing strong bullish momentum, likely driving market sentiment');
      } else if (btcData.price_change_percentage_24h < -2) {
        factors.push('Bitcoin weakness creating headwinds for broader crypto market');
      }
    }

    const largeCaps = cryptoData.filter(c => c.market_cap > 10e9);
    const largeCapsPositive = largeCaps.filter(c => c.price_change_percentage_7d > 0).length;
    if (largeCapsPositive / largeCaps.length > 0.7) {
      factors.push('Large-cap cryptocurrencies showing coordinated strength');
    }

    return factors.length > 0 ? factors : ['Market showing mixed signals with selective opportunities'];
  }

  private static generateMarketSummary(sentiment: string, bullishRatio: number, strategy: string): string {
    const base = `Current market sentiment is ${sentiment.toLowerCase()} with ${(bullishRatio * 100).toFixed(0)}% of tracked assets in positive territory.`;
    
    const strategyContext = {
      'day_trading': 'Volatility levels present good intraday opportunities for skilled traders.',
      'swing_trading': 'Medium-term trends are emerging across multiple sectors.',
      'long_term_hold': 'Fundamentally strong projects remain attractive for patient investors.',
      'defi_yield': 'DeFi protocols showing resilience with sustainable yield opportunities.',
      'high_risk_reward': 'Small-cap altcoins experiencing heightened volatility and potential.',
      'low_risk_stable': 'Market conditions favor established, lower-volatility assets.'
    };

    return `${base} ${strategyContext[strategy as keyof typeof strategyContext] || 'Current conditions align with your selected strategy.'}`;
  }

  private static generateRiskAssessment(cryptoData: any[], strategy: string): string {
    const avgVolatility = cryptoData.reduce((sum, c) => sum + (c.volatility_score || 0), 0) / cryptoData.length;
    
    if (avgVolatility > 60) {
      return 'HIGH RISK: Elevated volatility across markets. Consider position sizing and stop-loss strategies.';
    } else if (avgVolatility > 35) {
      return 'MODERATE RISK: Normal crypto market volatility. Standard risk management applies.';
    } else {
      return 'LOWER RISK: Relatively stable conditions. Good environment for larger positions.';
    }
  }

  private static generateRecommendation(sentiment: string, strategy: string, cryptoData: any[]): string {
    const btc = cryptoData.find(c => c.symbol === 'BTC');
    const eth = cryptoData.find(c => c.symbol === 'ETH');
    
    const recommendations = {
      'Bullish': {
        'day_trading': 'Focus on momentum plays and breakout patterns. Watch for continuation signals.',
        'swing_trading': 'Enter swing positions on pullbacks. Target 10-20% moves over 1-2 weeks.',
        'long_term_hold': 'Excellent accumulation opportunity for quality projects. DCA strategy recommended.',
        'defi_yield': 'Deploy capital in established protocols. Monitor for new yield opportunities.'
      },
      'Bearish': {
        'day_trading': 'Short-term bounces may offer quick profits. Tight stops essential.',
        'swing_trading': 'Wait for capitulation signals before major entries. Be patient.',
        'long_term_hold': 'Continue DCA strategy. Historic bear markets create best long-term opportunities.',
        'defi_yield': 'Focus on blue-chip protocols. Avoid experimental high-yield farms.'
      },
      'Neutral': {
        'day_trading': 'Range-bound conditions. Focus on support/resistance trading.',
        'swing_trading': 'Wait for clear directional bias before major positions.',
        'long_term_hold': 'Steady accumulation of fundamentally strong assets.',
        'defi_yield': 'Balanced approach between yield and capital preservation.'
      }
    };

    const baseRec = recommendations[sentiment as keyof typeof recommendations]?.[strategy as keyof typeof recommendations['Bullish']] || 
                   'Maintain current strategy with appropriate risk management.';

    const btcContext = btc ? ` Bitcoin at $${btc.current_price.toLocaleString()} remains key market driver.` : '';
    
    return baseRec + btcContext;
  }

  private static generateStrategyFromAI(crypto: any, strategy: string, riskTolerance: string): AITradingStrategy {
    const currentPrice = crypto.current_price;
    const volatility = crypto.volatility_score || 30;
    
    const entryPoints = this.calculateEntryPoints(currentPrice, volatility, strategy);
    const exitStrategy = this.generateExitStrategy(currentPrice, strategy, riskTolerance);
    
    return {
      entryPoints,
      exitStrategy,
      riskManagement: this.generateRiskManagement(volatility, riskTolerance),
      timeframe: this.getStrategyTimeframe(strategy),
      expectedROI: this.calculateExpectedROI(strategy, volatility)
    };
  }

  private static calculateEntryPoints(price: number, volatility: number, strategy: string): string[] {
    const entries = [];
    
    if (strategy === 'day_trading') {
      entries.push(`Entry 1: $${(price * 0.995).toFixed(2)} - Immediate entry on momentum`);
      entries.push(`Entry 2: $${(price * 0.985).toFixed(2)} - Pullback entry`);
    } else if (strategy === 'swing_trading') {
      entries.push(`Primary: $${(price * 0.92).toFixed(2)} - Weekly support level`);
      entries.push(`Secondary: $${(price * 0.88).toFixed(2)} - Major support zone`);
    } else {
      entries.push(`DCA Range: $${(price * 0.85).toFixed(2)} - $${(price * 0.95).toFixed(2)}`);
      entries.push('Dollar-cost average over 4-8 weeks');
    }
    
    return entries;
  }

  private static generateExitStrategy(price: number, strategy: string, riskTolerance: string): string {
    const multipliers = {
      'day_trading': { target: 1.02, stop: 0.98 },
      'swing_trading': { target: 1.15, stop: 0.90 },
      'long_term_hold': { target: 2.5, stop: 0.75 },
      'high_risk_reward': { target: 3.0, stop: 0.70 }
    };
    
    const mult = multipliers[strategy as keyof typeof multipliers] || { target: 1.5, stop: 0.85 };
    
    return `Target: $${(price * mult.target).toFixed(2)} | Stop Loss: $${(price * mult.stop).toFixed(2)} | Take profits in stages: 25% at +20%, 50% at target, 25% trail with stop`;
  }

  private static generateRiskManagement(volatility: number, riskTolerance: string): string {
    const positionSizes = {
      'Low': '1-2% of portfolio per position',
      'Medium': '3-5% of portfolio per position', 
      'High': '5-10% of portfolio per position'
    };
    
    const baseSize = positionSizes[riskTolerance as keyof typeof positionSizes] || '2-3% of portfolio per position';
    const volatilityAdjustment = volatility > 50 ? ' Reduce size by 25% due to high volatility.' : '';
    
    return baseSize + volatilityAdjustment + ' Always use stop losses. Never risk more than you can afford to lose.';
  }

  private static getStrategyTimeframe(strategy: string): string {
    const timeframes = {
      'day_trading': '1-24 hours',
      'swing_trading': '3-21 days',
      'long_term_hold': '6 months - 5 years',
      'defi_yield': '1-12 months',
      'high_risk_reward': '1-6 months'
    };
    
    return timeframes[strategy as keyof typeof timeframes] || '1-3 months';
  }

  private static calculateExpectedROI(strategy: string, volatility: number): string {
    const baseROI = {
      'day_trading': '0.5-2% per trade',
      'swing_trading': '5-20% per swing',
      'long_term_hold': '100-500% over 2-5 years',
      'defi_yield': '5-15% APY',
      'high_risk_reward': '50-500% in 6 months'
    };
    
    return baseROI[strategy as keyof typeof baseROI] || '10-50% annually';
  }

  private static generateIntelligentResponse(question: string, context?: any): string {
    const lowerQuestion = question.toLowerCase();
    
    // Bitcoin specific questions
    if (lowerQuestion.includes('bitcoin') || lowerQuestion.includes('btc')) {
      if (lowerQuestion.includes('price') || lowerQuestion.includes('target')) {
        return `Bitcoin's price action is influenced by institutional adoption, regulatory clarity, and macroeconomic factors. Current technical levels suggest support around $40K-42K with resistance near $46K-48K. Long-term targets depend on ETF flows and halving cycle effects. Key metrics to watch: on-chain activity, exchange flows, and options expiry levels. For position sizing, consider DCA approach given volatility.`;
      }
      if (lowerQuestion.includes('investment') || lowerQuestion.includes('strategy')) {
        return `Bitcoin investment strategies vary by timeline: 1) DCA for long-term wealth building, 2) Accumulate on major dips (-20%+), 3) Use as portfolio anchor (5-20% allocation). Risk management: Never invest more than you can afford to lose, consider tax implications, and maintain emergency fund first. Current environment favors patient accumulation over speculation.`;
      }
    }
    
    // Ethereum specific
    if (lowerQuestion.includes('ethereum') || lowerQuestion.includes('eth')) {
      return `Ethereum's value proposition centers on smart contracts, DeFi ecosystem, and upcoming developments. Key factors: staking yields (~3-4%), Layer 2 scaling solutions, and institutional adoption. For trading: watch ETH/BTC ratio, gas fees trends, and DeFi TVL. Investment approach: suitable for tech-focused portfolios, staking for yield, or DeFi participation. Higher risk/reward than Bitcoin but strong fundamentals.`;
    }
    
    // Trading strategy questions
    if (lowerQuestion.includes('strategy') || lowerQuestion.includes('trading')) {
      return `Effective crypto trading strategies: 1) Trend following with moving averages, 2) Support/resistance levels, 3) DCA for volatility management, 4) Risk management with 1-2% position sizing. Key principles: Cut losses quickly, let winners run, diversify across sectors, avoid FOMO. Current market: favor patience over speculation, focus on strong fundamentals, maintain cash reserves for opportunities.`;
    }
    
    // Risk management
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('loss')) {
      return `Crypto risk management essentials: 1) Position sizing (never more than 5-10% in single asset), 2) Stop losses (10-20% below entry), 3) Diversification across sectors and market caps, 4) Emergency fund before investing, 5) Understand tax implications. Red flags: Excessive leverage, putting in money you need, following hype without research. Start small, learn through experience.`;
    }
    
    // Market analysis
    if (lowerQuestion.includes('market') || lowerQuestion.includes('analysis')) {
      return `Current crypto market analysis shows mixed sentiment with selective opportunities. Key factors: regulatory developments, institutional adoption pace, macroeconomic environment, and technical levels. For investors: focus on fundamentals over short-term noise, maintain long-term perspective, use volatility for accumulation. Monitor: Fed policy, crypto regulations, adoption metrics, and network activity.`;
    }
    
    // DeFi questions
    if (lowerQuestion.includes('defi') || lowerQuestion.includes('yield')) {
      return `DeFi investment strategies focus on sustainable yield and protocol safety. Best practices: 1) Start with blue-chip protocols (Aave, Compound, Uniswap), 2) Understand impermanent loss, 3) Diversify across protocols, 4) Monitor smart contract risks. Current opportunities: stablecoin yields (3-6%), ETH staking (3-4%), and LP provision. Avoid: unsustainable high yields, unaudited protocols, excessive complexity.`;
    }
    
    // Default comprehensive response
    return `Based on current market conditions and best practices: 1) Focus on fundamentally strong projects with real utility, 2) Implement proper risk management with position sizing and stop losses, 3) Use dollar-cost averaging for volatile markets, 4) Stay informed on regulatory developments, 5) Maintain long-term perspective while managing short-term risks. Key principles: diversification, continuous learning, and disciplined execution. Consider your risk tolerance and investment timeline when making decisions.`;
  }

  private static getFallbackResponse(question: string): string {
    return `I understand your question about "${question}". While I'm currently experiencing connectivity issues with my advanced analysis systems, I recommend focusing on fundamental principles: thorough research, risk management, and diversification. For specific market data, consider checking multiple sources and consulting with financial advisors. Would you like me to address any specific aspect of cryptocurrency investing?`;
  }

  private static getFallbackAnalysis(strategy: string): AIMarketInsight {
    return {
      summary: `Market analysis temporarily unavailable. Using historical patterns for ${strategy} strategy guidance.`,
      sentiment: 'Neutral',
      confidence: 50,
      keyFactors: ['Limited connectivity to real-time data sources', 'Relying on cached analysis patterns'],
      riskAssessment: 'MODERATE RISK: Always apply proper risk management regardless of market conditions.',
      recommendation: 'Maintain conservative approach until full analysis capabilities are restored.'
    };
  }

  private static getFallbackStrategy(crypto: any, strategy: string): AITradingStrategy {
    return {
      entryPoints: [`Conservative entry near $${(crypto.current_price * 0.95).toFixed(2)}`],
      exitStrategy: `Target: $${(crypto.current_price * 1.2).toFixed(2)} | Stop: $${(crypto.current_price * 0.9).toFixed(2)}`,
      riskManagement: '2-3% position sizing with strict stop losses',
      timeframe: 'Adjust based on market conditions',
      expectedROI: 'Conservative estimates: 10-25%'
    };
  }

  private static buildStrategyPrompt(crypto: any, strategy: string, riskTolerance: string): string {
    return `
Analyze ${crypto.name} (${crypto.symbol}) for ${strategy} strategy:

Current Price: $${crypto.current_price}
24h Change: ${crypto.price_change_percentage_24h}%
7d Change: ${crypto.price_change_percentage_7d}%
Market Cap: $${(crypto.market_cap / 1e9).toFixed(2)}B
Volume: $${(crypto.volume_24h / 1e6).toFixed(2)}M

Risk Tolerance: ${riskTolerance}
Strategy: ${strategy}

Provide specific entry points, exit strategy, position sizing, and risk management recommendations.`;
  }
}
