import { StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { cryptoAnalysisService } from '@/services/cryptoAnalysis';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Investment {
  coin: string;
  symbol: string;
  price: number;
  change24h: number;
  recommendation: string;
  confidence: number;
  reasoning: string;
}

export default function HomeScreen() {
  const [recommendations, setRecommendations] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);

  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');

  const strategies = [
    'DCA (Dollar Cost Averaging)',
    'HODLing Strategy',
    'Swing Trading',
    'Momentum Trading',
    'Value Investing',
    'Technical Analysis',
    'Fundamental Analysis',
    'Risk Management'
  ];

  const getTop10Recommendations = async () => {
    setLoading(true);
    try {
      const recs = await cryptoAnalysisService.getTop10Recommendations();
      setRecommendations(recs);
    } catch (error) {
      Alert.alert('Error', 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const askExpertQuestion = async () => {
    if (!question.trim()) return;

    setAnswerLoading(true);
    try {
      const response = await cryptoAnalysisService.askExpertQuestion(question);
      setAnswer(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to get expert answer');
    } finally {
      setAnswerLoading(false);
    }
  };

  const renderRecommendation = ({ item }: { item: Investment }) => (
    <ThemedView style={[styles.recommendationCard, { backgroundColor: cardBackground, borderColor }]}>
      <ThemedView style={styles.coinHeader}>
        <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
          {item.coin} ({item.symbol})
        </ThemedText>
        <ThemedText style={[styles.price, { color: textColor }]}>
          ${item.price.toFixed(4)}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.changeContainer}>
        <ThemedText style={[
          styles.change,
          { color: item.change24h >= 0 ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].danger }
        ]}>
          {item.change24h >= 0 ? '▲' : '▼'} {Math.abs(item.change24h).toFixed(2)}%
        </ThemedText>
        <ThemedText style={[styles.recommendation, { color: Colors[colorScheme ?? 'light'].primary }]}>
          {item.recommendation}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.confidenceContainer}>
        <ThemedText style={{ color: useThemeColor({}, 'textSecondary') }}>
          Confidence: {item.confidence}%
        </ThemedText>
      </ThemedView>

      <ThemedText style={[styles.reasoning, { color: useThemeColor({}, 'textMuted') }]}>
        {item.reasoning}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.backgroundSecondary, dark: Colors.dark.backgroundSecondary }}
      headerImage={
        <ThemedView style={[styles.headerContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
          <IconSymbol size={80} name="dollarsign.circle" color={Colors[colorScheme ?? 'light'].primary} />
          <ThemedText type="title" style={{ color: textColor, textAlign: 'center', marginTop: 10 }}>
            Crypto AI Expert
          </ThemedText>
        </ThemedView>
      }>

      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText type="subtitle" style={{ color: textColor, marginBottom: 15 }}>
            Daily Top 10 Recommendations
          </ThemedText>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={getTop10Recommendations}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Analyzing...' : 'Get AI Recommendations'}
            </ThemedText>
          </TouchableOpacity>

          {recommendations.length > 0 && (
            <FlatList
              data={recommendations}
              renderItem={renderRecommendation}
              keyExtractor={(item) => item.symbol}
              style={styles.recommendationsList}
              scrollEnabled={false}
            />
          )}
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText type="subtitle" style={{ color: textColor, marginBottom: 15 }}>
            Ask the Expert
          </ThemedText>

          <TextInput
            style={[styles.input, { backgroundColor, borderColor, color: textColor }]}
            placeholder="Ask about crypto strategies, analysis, or market trends..."
            placeholderTextColor={useThemeColor({}, 'textMuted')}
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].secondary }]}
            onPress={askExpertQuestion}
            disabled={answerLoading || !question.trim()}
          >
            <ThemedText style={styles.buttonText}>
              {answerLoading ? 'Processing...' : 'Get Expert Answer'}
            </ThemedText>
          </TouchableOpacity>

          {answer && (
            <ThemedView style={[styles.answerContainer, { backgroundColor, borderColor }]}>
              <ThemedText style={{ color: textColor, lineHeight: 20 }}>
                {answer}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: cardBackground, borderColor }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
            onPress={() => setShowStrategies(true)}
          >
            <ThemedText style={styles.buttonText}>
              View Investment Strategies
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <Modal visible={showStrategies} animationType="slide" transparent>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={[styles.modalContent, { backgroundColor: cardBackground }]}>
              <ThemedText type="subtitle" style={[styles.modalTitle, { color: textColor }]}>
                Investment Strategies
              </ThemedText>

              <FlatList
                data={strategies}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.strategyOption, { borderBottomColor: borderColor }]}>
                    <ThemedText style={{ color: textColor }}>{item}</ThemedText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: Colors[colorScheme ?? 'light'].textMuted }]}
                onPress={() => setShowStrategies(false)}
              >
                <ThemedText style={styles.closeButtonText}>Close</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  answerContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  recommendationsList: {
    marginTop: 10,
  },
  recommendationCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  change: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendation: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    marginBottom: 8,
  },
  reasoning: {
    fontSize: 12,
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  strategyOption: {
    padding: 15,
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});