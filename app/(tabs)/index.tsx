
import { Image } from "expo-image";
import { Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal } from "react-native";
import { useState, useEffect } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { 
  CryptoAnalysisService, 
  InvestmentRecommendation, 
  InvestmentStrategy, 
  INVESTMENT_STRATEGIES 
} from "@/services/cryptoAnalysis";
import { Collapsible } from "@/components/Collapsible";

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>('wealth_building');
  const [showStrategyModal, setShowStrategyModal] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setRefreshing(true);
      const cryptos = await CryptoAnalysisService.fetchTopCryptos();
      const top10 = CryptoAnalysisService.generateTop10Recommendations(cryptos, selectedStrategy);
      setRecommendations(top10);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [selectedStrategy]);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      // Mock AI response for crypto questions
      const responses = [
        "Based on current market analysis, Bitcoin shows strong institutional support with increasing adoption. Consider dollar-cost averaging for long-term positions.",
        "Ethereum's transition to proof-of-stake has improved its fundamentals. The upcoming Shanghai upgrade could provide additional upside potential.",
        "Market volatility is expected to continue. Focus on projects with strong fundamentals and real-world utility. Diversification across different crypto sectors is recommended.",
        "DeFi tokens are showing renewed interest. Look for protocols with sustainable yield mechanisms and strong governance. Always assess smart contract risks.",
        "For trading strategies, consider the 20/50 EMA crossover on daily charts. Combine with RSI divergence for better entry points."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAnswer(randomResponse);
    } catch (error) {
      setAnswer('Error connecting to AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFB800", dark: "#FF8C00" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.cryptoLogo}
        />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadRecommendations} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Crypto Investment Expert</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.updateContainer}>
        <ThemedText style={styles.updateText}>
          Last Updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
        </ThemedText>
        <TouchableOpacity onPress={loadRecommendations} disabled={refreshing}>
          <ThemedText style={styles.refreshButton}>
            {refreshing ? 'Updating...' : 'Refresh Data'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.strategyContainer}>
        <ThemedText type="subtitle">Investment Strategy</ThemedText>
        <TouchableOpacity 
          style={styles.strategySelector} 
          onPress={() => setShowStrategyModal(true)}
        >
          <ThemedText style={styles.strategyText}>
            {INVESTMENT_STRATEGIES[selectedStrategy].name}
          </ThemedText>
          <ThemedText style={styles.strategyArrow}>▼</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.strategyDescription}>
          {INVESTMENT_STRATEGIES[selectedStrategy].description}
        </ThemedText>
        <ThemedView style={styles.strategyDetails}>
          <ThemedText style={styles.strategyDetail}>
            🎯 Goal: {INVESTMENT_STRATEGIES[selectedStrategy].goal}
          </ThemedText>
          <ThemedText style={styles.strategyDetail}>
            ⏱️ Time: {INVESTMENT_STRATEGIES[selectedStrategy].timeHorizon}
          </ThemedText>
          <ThemedText style={styles.strategyDetail}>
            ⚠️ Risk: {INVESTMENT_STRATEGIES[selectedStrategy].riskLevel}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🏆 Top 10 Picks - {INVESTMENT_STRATEGIES[selectedStrategy].name}</ThemedText>
        <ThemedText style={styles.disclaimer}>
          Customized analysis based on your selected strategy
        </ThemedText>
        
        {recommendations.map((rec) => (
          <ThemedView key={rec.crypto.id} style={styles.recommendationCard}>
            <ThemedView style={styles.rankHeader}>
              <ThemedView style={styles.rankBadge}>
                <ThemedText style={styles.rankText}>#{rec.rank}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.cryptoInfo}>
                <ThemedText type="defaultSemiBold">{rec.crypto.symbol}</ThemedText>
                <ThemedText style={styles.cryptoName}>{rec.crypto.name}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.scoreContainer}>
                <ThemedText style={styles.score}>{rec.investment_score.toFixed(0)}/100</ThemedText>
                <ThemedText style={[styles.risk, { color: getRiskColor(rec.risk_level) }]}>
                  {rec.risk_level} Risk
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.priceContainer}>
              <ThemedText style={styles.currentPrice}>${rec.crypto.current_price.toLocaleString()}</ThemedText>
              <ThemedText style={[
                styles.priceChange,
                { color: rec.crypto.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {rec.crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                {rec.crypto.price_change_percentage_24h.toFixed(2)}% (24h)
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.projectionContainer}>
              <ThemedView style={styles.projection}>
                <ThemedText style={styles.projectionLabel}>30d Target</ThemedText>
                <ThemedText style={styles.projectionValue}>
                  +{rec.expected_return_30d.toFixed(1)}%
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.projection}>
                <ThemedText style={styles.projectionLabel}>90d Target</ThemedText>
                <ThemedText style={styles.projectionValue}>
                  +{rec.expected_return_90d.toFixed(1)}%
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.projection}>
                <ThemedText style={styles.projectionLabel}>Target Price</ThemedText>
                <ThemedText style={styles.projectionValue}>
                  ${rec.target_price.toLocaleString()}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedText style={styles.reasoning}>{rec.reasoning}</ThemedText>
            <ThemedText style={styles.strategy}>Strategy: {rec.entry_strategy}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
      
      <Collapsible title="Ask the Crypto Expert AI">
        <TextInput
          style={styles.input}
          placeholder="Ask about Bitcoin, Ethereum, trading strategies, market analysis..."
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <TouchableOpacity style={styles.askButton} onPress={askAI} disabled={loading}>
          <ThemedText style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Get Expert Analysis'}
          </ThemedText>
        </TouchableOpacity>
        {answer && (
          <ThemedView style={styles.answerContainer}>
            <ThemedText type="defaultSemiBold">Expert Analysis:</ThemedText>
            <ThemedText style={styles.answer}>{answer}</ThemedText>
          </ThemedView>
        )}
      </Collapsible>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Market Overview</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="defaultSemiBold">Bitcoin</ThemedText>
            <ThemedText style={styles.price}>$43,250</ThemedText>
            <ThemedText style={styles.change}>+2.5%</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText type="defaultSemiBold">Ethereum</ThemedText>
            <ThemedText style={styles.price}>$2,650</ThemedText>
            <ThemedText style={styles.change}>+1.8%</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <Modal
        visible={showStrategyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStrategyModal(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Select Investment Strategy
            </ThemedText>
            <ScrollView style={styles.strategyList}>
              {Object.entries(INVESTMENT_STRATEGIES).map(([key, strategy]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.strategyOption,
                    selectedStrategy === key && styles.selectedStrategyOption
                  ]}
                  onPress={() => {
                    setSelectedStrategy(key as InvestmentStrategy);
                    setShowStrategyModal(false);
                  }}
                >
                  <ThemedText style={styles.strategyOptionTitle}>
                    {strategy.name}
                  </ThemedText>
                  <ThemedText style={styles.strategyOptionDescription}>
                    {strategy.description}
                  </ThemedText>
                  <ThemedView style={styles.strategyOptionDetails}>
                    <ThemedText style={styles.strategyOptionDetail}>
                      Risk: {strategy.riskLevel}
                    </ThemedText>
                    <ThemedText style={styles.strategyOptionDetail}>
                      Time: {strategy.timeHorizon}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStrategyModal(false)}
            >
              <ThemedText style={styles.modalCloseText}>Close</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  cryptoLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  updateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#666',
  },
  refreshButton: {
    color: '#FFB800',
    fontWeight: 'bold',
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  recommendationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    backgroundColor: '#FFB800',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 12,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  risk: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  projectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projection: {
    alignItems: 'center',
    flex: 1,
  },
  projectionLabel: {
    fontSize: 10,
    color: '#666',
  },
  projectionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  reasoning: {
    fontSize: 12,
    color: '#444',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  strategy: {
    fontSize: 11,
    color: '#FFB800',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  askButton: {
    backgroundColor: '#FFB800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  answer: {
    marginTop: 5,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  change: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  strategyContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  strategySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  strategyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  strategyArrow: {
    color: '#FFB800',
    fontSize: 12,
  },
  strategyDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  strategyDetails: {
    marginTop: 8,
    gap: 4,
  },
  strategyDetail: {
    fontSize: 11,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  strategyList: {
    maxHeight: 400,
  },
  strategyOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedStrategyOption: {
    backgroundColor: '#fff3e0',
    borderColor: '#FFB800',
    borderWidth: 2,
  },
  strategyOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  strategyOptionDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  strategyOptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strategyOptionDetail: {
    fontSize: 10,
    color: '#888',
  },
  modalCloseButton: {
    backgroundColor: '#FFB800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
