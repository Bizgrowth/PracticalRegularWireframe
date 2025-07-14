
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
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 11,
    color: '#666',
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  keyFactors: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 6,
    color: '#334155',
  },
  factor: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 3,
  },
  riskContainer: {
    marginBottom: 12,
  },
  risk: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  recommendationContainer: {
    marginBottom: 0,
  },
  recommendation: {
    fontSize: 12,
    lineHeight: 18,
    color: '#059669',
    fontWeight: '500',
  },
});
