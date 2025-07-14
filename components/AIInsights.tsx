import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AIMarketInsight } from '@/services/aiAnalysis';

interface AIInsightsProps {
  insights: AIMarketInsight;
}

export function AIInsights({ insights }: AIInsightsProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return '#22c55e';
      case 'Bearish': return '#ef4444';
      case 'Neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="defaultSemiBold">🤖 AI Market Analysis</ThemedText>
        <ThemedView style={styles.sentimentContainer}>
          <ThemedText style={[styles.sentiment, { color: getSentimentColor(insights.sentiment) }]}>
            {insights.sentiment}
          </ThemedText>
          <ThemedText style={styles.confidence}>
            {insights.confidence}% confidence
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.summary}>{insights.summary}</ThemedText>

      <ThemedView style={styles.keyFactors}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Key Factors:</ThemedText>
        {insights.keyFactors.map((factor, index) => (
          <ThemedText key={index} style={styles.factor}>
            • {factor}
          </ThemedText>
        ))}
      </ThemedView>

      <ThemedView style={styles.riskContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Risk Assessment:</ThemedText>
        <ThemedText style={styles.risk}>{insights.riskAssessment}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.recommendationContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>AI Recommendation:</ThemedText>
        <ThemedText style={styles.recommendation}>{insights.recommendation}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sentimentContainer: {
    alignItems: 'flex-end',
  },
  sentiment: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 12,
    color: '#666666',
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    marginBottom: 10,
  },
  keyFactors: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  factor: {
    fontSize: 13,
    color: '#444444',
    marginLeft: 10,
    marginBottom: 2,
  },
  riskContainer: {
    marginBottom: 10,
  },
  risk: {
    fontSize: 13,
    color: '#444444',
    marginLeft: 10,
  },
  recommendationContainer: {
    marginBottom: 5,
  },
  recommendation: {
    fontSize: 13,
    color: '#444444',
    marginLeft: 10,
    fontStyle: 'italic',
  },
});