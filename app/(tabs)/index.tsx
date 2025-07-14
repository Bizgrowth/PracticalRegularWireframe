
import { Image } from "expo-image";
import { Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { useState } from "react";
import React from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { INVESTMENT_STRATEGIES, InvestmentStrategy } from "@/types/investment";

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [topInvestments, setTopInvestments] = useState('');
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [marketTrends, setMarketTrends] = useState('');
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>(INVESTMENT_STRATEGIES[0]);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [strategyRecommendations, setStrategyRecommendations] = useState('');

  // Auto-load top 10 investments on component mount
  React.useEffect(() => {
    generateDailyTop10();
  }, []);

  const testOpenAI = async () => {
    setLoading(true);
    try {
      const { analyzeWithAI } = await import('@/services/aiAnalysis');
      const response = await analyzeWithAI('Test connection - what is Bitcoin?');
      setAnswer('✅ OpenAI API Key Working! Response: ' + response);
    } catch (error) {
      console.error('OpenAI Test Error:', error);
      setAnswer(`❌ OpenAI API Key Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyTop10 = async () => {
    setLoadingInvestments(true);
    try {
      const { generateTop10Investments } = await import('@/services/aiAnalysis');
      const investments = await generateTop10Investments();
      setTopInvestments(investments);
    } catch (error) {
      console.error('Investment Generation Error:', error);
      setTopInvestments(`❌ Failed to generate investments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingInvestments(false);
    }
  };

  const generateStrategyRecommendations = async () => {
    setLoadingInvestments(true);
    try {
      const { generateStrategyBasedRecommendations } = await import('@/services/aiAnalysis');
      const recommendations = await generateStrategyBasedRecommendations(
        selectedStrategy.id,
        selectedStrategy.name,
        selectedStrategy.riskLevel,
        selectedStrategy.timeHorizon,
        selectedStrategy.weights
      );
      setStrategyRecommendations(recommendations);
    } catch (error) {
      console.error('Strategy Generation Error:', error);
      setStrategyRecommendations(`❌ Failed to generate strategy recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingInvestments(false);
    }
  };

  const analyzeMarket = async () => {
    setLoadingTrends(true);
    try {
      const { analyzeMarketTrends } = await import('@/services/aiAnalysis');
      const trends = await analyzeMarketTrends();
      setMarketTrends(trends);
    } catch (error) {
      console.error('Market Analysis Error:', error);
      setMarketTrends(`❌ Failed to analyze market: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingTrends(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const { analyzeWithAI } = await import('@/services/aiAnalysis');
      const response = await analyzeWithAI(question);
      setAnswer(response);
    } catch (error) {
      console.error('AI Error:', error);
      setAnswer(`Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`);
    } finally {
      setLoading(false);
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
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Crypto Expert AI</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🏆 Today's Top 10 Investment Picks</ThemedText>
        <ThemedText style={styles.description}>
          AI-curated daily recommendations based on 90-day performance analysis and future growth potential.
        </ThemedText>
        <TouchableOpacity style={styles.refreshButton} onPress={generateDailyTop10} disabled={loadingInvestments}>
          <ThemedText style={styles.buttonText}>
            {loadingInvestments ? 'Updating...' : '🔄 Refresh Top 10'}
          </ThemedText>
        </TouchableOpacity>
        {topInvestments ? (
          <ThemedView style={styles.top10Container}>
            <ThemedText type="defaultSemiBold">🎯 Today's Expert Picks:</ThemedText>
            <ThemedText style={styles.investments}>{topInvestments}</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              {loadingInvestments ? '📊 Analyzing market data and generating recommendations...' : '💡 Click refresh to load today\'s top investment picks'}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🎯 Strategy-Based Investment Recommendations</ThemedText>
        <ThemedText style={styles.description}>
          Select your investment strategy and get AI-curated recommendations tailored to your risk tolerance and time horizon.
        </ThemedText>
        
        <TouchableOpacity style={styles.strategySelector} onPress={() => setShowStrategyModal(true)}>
          <ThemedView style={styles.strategyInfo}>
            <ThemedText type="defaultSemiBold" style={styles.strategyName}>{selectedStrategy.name}</ThemedText>
            <ThemedText style={styles.strategyDetails}>
              Risk: {selectedStrategy.riskLevel} | Time: {selectedStrategy.timeHorizon}
            </ThemedText>
            <ThemedText style={styles.strategyDescription}>{selectedStrategy.description}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.strategyFeatures}>
          <ThemedText type="defaultSemiBold">Strategy Features:</ThemedText>
          {selectedStrategy.features.map((feature, index) => (
            <ThemedText key={index} style={styles.feature}>• {feature}</ThemedText>
          ))}
        </ThemedView>

        <TouchableOpacity style={styles.investmentButton} onPress={generateStrategyRecommendations} disabled={loadingInvestments}>
          <ThemedText style={styles.buttonText}>
            {loadingInvestments ? 'Analyzing Strategy...' : `Generate ${selectedStrategy.name} Picks`}
          </ThemedText>
        </TouchableOpacity>

        {strategyRecommendations && (
          <ThemedView style={styles.investmentContainer}>
            <ThemedText type="defaultSemiBold">🎯 Strategy-Based Recommendations:</ThemedText>
            <ThemedText style={styles.investments}>{strategyRecommendations}</ThemedText>
          </ThemedView>
        )}

        </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📊 Market Trends Analysis</ThemedText>
        <ThemedText style={styles.description}>
          Get comprehensive market sentiment and trend analysis to inform your investment decisions.
        </ThemedText>
        <TouchableOpacity style={styles.trendsButton} onPress={analyzeMarket} disabled={loadingTrends}>
          <ThemedText style={styles.buttonText}>
            {loadingTrends ? 'Analyzing Market...' : 'Get Market Analysis'}
          </ThemedText>
        </TouchableOpacity>
        {marketTrends && (
          <ThemedView style={styles.trendsContainer}>
            <ThemedText type="defaultSemiBold">📈 Market Analysis:</ThemedText>
            <ThemedText style={styles.trends}>{marketTrends}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">💬 Ask Your Crypto Questions</ThemedText>
        <ThemedText style={styles.description}>
          Get expert advice on Bitcoin, Ethereum, trading strategies, and more from our AI crypto expert.
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ask about Bitcoin, Ethereum, trading strategies..."
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <TouchableOpacity style={styles.askButton} onPress={askAI} disabled={loading}>
          <ThemedText style={styles.buttonText}>
            {loading ? 'Thinking...' : 'Ask AI Expert'}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={testOpenAI} disabled={loading}>
          <ThemedText style={styles.buttonText}>
            {loading ? 'Testing...' : 'Test OpenAI Key'}
          </ThemedText>
        </TouchableOpacity>
        {answer && (
          <ThemedView style={styles.answerContainer}>
            <ThemedText type="defaultSemiBold">AI Response:</ThemedText>
            <ThemedText style={styles.answer}>{answer}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Quick Stats</ThemedText>
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

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Learning Resources</ThemedText>
        <ThemedText>
          Access expert knowledge on blockchain technology, trading strategies, and investment opportunities.
        </ThemedText>
      </ThemedView>

      <Modal visible={showStrategyModal} animationType="slide" transparent>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle">Select Investment Strategy</ThemedText>
              <TouchableOpacity onPress={() => setShowStrategyModal(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <FlatList
              data={INVESTMENT_STRATEGIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.strategyOption,
                    selectedStrategy.id === item.id && styles.selectedStrategy
                  ]}
                  onPress={() => {
                    setSelectedStrategy(item);
                    setShowStrategyModal(false);
                    setStrategyRecommendations(''); // Clear previous recommendations
                  }}
                >
                  <ThemedText type="defaultSemiBold" style={styles.optionName}>{item.name}</ThemedText>
                  <ThemedText style={styles.optionRisk}>Risk: {item.riskLevel} | {item.timeHorizon}</ThemedText>
                  <ThemedText style={styles.optionDescription}>{item.description}</ThemedText>
                </TouchableOpacity>
              )}
              style={styles.strategyList}
            />
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
  testButton: {
    backgroundColor: '#2E86C1',
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
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  investmentButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  investmentContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  investments: {
    marginTop: 8,
    lineHeight: 22,
    fontSize: 14,
  },
  trendsButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  trendsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  trends: {
    marginTop: 8,
    lineHeight: 22,
    fontSize: 14,
  },
  strategySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  strategyInfo: {
    flex: 1,
  },
  strategyName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  strategyDetails: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 10,
  },
  strategyFeatures: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  feature: {
    fontSize: 13,
    color: '#2c3e50',
    marginVertical: 2,
  },
  generalTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  generalButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  generalContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#95a5a6',
  },
  refreshButton: {
    backgroundColor: '#FFB800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  top10Container: {
    marginTop: 15,
    padding: 20,
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#FFB800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    marginTop: 15,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    fontSize: 24,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  strategyList: {
    maxHeight: 400,
  },
  strategyOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedStrategy: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  optionRisk: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});
