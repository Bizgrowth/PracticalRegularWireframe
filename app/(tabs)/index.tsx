
import { Image } from "expo-image";
import { Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Alert } from "react-native";
import { useState, useEffect } from "react";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InvestmentStrategy {
  id: string;
  name: string;
  description: string;
  timeHorizon: string;
  riskLevel: string;
  expectedReturn: string;
}

interface Investment {
  symbol: string;
  name: string;
  score: number;
  price: string;
  change24h: string;
  marketCap: string;
  analysis: string;
  recommendation: string;
}

const investmentStrategies: InvestmentStrategy[] = [
  {
    id: 'wealth-building',
    name: 'Wealth Building',
    description: 'Long-term accumulation strategy focusing on established cryptocurrencies',
    timeHorizon: '2-5 years',
    riskLevel: 'Medium',
    expectedReturn: '15-25% annually'
  },
  {
    id: 'passive-income',
    name: 'Passive Income',
    description: 'Focus on staking rewards and DeFi yield opportunities',
    timeHorizon: '6 months - 2 years',
    riskLevel: 'Medium',
    expectedReturn: '8-15% annually'
  },
  {
    id: 'inflation-hedge',
    name: 'Inflation Hedge',
    description: 'Store of value assets like Bitcoin to protect against inflation',
    timeHorizon: '1-10 years',
    riskLevel: 'Low-Medium',
    expectedReturn: '10-20% annually'
  },
  {
    id: 'day-trading',
    name: 'Day Trading',
    description: 'High-frequency trading for quick profits',
    timeHorizon: 'Minutes to hours',
    riskLevel: 'Very High',
    expectedReturn: '5-50% monthly'
  },
  {
    id: 'swing-trading',
    name: 'Swing Trading',
    description: 'Medium-term trades capturing price swings',
    timeHorizon: '2-30 days',
    riskLevel: 'High',
    expectedReturn: '10-30% monthly'
  },
  {
    id: 'long-term-hodl',
    name: 'Long-term HODL',
    description: 'Buy and hold top-tier cryptocurrencies',
    timeHorizon: '3+ years',
    riskLevel: 'Medium',
    expectedReturn: '20-40% annually'
  },
  {
    id: 'defi-yield',
    name: 'DeFi Yield Farming',
    description: 'Liquidity provision and yield farming opportunities',
    timeHorizon: '1-12 months',
    riskLevel: 'High',
    expectedReturn: '15-50% annually'
  },
  {
    id: 'low-risk-stable',
    name: 'Low Risk Stable',
    description: 'Conservative approach with stablecoins and blue-chip cryptos',
    timeHorizon: '6 months - 2 years',
    riskLevel: 'Low',
    expectedReturn: '5-12% annually'
  },
  {
    id: 'high-risk-reward',
    name: 'High Risk/High Reward',
    description: 'Small-cap altcoins with massive potential',
    timeHorizon: '1-6 months',
    riskLevel: 'Very High',
    expectedReturn: '50-500% potential'
  }
];

