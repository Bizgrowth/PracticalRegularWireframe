
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

export class CryptoAnalysisService {
  private static readonly API_BASE = 'https://api.coingecko.com/api/v3';
  
  static async fetchTopCryptos(): Promise<CryptoData[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d`
      );
      
      if (!response.ok) {
        // Fallback data for development
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
        social_sentiment: Math.random() * 100 // Mock social sentiment
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getMockData();
    }
  }

  static generateTop10Recommendations(cryptos: CryptoData[]): InvestmentRecommendation[] {
    const scoredCryptos = cryptos.map(crypto => ({
      crypto,
      investment_score: this.calculateInvestmentScore(crypto),
      expected_return_30d: this.calculateExpectedReturn(crypto, 30),
      expected_return_90d: this.calculateExpectedReturn(crypto, 90),
      risk_level: this.calculateRiskLevel(crypto),
      reasoning: this.generateReasoning(crypto),
      entry_strategy: this.generateEntryStrategy(crypto),
      target_price: crypto.current_price * (1 + this.calculateExpectedReturn(crypto, 90) / 100),
      stop_loss: crypto.current_price * 0.85
    }));

    return scoredCryptos
      .sort((a, b) => b.investment_score - a.investment_score)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        ...item
      }));
  }

  private static calculateInvestmentScore(crypto: CryptoData): number {
    const trendWeight = 0.3;
    const fundamentalsWeight = 0.25;
    const volatilityWeight = 0.2;
    const momentumWeight = 0.15;
    const sentimentWeight = 0.1;

    const momentum = (crypto.price_change_percentage_7d + crypto.price_change_percentage_30d) / 2;
    const volatilityPenalty = Math.max(0, 100 - crypto.volatility_score);

    return Math.max(0, Math.min(100,
      (crypto.trend_score * trendWeight) +
      (crypto.fundamentals_score * fundamentalsWeight) +
      (volatilityPenalty * volatilityWeight) +
      (Math.max(0, momentum + 50) * momentumWeight) +
      (crypto.social_sentiment * sentimentWeight)
    ));
  }

  private static calculateExpectedReturn(crypto: CryptoData, days: number): number {
    const baseReturn = crypto.trend_score / 10;
    const momentumBonus = (crypto.price_change_percentage_7d > 0 ? 1.2 : 0.8);
    const fundamentalsBonus = crypto.fundamentals_score / 100;
    const timeMultiplier = days / 30;

    return Math.max(-50, Math.min(200, 
      baseReturn * momentumBonus * fundamentalsBonus * timeMultiplier
    ));
  }

  private static calculateRiskLevel(crypto: CryptoData): 'Low' | 'Medium' | 'High' {
    if (crypto.volatility_score > 70) return 'High';
    if (crypto.volatility_score > 40) return 'Medium';
    return 'Low';
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

  private static generateReasoning(crypto: CryptoData): string {
    const reasons = [];
    
    if (crypto.trend_score > 70) reasons.push("Strong upward trend");
    if (crypto.fundamentals_score > 70) reasons.push("Solid fundamentals");
    if (crypto.price_change_percentage_7d > 10) reasons.push("Strong weekly momentum");
    if (crypto.volatility_score < 30) reasons.push("Low volatility");
    if (crypto.market_cap > 1000000000) reasons.push("Large market cap stability");
    
    return reasons.length > 0 ? reasons.join(", ") : "Balanced risk-reward profile";
  }

  private static generateEntryStrategy(crypto: CryptoData): string {
    if (crypto.price_change_percentage_24h > 5) {
      return "Wait for pullback before entry";
    } else if (crypto.price_change_percentage_24h < -5) {
      return "Consider buying the dip";
    } else {
      return "Dollar-cost average entry";
    }
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
