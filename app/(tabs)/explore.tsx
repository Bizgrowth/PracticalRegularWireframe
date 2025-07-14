
import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface PortfolioItem {
  id: string;
  coin: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
}

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: '1', coin: 'BTC', amount: 0.5, buyPrice: 40000, currentPrice: 43250 },
    { id: '2', coin: 'ETH', amount: 2.0, buyPrice: 2500, currentPrice: 2650 },
  ]);
  
  const [newCoin, setNewCoin] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addToPortfolio = () => {
    if (!newCoin || !newAmount || !newPrice) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      coin: newCoin.toUpperCase(),
      amount: parseFloat(newAmount),
      buyPrice: parseFloat(newPrice),
      currentPrice: parseFloat(newPrice), // Would fetch from API in real app
    };

    setPortfolio([...portfolio, newItem]);
    setNewCoin('');
    setNewAmount('');
    setNewPrice('');
  };

  const calculatePnL = (item: PortfolioItem) => {
    const pnl = (item.currentPrice - item.buyPrice) * item.amount;
    const percentage = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
    return { pnl, percentage };
  };

  const totalValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.amount), 0);
  const totalCost = portfolio.reduce((sum, item) => sum + (item.buyPrice * item.amount), 0);
  const totalPnL = totalValue - totalCost;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4CAF50', dark: '#2E7D32' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="dollarsign.circle"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Portfolio Tracker</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.summaryContainer}>
        <ThemedText type="subtitle">Portfolio Summary</ThemedText>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Total Value: ${totalValue.toFixed(2)}</ThemedText>
          <ThemedText>Total Cost: ${totalCost.toFixed(2)}</ThemedText>
        </ThemedView>
        <ThemedText style={[styles.pnl, totalPnL >= 0 ? styles.profit : styles.loss]}>
          P&L: ${totalPnL.toFixed(2)} ({((totalPnL / totalCost) * 100).toFixed(2)}%)
        </ThemedText>
      </ThemedView>

      <Collapsible title="Add New Position">
        <ThemedView style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Coin (BTC, ETH, etc.)"
            value={newCoin}
            onChangeText={setNewCoin}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={newAmount}
            onChangeText={setNewAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Buy Price"
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addToPortfolio}>
            <ThemedText style={styles.buttonText}>Add to Portfolio</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Collapsible>

      <ThemedView style={styles.portfolioList}>
        <ThemedText type="subtitle">Your Holdings</ThemedText>
        {portfolio.map((item) => {
          const { pnl, percentage } = calculatePnL(item);
          return (
            <ThemedView key={item.id} style={styles.portfolioItem}>
              <ThemedView style={styles.coinInfo}>
                <ThemedText type="defaultSemiBold">{item.coin}</ThemedText>
                <ThemedText>Amount: {item.amount}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.priceInfo}>
                <ThemedText>Buy: ${item.buyPrice}</ThemedText>
                <ThemedText>Current: ${item.currentPrice}</ThemedText>
                <ThemedText style={[styles.pnl, pnl >= 0 ? styles.profit : styles.loss]}>
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({percentage.toFixed(2)}%)
                </ThemedText>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>

      <Collapsible title="Investment Tips">
        <ThemedText>
          • Diversify your portfolio across different cryptocurrencies
        </ThemedText>
        <ThemedText>
          • Never invest more than you can afford to lose
        </ThemedText>
        <ThemedText>
          • Consider dollar-cost averaging for long-term investments
        </ThemedText>
        <ThemedText>
          • Stay updated with market news and trends
        </ThemedText>
      </Collapsible>
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
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  pnl: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profit: {
    color: '#22c55e',
  },
  loss: {
    color: '#ef4444',
  },
  addForm: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  portfolioList: {
    marginTop: 15,
  },
  portfolioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  coinInfo: {
    flex: 1,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
});
