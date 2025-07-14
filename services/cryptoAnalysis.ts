
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  volatility_score: number;
  trend_score: number;
  fundamentals_score: number;
  social_sentiment: number;
}

export interface InvestmentRecommendation {
  rank: number;
  crypto: CryptoData;
  investment_score: number;
  expected_return_30d: number;
  expected_return_90d: number;
  risk_level: 'Low' | 'Medium' | 'High';
  reasoning: string;
  entry_strategy: string;
  target_price: number;
  stop_loss: number;
}

export type InvestmentStrategy = 
  | 'wealth_building'
  | 'passive_income'
  | 'inflation_hedge'
  | 'day_trading'
  | 'swing_trading'
  | 'long_term_hold'
  | 'defi_yield'
  | 'low_risk_stable'
  | 'high_risk_reward';

export interface StrategyConfig {
  name: string;
  description: string;
  timeHorizon: string;
  riskLevel: string;
  goal: string;
  analysisWeight: {
    technical: number;
    fundamental: number;
    momentum: number;
    volatility: number;
    market_cap: number;
  };
}

export const INVESTMENT_STRATEGIES: Record<InvestmentStrategy, StrategyConfig> = {
  wealth_building: {
    name: 'Wealth Building',
    description: 'Long-term accumulation of established cryptocurrencies',
    timeHorizon: '2-5 years',
    riskLevel: 'Medium',
    goal: 'Steady capital appreciation',
    analysisWeight: { technical: 0.2, fundamental: 0.4, momentum: 0.15, volatility: 0.15, market_cap: 0.1 }
  },
  passive_income: {
    name: 'Passive Income',
    description: 'Staking rewards and DeFi yield generation',
    timeHorizon: '6 months - 2 years',
    riskLevel: 'Medium',
    goal: 'Regular income through staking/yield',
    analysisWeight: { technical: 0.15, fundamental: 0.35, momentum: 0.1, volatility: 0.2, market_cap: 0.2 }
  },
  inflation_hedge: {
    name: 'Inflation Hedge',
    description: 'Store of value assets like Bitcoin and gold-backed tokens',
    timeHorizon: '1-10 years',
    riskLevel: 'Low-Medium',
    goal: 'Preserve purchasing power',
    analysisWeight: { technical: 0.15, fundamental: 0.5, momentum: 0.1, volatility: 0.1, market_cap: 0.15 }
  },
  day_trading: {
    name: 'Day Trading',
    description: 'High-frequency trading with quick profit targets',
    timeHorizon: 'Minutes to hours',
    riskLevel: 'Very High',
    goal: 'Quick profits from price movements',
    analysisWeight: { technical: 0.6, fundamental: 0.1, momentum: 0.2, volatility: 0.05, market_cap: 0.05 }
  },
  swing_trading: {
    name: 'Swing Trading',
    description: 'Medium-term trades capturing price swings',
    timeHorizon: '2-30 days',
    riskLevel: 'High',
    goal: 'Profit from market cycles',
    analysisWeight: { technical: 0.45, fundamental: 0.2, momentum: 0.25, volatility: 0.05, market_cap: 0.05 }
  },
  long_term_hold: {
    name: 'Long-term HODL',
    description: 'Buy and hold top-tier cryptocurrencies',
    timeHorizon: '3+ years',
    riskLevel: 'Medium',
    goal: 'Maximum long-term appreciation',
    analysisWeight: { technical: 0.1, fundamental: 0.5, momentum: 0.1, volatility: 0.15, market_cap: 0.15 }
  },
  defi_yield: {
    name: 'DeFi Yield Farming',
    description: 'Liquidity provision and yield optimization',
    timeHorizon: '1-12 months',
    riskLevel: 'High',
    goal: 'High yield through DeFi protocols',
    analysisWeight: { technical: 0.2, fundamental: 0.4, momentum: 0.15, volatility: 0.15, market_cap: 0.1 }
  },
  low_risk_stable: {
    name: 'Low Risk Stable',
    description: 'Conservative approach with established coins',
    timeHorizon: '6 months - 2 years',
    riskLevel: 'Low',
    goal: 'Capital preservation with modest growth',
    analysisWeight: { technical: 0.15, fundamental: 0.4, momentum: 0.05, volatility: 0.25, market_cap: 0.15 }
  },
  high_risk_reward: {
    name: 'High Risk/High Reward',
    description: 'Small-cap altcoins with explosive potential',
    timeHorizon: '1-6 months',
    riskLevel: 'Very High',
    goal: 'Maximum returns from emerging projects',
    analysisWeight: { technical: 0.3, fundamental: 0.3, momentum: 0.3, volatility: 0.05, market_cap: 0.05 }
  }
};

