
export interface InvestmentStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  timeHorizon: string;
  features: string[];
  weights: {
    technical: number;
    fundamental: number;
    momentum: number;
    volatility: number;
    marketCap: number;
  };
}

export const INVESTMENT_STRATEGIES: InvestmentStrategy[] = [
  {
    id: 'wealth-building',
    name: 'Wealth Building',
    description: 'Long-term accumulation strategy focused on established cryptocurrencies with strong fundamentals',
    riskLevel: 'Medium',
    timeHorizon: '2-5 years',
    features: ['Diversified portfolio', 'Dollar-cost averaging', 'Compound growth'],
    weights: { technical: 0.2, fundamental: 0.4, momentum: 0.15, volatility: 0.15, marketCap: 0.1 }
  },
  {
    id: 'passive-income',
    name: 'Passive Income',
    description: 'Generate steady income through staking rewards, DeFi yield farming, and dividend tokens',
    riskLevel: 'Medium',
    timeHorizon: '6 months - 2 years',
    features: ['Staking rewards', 'DeFi yields', 'Regular income'],
    weights: { technical: 0.15, fundamental: 0.35, momentum: 0.1, volatility: 0.2, marketCap: 0.2 }
  },
  {
    id: 'inflation-hedge',
    name: 'Inflation Hedge',
    description: 'Store of value assets like Bitcoin to protect against currency devaluation',
    riskLevel: 'Low',
    timeHorizon: '1-10 years',
    features: ['Bitcoin focus', 'Store of value', 'Inflation protection'],
    weights: { technical: 0.1, fundamental: 0.5, momentum: 0.05, volatility: 0.1, marketCap: 0.25 }
  },
  {
    id: 'day-trading',
    name: 'Day Trading',
    description: 'High-frequency trading with technical analysis for quick profits',
    riskLevel: 'Very High',
    timeHorizon: 'Minutes - Hours',
    features: ['Technical analysis', 'High liquidity', 'Quick execution'],
    weights: { technical: 0.5, fundamental: 0.1, momentum: 0.25, volatility: 0.1, marketCap: 0.05 }
  },
  {
    id: 'swing-trading',
    name: 'Swing Trading',
    description: 'Medium-term trades capturing price swings over days to weeks',
    riskLevel: 'High',
    timeHorizon: '2-30 days',
    features: ['Technical patterns', 'Trend following', 'Risk management'],
    weights: { technical: 0.4, fundamental: 0.2, momentum: 0.3, volatility: 0.05, marketCap: 0.05 }
  },
  {
    id: 'long-term-hodl',
    name: 'Long-term HODL',
    description: 'Buy and hold top-tier cryptocurrencies for maximum long-term gains',
    riskLevel: 'Medium',
    timeHorizon: '3+ years',
    features: ['Buy and hold', 'Top-tier coins', 'Long-term vision'],
    weights: { technical: 0.1, fundamental: 0.5, momentum: 0.1, volatility: 0.1, marketCap: 0.2 }
  },
  {
    id: 'defi-yield-farming',
    name: 'DeFi Yield Farming',
    description: 'Provide liquidity to DeFi protocols for high yield opportunities',
    riskLevel: 'High',
    timeHorizon: '1-12 months',
    features: ['Liquidity provision', 'DeFi protocols', 'High yields'],
    weights: { technical: 0.2, fundamental: 0.3, momentum: 0.2, volatility: 0.15, marketCap: 0.15 }
  },
  {
    id: 'low-risk-stable',
    name: 'Low Risk Stable',
    description: 'Conservative approach with stablecoins and established cryptocurrencies',
    riskLevel: 'Low',
    timeHorizon: '6 months - 2 years',
    features: ['Stablecoins', 'Low volatility', 'Capital preservation'],
    weights: { technical: 0.05, fundamental: 0.4, momentum: 0.05, volatility: 0.35, marketCap: 0.15 }
  },
  {
    id: 'high-risk-high-reward',
    name: 'High Risk/High Reward',
    description: 'Small-cap altcoins with explosive growth potential',
    riskLevel: 'Very High',
    timeHorizon: '1-6 months',
    features: ['Small-cap focus', 'High growth potential', 'Early adoption'],
    weights: { technical: 0.3, fundamental: 0.25, momentum: 0.35, volatility: 0.05, marketCap: 0.05 }
  }
];