export default function HomeScreen() {
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>(investmentStrategies[0]);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardColor = useThemeColor({ light: '#F2F2F7', dark: '#1C1C1E' }, 'background');
  const borderColor = useThemeColor({ light: '#E5E5EA', dark: '#38383A' }, 'background');

  useEffect(() => {
    generateInvestments();
  }, [selectedStrategy]);

  const generateInvestments = async () => {
    setLoading(true);
    try {
      const mockInvestments: Investment[] = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          score: 95,
          price: '$43,250',
          change24h: '+2.5%',
          marketCap: '$847B',
          analysis: 'Strong institutional adoption and ETF approval momentum',
          recommendation: 'Strong Buy'
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          score: 92,
          price: '$2,650',
          change24h: '+3.2%',
          marketCap: '$318B',
          analysis: 'Ethereum 2.0 staking rewards and DeFi ecosystem growth',
          recommendation: 'Buy'
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          score: 88,
          price: '$98.50',
          change24h: '+5.8%',
          marketCap: '$45B',
          analysis: 'High-performance blockchain with growing ecosystem',
          recommendation: 'Buy'
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          score: 85,
          price: '$0.48',
          change24h: '+1.2%',
          marketCap: '$17B',
          analysis: 'Sustainable blockchain with academic approach',
          recommendation: 'Hold'
        },
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          score: 82,
          price: '$36.75',
          change24h: '+4.1%',
          marketCap: '$14B',
          analysis: 'Fast consensus mechanism and subnet technology',
          recommendation: 'Buy'
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          score: 80,
          price: '$7.20',
          change24h: '+2.8%',
          marketCap: '$9B',
          analysis: 'Interoperability solution for multi-chain future',
          recommendation: 'Hold'
        },
        {
          symbol: 'LINK',
          name: 'Chainlink',
          score: 78,
          price: '$14.60',
          change24h: '+1.9%',
          marketCap: '$8B',
          analysis: 'Leading oracle network with real-world data integration',
          recommendation: 'Hold'
        },
        {
          symbol: 'MATIC',
          name: 'Polygon',
          score: 76,
          price: '$0.85',
          change24h: '+3.5%',
          marketCap: '$8B',
          analysis: 'Layer 2 scaling solution for Ethereum',
          recommendation: 'Hold'
        },
        {
          symbol: 'ATOM',
          name: 'Cosmos',
          score: 74,
          price: '$10.20',
          change24h: '+2.1%',
          marketCap: '$4B',
          analysis: 'Internet of blockchains with IBC protocol',
          recommendation: 'Hold'
        },
        {
          symbol: 'NEAR',
          name: 'NEAR Protocol',
          score: 72,
          price: '$3.45',
          change24h: '+4.7%',
          marketCap: '$3B',
          analysis: 'User-friendly blockchain with sharding technology',
          recommendation: 'Speculative Buy'
        }
      ];
      
      setInvestments(mockInvestments);
    } catch (error) {
      console.error('Investment Generation Error:', error);
      Alert.alert('Error', 'Failed to generate investment recommendations');
    } finally {
      setLoading(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const { analyzeWithAI } = await import('@/services/aiAnalysis');
      const response = await analyzeWithAI(question, selectedStrategy.name);
      setAiResponse(response);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiResponse('Sorry, I encountered an error while analyzing your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInvestmentItem = ({ item, index }: { item: Investment; index: number }) => (
    <ThemedView style={[styles.investmentCard, { backgroundColor: cardColor, borderColor }]}>
      <ThemedView style={styles.investmentHeader}>
        <ThemedView style={styles.rankContainer}>
          <ThemedText type="title" style={[styles.rank, { color: tintColor }]}>
            {index + 1}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.investmentInfo}>
          <ThemedText type="defaultSemiBold" style={styles.investmentSymbol}>
            {item.symbol}
          </ThemedText>
          <ThemedText type="caption" style={styles.investmentName}>
            {item.name}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.scoreContainer}>
          <ThemedText type="defaultSemiBold" style={[styles.score, { color: tintColor }]}>
            {item.score}
          </ThemedText>
          <ThemedText type="caption">
            Score
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.priceRow}>
        <ThemedText type="defaultSemiBold" style={styles.price}>
          {item.price}
        </ThemedText>
        <ThemedText style={[styles.change, { color: item.change24h.startsWith('+') ? '#30D158' : '#FF453A' }]}>
          {item.change24h}
        </ThemedText>
      </ThemedView>
      
      <ThemedText type="caption" style={styles.marketCap}>
        Market Cap: {item.marketCap}
      </ThemedText>
      
      <ThemedText style={styles.analysis}>
        {item.analysis}
      </ThemedText>
      
      <ThemedView style={[styles.recommendationBadge, { backgroundColor: tintColor }]}>
        <ThemedText style={[styles.recommendation, { color: '#FFFFFF' }]}>
          {item.recommendation}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Crypto AI Expert</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.container}>
        <ThemedText style={styles.description}>
          Select your investment strategy and get AI-curated recommendations tailored to your risk tolerance and time horizon.
        </ThemedText>

        <TouchableOpacity 
          style={[styles.strategySelector, { backgroundColor: cardColor, borderColor }]} 
          onPress={() => setShowStrategyModal(true)}
        >
          <ThemedView style={styles.strategyInfo}>
            <ThemedText type="defaultSemiBold" style={styles.strategyName}>
              {selectedStrategy.name}
            </ThemedText>
            <ThemedText type="caption" style={styles.strategyDescription}>
              {selectedStrategy.description}
            </ThemedText>
            <ThemedView style={styles.strategyDetails}>
              <ThemedText type="caption">
                Risk: {selectedStrategy.riskLevel} | Time: {selectedStrategy.timeHorizon}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Top 10 Investment Recommendations
        </ThemedText>

        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Generating AI-powered recommendations...</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={investments}
            renderItem={({ item, index }) => renderInvestmentItem({ item, index })}
            keyExtractor={(item) => item.symbol}
            showsVerticalScrollIndicator={false}
            style={styles.investmentsList}
          />
        )}

        <ThemedView style={styles.aiSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ask AI Expert
          </ThemedText>
          <TextInput
            style={[styles.questionInput, { backgroundColor: cardColor, borderColor, color: textColor }]}
            placeholder="Ask about crypto investments, market trends, or strategies..."
            placeholderTextColor={useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text')}
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity 
            style={[styles.askButton, { backgroundColor: tintColor }]} 
            onPress={askAI}
            disabled={loading}
          >
            <ThemedText style={[styles.askButtonText, { color: '#FFFFFF' }]}>
              {loading ? 'Analyzing...' : 'Ask AI'}
            </ThemedText>
          </TouchableOpacity>
          
          {aiResponse ? (
            <ThemedView style={[styles.aiResponseContainer, { backgroundColor: cardColor, borderColor }]}>
              <ThemedText style={styles.aiResponse}>
                {aiResponse}
              </ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>
      </ThemedView>

      <Modal
        visible={showStrategyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title">Investment Strategies</ThemedText>
            <TouchableOpacity onPress={() => setShowStrategyModal(false)}>
              <ThemedText style={[styles.closeButton, { color: tintColor }]}>
                Done
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <FlatList
            data={investmentStrategies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.strategyOption, { backgroundColor: cardColor, borderColor }]}
                onPress={() => {
                  setSelectedStrategy(item);
                  setShowStrategyModal(false);
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.strategyOptionName}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.strategyOptionDescription}>
                  {item.description}
                </ThemedText>
                <ThemedView style={styles.strategyOptionDetails}>
                  <ThemedText type="caption">
                    Risk: {item.riskLevel}
                  </ThemedText>
                  <ThemedText type="caption">
                    Time: {item.timeHorizon}
                  </ThemedText>
                  <ThemedText type="caption">
                    Expected: {item.expectedReturn}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </ThemedView>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  strategySelector: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  strategyInfo: {
    flex: 1,
  },
  strategyName: {
    fontSize: 18,
    marginBottom: 4,
  },
  strategyDescription: {
    marginBottom: 8,
  },
  strategyDetails: {
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  investmentsList: {
    maxHeight: 600,
    marginBottom: 24,
  },
  investmentCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentSymbol: {
    fontSize: 18,
    marginBottom: 2,
  },
  investmentName: {
    opacity: 0.7,
  },
  rankContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  marketCap: {
    marginBottom: 12,
    opacity: 0.7,
  },
  analysis: {
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  recommendation: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiSection: {
    marginTop: 24,
  },
  questionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  askButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  askButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiResponseContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  aiResponse: {
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  strategyOption: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  strategyOptionName: {
    fontSize: 18,
    marginBottom: 8,
  },
  strategyOptionDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  strategyOptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
