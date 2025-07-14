
import { Image } from "expo-image";
import { Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [topInvestments, setTopInvestments] = useState('');
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [marketTrends, setMarketTrends] = useState('');
  const [loadingTrends, setLoadingTrends] = useState(false);

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
        <ThemedText type="subtitle">Ask Your Crypto Questions</ThemedText>
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
        <ThemedText type="subtitle">🎯 Daily Top 10 Investment Recommendations</ThemedText>
        <ThemedText style={styles.description}>
          Expert AI-curated investment picks based on 90-day performance, fundamentals, and growth catalysts.
        </ThemedText>
        <TouchableOpacity style={styles.investmentButton} onPress={generateDailyTop10} disabled={loadingInvestments}>
          <ThemedText style={styles.buttonText}>
            {loadingInvestments ? 'Curating Investments...' : 'Generate Expert Top 10'}
          </ThemedText>
        </TouchableOpacity>
        {topInvestments && (
          <ThemedView style={styles.investmentContainer}>
            <ThemedText type="defaultSemiBold">🏆 Today's Expert Investment Picks:</ThemedText>
            <ThemedText style={styles.investments}>{topInvestments}</ThemedText>
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
});