import { AIAnalysisService, AIMarketInsight, AITradingStrategy } from './aiAnalysis';

export class CryptoAnalysisService {
  private static readonly API_BASE = 'https://api.coingecko.com/api/v3';
  private static aiInsights: AIMarketInsight | null = null;
  
  static async fetchTopCryptos(): Promise<CryptoData[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d`
      );
      
      if (!response.ok) {
        return this.getMockData();
      }
      
      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency || 0,
        price_change_percentage_30d: coin.price_change_percentage_30d_in_currency || 0,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        volatility_score: this.calculateVolatilityScore(coin),
        trend_score: this.calculateTrendScore(coin),
        fundamentals_score: this.calculateFundamentalsScore(coin),
        social_sentiment: Math.random() * 100
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getMockData();
    }
  }

  static async generateTop10RecommendationsWithAI(
    cryptos: CryptoData[], 
    strategy: InvestmentStrategy = 'wealth_building'
  ): Promise<InvestmentRecommendation[]> {
    try {
      // Get AI market insights
      this.aiInsights = await AIAnalysisService.analyzeMarketWithAI(cryptos, strategy);
      
      return this.generateTop10Recommendations(cryptos, strategy);
    } catch (error) {
      console.error('AI analysis failed, falling back to standard analysis:', error);
      return this.generateTop10Recommendations(cryptos, strategy);
    }
  }

  static generateTop10Recommendations(
    cryptos: CryptoData[], 
    strategy: InvestmentStrategy = 'wealth_building'
  ): InvestmentRecommendation[] {
    const strategyConfig = INVESTMENT_STRATEGIES[strategy];
    
    // Filter cryptos based on strategy requirements
    const filteredCryptos = this.filterCryptosByStrategy(cryptos, strategy);
    
    const scoredCryptos = filteredCryptos.map(crypto => ({
      crypto,
      investment_score: this.calculateStrategyScore(crypto, strategyConfig),
      expected_return_30d: this.calculateExpectedReturn(crypto, 30, strategy),
      expected_return_90d: this.calculateExpectedReturn(crypto, 90, strategy),
      risk_level: this.calculateRiskLevel(crypto, strategy),
      reasoning: this.generateStrategyReasoning(crypto, strategy),
      entry_strategy: this.generateStrategyEntry(crypto, strategy),
      target_price: this.calculateTargetPrice(crypto, strategy),
      stop_loss: this.calculateStopLoss(crypto, strategy)
    }));

    return scoredCryptos
      .sort((a, b) => b.investment_score - a.investment_score)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        ...item
      }));
  }

  private static filterCryptosByStrategy(cryptos: CryptoData[], strategy: InvestmentStrategy): CryptoData[] {
    switch (strategy) {
      case 'low_risk_stable':
      case 'inflation_hedge':
        return cryptos.filter(c => c.market_cap > 10000000000); // Top 20 by market cap
      
      case 'day_trading':
      case 'swing_trading':
        return cryptos.filter(c => c.volume_24h > c.market_cap * 0.05); // High volume coins
      
      case 'high_risk_reward':
        return cryptos.filter(c => c.market_cap < 1000000000 && c.market_cap > 100000000); // Mid-small cap
      
      case 'defi_yield':
        // Filter for DeFi tokens (simplified - in reality would check categories)
        return cryptos.filter(c => 
          ['UNI', 'AAVE', 'COMP', 'MKR', 'SNX', 'CRV', 'SUSHI', 'YFI', 'CAKE'].includes(c.symbol)
        );
      
      case 'passive_income':
        // Filter for stakeable coins
        return cryptos.filter(c => 
          ['ETH', 'ADA', 'DOT', 'ATOM', 'SOL', 'AVAX', 'MATIC', 'ALGO', 'TEZOS'].includes(c.symbol)
        );
      
      default:
        return cryptos;
    }
  }

  private static calculateStrategyScore(crypto: CryptoData, config: StrategyConfig): number {
    const technicalScore = crypto.trend_score;
    const fundamentalScore = crypto.fundamentals_score;
    const momentumScore = Math.max(0, 50 + (crypto.price_change_percentage_7d + crypto.price_change_percentage_30d) / 2);
    const volatilityScore = 100 - crypto.volatility_score; // Lower volatility = higher score for most strategies
    const marketCapScore = this.getMarketCapScore(crypto.market_cap);

    return Math.max(0, Math.min(100,
      (technicalScore * config.analysisWeight.technical) +
      (fundamentalScore * config.analysisWeight.fundamental) +
      (momentumScore * config.analysisWeight.momentum) +
      (volatilityScore * config.analysisWeight.volatility) +
      (marketCapScore * config.analysisWeight.market_cap)
    ));
  }

  private static getMarketCapScore(marketCap: number): number {
    if (marketCap > 100000000000) return 100; // >100B
    if (marketCap > 10000000000) return 85;   // >10B
    if (marketCap > 1000000000) return 70;    // >1B
    if (marketCap > 100000000) return 50;     // >100M
    return 30; // <100M
  }

  private static calculateExpectedReturn(crypto: CryptoData, days: number, strategy: InvestmentStrategy): number {
    const baseMultiplier = strategy === 'day_trading' ? 0.5 : 
                          strategy === 'swing_trading' ? 1.0 :
                          strategy === 'high_risk_reward' ? 3.0 :
                          strategy === 'low_risk_stable' ? 0.3 : 1.0;

    const trendBonus = crypto.trend_score / 10;
    const momentumBonus = (crypto.price_change_percentage_7d > 0 ? 1.2 : 0.8);
    const timeMultiplier = days / 30;

    return Math.max(-30, Math.min(500, 
      trendBonus * momentumBonus * timeMultiplier * baseMultiplier
    ));
  }

  private static calculateRiskLevel(crypto: CryptoData, strategy: InvestmentStrategy): 'Low' | 'Medium' | 'High' {
    const baseRisk = crypto.volatility_score;
    const strategyRiskBonus = strategy === 'day_trading' || strategy === 'high_risk_reward' ? 30 :
                             strategy === 'swing_trading' || strategy === 'defi_yield' ? 15 :
                             strategy === 'low_risk_stable' || strategy === 'inflation_hedge' ? -20 : 0;

    const totalRisk = baseRisk + strategyRiskBonus;

    if (totalRisk > 60) return 'High';
    if (totalRisk > 30) return 'Medium';
    return 'Low';
  }

  private static generateStrategyReasoning(crypto: CryptoData, strategy: InvestmentStrategy): string {
    const reasons = [];
    
    // Add AI insights if available
    if (this.aiInsights && this.aiInsights.keyFactors.length > 0) {
      const relevantFactor = this.aiInsights.keyFactors[0];
      if (relevantFactor && crypto.symbol === 'BTC' && relevantFactor.includes('Bitcoin')) {
        reasons.push("AI Analysis: " + relevantFactor.substring(0, 50) + "...");
      } else if (crypto.market_cap > 10000000000) {
        reasons.push(`AI Insight: Market showing ${this.aiInsights.sentiment.toLowerCase()} sentiment`);
      }
    }
    
    switch (strategy) {
      case 'wealth_building':
      case 'long_term_hold':
        if (crypto.fundamentals_score > 70) reasons.push("Strong fundamentals for long-term growth");
        if (crypto.market_cap > 10000000000) reasons.push("Established market position");
        break;
      
      case 'day_trading':
      case 'swing_trading':
        if (crypto.volume_24h > crypto.market_cap * 0.1) reasons.push("High liquidity for trading");
        if (crypto.volatility_score > 40) reasons.push("Good volatility for profit opportunities");
        break;
      
      case 'passive_income':
        reasons.push("Staking rewards available");
        if (crypto.fundamentals_score > 60) reasons.push("Sustainable staking ecosystem");
        break;
      
      case 'inflation_hedge':
        if (crypto.symbol === 'BTC') reasons.push("Digital gold with fixed supply");
        if (crypto.market_cap > 50000000000) reasons.push("Store of value characteristics");
        break;
      
      case 'high_risk_reward':
        if (crypto.market_cap < 1000000000) reasons.push("Small cap with growth potential");
        if (crypto.price_change_percentage_30d > 20) reasons.push("Strong recent momentum");
        break;
    }

    return reasons.length > 0 ? reasons.join(", ") : "Fits strategy criteria";
  }

  static async getAIMarketInsights(): Promise<AIMarketInsight | null> {
    return this.aiInsights;
  }

  static async askCryptoExpert(question: string, context?: any): Promise<string> {
    return AIAnalysisService.answerCryptoQuestion(question, context);
  }

  static async generateTradingStrategy(
    crypto: CryptoData, 
    strategy: InvestmentStrategy, 
    riskTolerance: 'Low' | 'Medium' | 'High'
  ): Promise<AITradingStrategy> {
    return AIAnalysisService.generateTradingStrategy(crypto, strategy, riskTolerance);
  }

  private static generateStrategyEntry(crypto: CryptoData, strategy: InvestmentStrategy): string {
    switch (strategy) {
      case 'day_trading':
        return crypto.price_change_percentage_24h > 3 ? "Wait for intraday pullback" : "Enter on breakout confirmation";
      
      case 'swing_trading':
        return crypto.price_change_percentage_7d > 10 ? "Wait for weekly correction" : "Enter on trend continuation";
      
      case 'long_term_hold':
      case 'wealth_building':
        return "Dollar-cost average over 3-6 months";
      
      case 'passive_income':
        return "Accumulate for staking, minimum position size";
      
      default:
        return crypto.price_change_percentage_24h > 5 ? "Wait for pullback" : "Consider current levels";
    }
  }

  private static calculateTargetPrice(crypto: CryptoData, strategy: InvestmentStrategy): number {
    const multiplier = strategy === 'day_trading' ? 1.02 :
                      strategy === 'swing_trading' ? 1.15 :
                      strategy === 'high_risk_reward' ? 2.5 :
                      strategy === 'long_term_hold' ? 3.0 : 1.5;

    return crypto.current_price * multiplier;
  }

  private static calculateStopLoss(crypto: CryptoData, strategy: InvestmentStrategy): number {
    const stopPercent = strategy === 'day_trading' ? 0.98 :
                       strategy === 'swing_trading' ? 0.90 :
                       strategy === 'high_risk_reward' ? 0.75 :
                       strategy === 'low_risk_stable' ? 0.90 : 0.85;

    return crypto.current_price * stopPercent;
  }

  private static calculateVolatilityScore(coin: any): number {
    const price24h = Math.abs(coin.price_change_percentage_24h || 0);
    const price7d = Math.abs(coin.price_change_percentage_7d_in_currency || 0);
    return Math.min(100, (price24h * 2 + price7d) / 3);
  }

  private static calculateTrendScore(coin: any): number {
    const trend24h = coin.price_change_percentage_24h || 0;
    const trend7d = coin.price_change_percentage_7d_in_currency || 0;
    const trend30d = coin.price_change_percentage_30d_in_currency || 0;
    
    const weightedTrend = (trend24h * 0.3 + trend7d * 0.4 + trend30d * 0.3);
    return Math.max(0, Math.min(100, 50 + weightedTrend));
  }

  private static calculateFundamentalsScore(coin: any): number {
    const marketCapScore = coin.market_cap > 1000000000 ? 30 : coin.market_cap > 100000000 ? 20 : 10;
    const volumeScore = coin.total_volume > coin.market_cap * 0.1 ? 25 : 15;
    const supplyScore = coin.max_supply ? 25 : 15;
    const athScore = Math.max(0, 20 + coin.ath_change_percentage / 5);
    
    return marketCapScore + volumeScore + supplyScore + athScore;
  }

  private static getMockData(): CryptoData[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 43250,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d: 8.2,
        price_change_percentage_30d: 15.3,
        market_cap: 847000000000,
        volume_24h: 28000000000,
        circulating_supply: 19600000,
        total_supply: 19600000,
        max_supply: 21000000,
        ath: 69000,
        ath_change_percentage: -37.3,
        volatility_score: 45,
        trend_score: 75,
        fundamentals_score: 85,
        social_sentiment: 78
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2650,
        price_change_percentage_24h: 1.8,
        price_change_percentage_7d: 5.4,
        price_change_percentage_30d: 12.1,
        market_cap: 318000000000,
        volume_24h: 15000000000,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 4878,
        ath_change_percentage: -45.7,
        volatility_score: 42,
        trend_score: 72,
        fundamentals_score: 88,
        social_sentiment: 82
      }
    ];
  }
}
