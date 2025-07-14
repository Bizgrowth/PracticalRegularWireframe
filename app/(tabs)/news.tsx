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
}

export default function NewsScreen() {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High',
      summary: 'Bitcoin has surged to unprecedented levels as institutional adoption continues to grow.',
      url: 'https://example.com/bitcoin-ath',
      date: '2024-01-15',
      category: 'Market'
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Staking Rewards Explained',
      summary: 'Learn how to earn passive income through Ethereum staking and what rewards to expect.',
      url: 'https://example.com/eth-staking',
      date: '2024-01-14',
      category: 'Education'
    },
    {
      id: '3',
      title: 'DeFi Protocols Show Strong Growth',
      summary: 'Decentralized finance continues to expand with new protocols and higher TVL.',
      url: 'https://example.com/defi-growth',
      date: '2024-01-13',
      category: 'DeFi'
    },
  ]);

  const openURL = (url: string) => {
    Linking.openURL(url);
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
        <ThemedText type="title">Crypto News & Learning</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Latest News</ThemedText>
        {news.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => openURL(item.url)}>
            <ThemedView style={styles.newsContent}>
              <ThemedText type="defaultSemiBold" style={styles.newsTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.newsSummary}>{item.summary}</ThemedText>
              <ThemedView style={styles.newsFooter}>
                <ThemedText style={styles.newsCategory}>{item.category}</ThemedText>
                <ThemedText style={styles.newsDate}>{item.date}</ThemedText>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <Collapsible title="Beginner's Guide">
        <ThemedText type="defaultSemiBold">What is Bitcoin?</ThemedText>
        <ThemedText>
          Bitcoin is a decentralized digital currency that operates without a central bank or single administrator.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          How to Get Started
        </ThemedText>
        <ThemedText>1. Choose a reputable cryptocurrency exchange</ThemedText>
        <ThemedText>2. Complete identity verification</ThemedText>
        <ThemedText>3. Add a payment method</ThemedText>
        <ThemedText>4. Start with small investments</ThemedText>
        <ThemedText>5. Learn about wallet security</ThemedText>
      </Collapsible>

      <Collapsible title="Trading Strategies">
        <ThemedText type="defaultSemiBold">Dollar-Cost Averaging (DCA)</ThemedText>
        <ThemedText>
          Invest a fixed amount regularly regardless of price to reduce volatility impact.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          HODL Strategy
        </ThemedText>
        <ThemedText>
          Hold your investments for the long term, ignoring short-term price fluctuations.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
          Technical Analysis
        </ThemedText>
        <ThemedText>
          Study price charts and patterns to make informed trading decisions.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Risk Management">
        <ThemedText>
          • Never invest more than you can afford to lose
        </ThemedText>
        <ThemedText>
          • Diversify your portfolio across different assets
        </ThemedText>
        <ThemedText>
          • Use stop-loss orders to limit potential losses
        </ThemedText>
        <ThemedText>
          • Keep emotions in check - stick to your strategy
        </ThemedText>
        <ThemedText>
          • Stay informed about market trends and news
        </ThemedText>
      </Collapsible>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recommended Resources</ThemedText>
        <ExternalLink href="https://coindesk.com">
          <ThemedText type="link">CoinDesk - Crypto News</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://coinmarketcap.com">
          <ThemedText type="link">CoinMarketCap - Market Data</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://academy.binance.com">
          <ThemedText type="link">Binance Academy - Education</ThemedText>
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
  section: {
    marginBottom: 20,
  },
  newsItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  newsContent: {
    gap: 5,
  },
  newsTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  newsSummary: {
    color: '#666',
    lineHeight: 18,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  newsItemContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
});