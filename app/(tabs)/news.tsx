
import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

interface MarketAnalysis {
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  confidence: number;
  keyLevels: {
    support: number;
    resistance: number;
  };
  recommendation: string;
}

export default function NewsScreen() {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin ETF Sees Record Inflows of $2.4B',
      summary: 'Institutional demand for Bitcoin exposure through ETFs reaches new heights as pension funds and sovereign wealth funds increase allocations.',
      url: 'https://example.com/bitcoin-etf-inflows',
      date: '2024-01-15',
      category: 'Institutional',
      impact: 'High',
      sentiment: 'Bullish'
    },
    {
      id: '2',
      title: 'Ethereum Shanghai Upgrade Reduces Gas Fees by 40%',
      summary: 'The latest Ethereum network upgrade significantly improves transaction efficiency and reduces costs for DeFi users.',
      url: 'https://example.com/ethereum-upgrade',
      date: '2024-01-14',
      category: 'Technology',
      impact: 'High',
      sentiment: 'Bullish'
    },
    {
      id: '3',
      title: 'Regulatory Clarity Emerges in European Union',
      summary: 'New MiCA regulations provide clear framework for cryptocurrency operations across EU member states.',
      url: 'https://example.com/eu-regulations',
      date: '2024-01-13',
      category: 'Regulation',
      impact: 'Medium',
      sentiment: 'Bullish'
    },
    {
      id: '4',
      title: 'DeFi Total Value Locked Surpasses $100B Mark',
      summary: 'Decentralized finance protocols continue expansion with innovative yield strategies and cross-chain integration.',
      url: 'https://example.com/defi-tvl',
      date: '2024-01-12',
      category: 'DeFi',
      impact: 'Medium',
      sentiment: 'Bullish'
    },
    {
      id: '5',
      title: 'Major Bank Adopts Blockchain for Trade Finance',
      summary: 'JPMorgan Chase implements blockchain technology for international trade settlements, reducing processing time by 75%.',
      url: 'https://example.com/bank-blockchain',
      date: '2024-01-11',
      category: 'Adoption',
      impact: 'Medium',
      sentiment: 'Bullish'
    },
  ]);

  const [marketAnalysis] = useState<MarketAnalysis>({
    trend: 'Bullish',
    confidence: 78,
    keyLevels: {
      support: 41500,
      resistance: 46000
    },
    recommendation: 'Accumulate on dips with tight risk management. Strong institutional demand supports current levels.'
  });

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return '#22c55e';
      case 'Bearish': return '#ef4444';
      case 'Neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#2196F3', dark: '#1976D2' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="newspaper"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Market Intelligence</ThemedText>
      </ThemedView>

      <ThemedView style={styles.analysisContainer}>
        <ThemedText type="subtitle">Current Market Analysis</ThemedText>
        <ThemedView style={styles.trendCard}>
          <ThemedView style={styles.trendHeader}>
            <ThemedText style={[styles.trendText, { color: getSentimentColor(marketAnalysis.trend) }]}>
              {marketAnalysis.trend} Trend
            </ThemedText>
            <ThemedText style={styles.confidence}>
              {marketAnalysis.confidence}% Confidence
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.levelsContainer}>
            <ThemedView style={styles.level}>
              <ThemedText style={styles.levelLabel}>Support</ThemedText>
              <ThemedText style={styles.levelValue}>${marketAnalysis.keyLevels.support.toLocaleString()}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.level}>
              <ThemedText style={styles.levelLabel}>Resistance</ThemedText>
              <ThemedText style={styles.levelValue}>${marketAnalysis.keyLevels.resistance.toLocaleString()}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.recommendation}>{marketAnalysis.recommendation}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">📰 Latest Market News</ThemedText>
        {news.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => openURL(item.url)}>
            <ThemedView style={styles.newsContent}>
              <ThemedView style={styles.newsHeader}>
                <ThemedText type="defaultSemiBold" style={styles.newsTitle}>
                  {item.title}
                </ThemedText>
                <ThemedView style={styles.badges}>
                  <ThemedText style={[styles.impactBadge, { backgroundColor: getImpactColor(item.impact) }]}>
                    {item.impact}
                  </ThemedText>
                  <ThemedText style={[styles.sentimentBadge, { color: getSentimentColor(item.sentiment) }]}>
                    {item.sentiment}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.newsSummary}>{item.summary}</ThemedText>
              <ThemedView style={styles.newsFooter}>
                <ThemedText style={styles.newsCategory}>{item.category}</ThemedText>
                <ThemedText style={styles.newsDate}>{item.date}</ThemedText>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <Collapsible title="📚 Complete Investment Guide">
        <ThemedText type="defaultSemiBold">Cryptocurrency Fundamentals</ThemedText>
        <ThemedText>
          • Blockchain Technology: Decentralized ledger ensuring transparency and security
        </ThemedText>
        <ThemedText>
          • Market Capitalization: Total value of all coins in circulation (Price × Supply)
        </ThemedText>
        <ThemedText>
          • Volume: Amount of trading activity indicating liquidity and interest
        </ThemedText>
        <ThemedText>
          • Volatility: Price fluctuation range - higher volatility means higher risk/reward
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Technical Analysis Basics
        </ThemedText>
        <ThemedText>• Support/Resistance: Key price levels where buying/selling pressure emerges</ThemedText>
        <ThemedText>• Moving Averages: 20/50/200 day averages show trend direction</ThemedText>
        <ThemedText>• RSI (Relative Strength Index): Measures overbought/oversold conditions</ThemedText>
        <ThemedText>• MACD: Moving Average Convergence Divergence shows momentum shifts</ThemedText>
        <ThemedText>• Volume Analysis: Confirms price movements and breakouts</ThemedText>
      </Collapsible>

      <Collapsible title="💡 Advanced Trading Strategies">
        <ThemedText type="defaultSemiBold">Dollar-Cost Averaging (DCA)</ThemedText>
        <ThemedText>
          • Invest fixed amounts regularly regardless of price
        </ThemedText>
        <ThemedText>
          • Reduces impact of volatility over time
        </ThemedText>
        <ThemedText>
          • Best for long-term wealth building
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Swing Trading
        </ThemedText>
        <ThemedText>
          • Hold positions for days to weeks
        </ThemedText>
        <ThemedText>
          • Use technical analysis for entry/exit points
        </ThemedText>
        <ThemedText>
          • Requires active monitoring and risk management
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Value Investing
        </ThemedText>
        <ThemedText>
          • Research projects with strong fundamentals
        </ThemedText>
        <ThemedText>
          • Look for undervalued assets with growth potential
        </ThemedText>
        <ThemedText>
          • Focus on utility, team, partnerships, and adoption
        </ThemedText>
      </Collapsible>

      <Collapsible title="⚠️ Risk Management Framework">
        <ThemedText type="defaultSemiBold">Position Sizing Rules</ThemedText>
        <ThemedText>
          • Never risk more than 1-2% of portfolio per trade
        </ThemedText>
        <ThemedText>
          • Limit individual positions to 5-10% of total portfolio
        </ThemedText>
        <ThemedText>
          • Keep 20-30% in stablecoins for opportunities
        </ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Stop Loss Strategies
        </ThemedText>
        <ThemedText>• Set stops 15-20% below entry for swing trades</ThemedText>
        <ThemedText>• Use trailing stops to lock in profits</ThemedText>
        <ThemedText>• Mental stops for long-term positions</ThemedText>
        <ThemedText>• Never move stops against your position</ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Diversification Guidelines
        </ThemedText>
        <ThemedText>• 40-50% Large Cap (BTC, ETH)</ThemedText>
        <ThemedText>• 25-35% Mid Cap established projects</ThemedText>
        <ThemedText>• 10-20% Small Cap/DeFi (higher risk)</ThemedText>
        <ThemedText>• 5-15% Experimental/New sectors</ThemedText>
      </Collapsible>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">📊 Essential Resources</ThemedText>
        <ExternalLink href="https://coinmarketcap.com">
          <ThemedText type="link">CoinMarketCap - Market Data & Rankings</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://coingecko.com">
          <ThemedText type="link">CoinGecko - Comprehensive Analytics</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://tradingview.com">
          <ThemedText type="link">TradingView - Advanced Charts & Analysis</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://defipulse.com">
          <ThemedText type="link">DeFi Pulse - DeFi Protocol Tracking</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://messari.io">
          <ThemedText type="link">Messari - Research & Fundamental Analysis</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://cryptopanic.com">
          <ThemedText type="link">CryptoPanic - News Aggregator</ThemedText>
        </ExternalLink>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analysisContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trendCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 14,
    color: '#444444',
    fontWeight: 'bold',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  level: {
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 12,
    color: '#444444',
  },
  levelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  recommendation: {
    fontSize: 12,
    color: '#444444',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  newsItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2E86C1',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#222222',
  },
  loading: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
  },
  error: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  impactText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  newsContent: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 8,
  },
  newsSource: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  }: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newsContent: {
    gap: 8,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newsTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  impactBadge: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sentimentBadge: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  newsSummary: {
    color: '#444444',
    lineHeight: 18,
    fontSize: 14,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  newsCategory: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  guideTitle: {
    marginTop: 15,
    marginBottom: 5,
  },
});
