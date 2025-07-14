
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
  buyDate: string;
  target: number;
  stopLoss: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercentage: number;
  bestPerformer: PortfolioItem | null;
  worstPerformer: PortfolioItem | null;
  diversificationScore: number;
}

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { 
      id: '1', 
      coin: 'BTC', 
      amount: 0.5, 
      buyPrice: 40000, 
      currentPrice: 43250, 
      buyDate: '2024-01-01',
      target: 50000,
      stopLoss: 35000
    },
    { 
      id: '2', 
      coin: 'ETH', 
      amount: 2.0, 
      buyPrice: 2500, 
      currentPrice: 2650, 
      buyDate: '2024-01-05',
      target: 3200,
      stopLoss: 2200
    },
    { 
      id: '3', 
      coin: 'SOL', 
      amount: 10, 
      buyPrice: 95, 
      currentPrice: 108, 
      buyDate: '2024-01-10',
      target: 150,
      stopLoss: 80
    },
  ]);
  
  const [newCoin, setNewCoin] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newStopLoss, setNewStopLoss] = useState('');

  const addToPortfolio = () => {
    if (!newCoin || !newAmount || !newPrice || !newTarget || !newStopLoss) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      coin: newCoin.toUpperCase(),
      amount: parseFloat(newAmount),
      buyPrice: parseFloat(newPrice),
      currentPrice: parseFloat(newPrice),
      buyDate: new Date().toISOString().split('T')[0],
      target: parseFloat(newTarget),
      stopLoss: parseFloat(newStopLoss),
    };

    setPortfolio([...portfolio, newItem]);
    setNewCoin('');
    setNewAmount('');
    setNewPrice('');
    setNewTarget('');
    setNewStopLoss('');
  };

  const removeFromPortfolio = (id: string) => {
    Alert.alert(
      'Remove Position',
      'Are you sure you want to remove this position?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setPortfolio(portfolio.filter(item => item.id !== id));
        }},
      ]
    );
  };

  const calculatePnL = (item: PortfolioItem) => {
    const pnl = (item.currentPrice - item.buyPrice) * item.amount;
    const percentage = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
    return { pnl, percentage };
  };

  const calculateMetrics = (): PortfolioMetrics => {
    const totalValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.amount), 0);
    const totalCost = portfolio.reduce((sum, item) => sum + (item.buyPrice * item.amount), 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    let bestPerformer: PortfolioItem | null = null;
    let worstPerformer: PortfolioItem | null = null;
    let bestPerformance = -Infinity;
    let worstPerformance = Infinity;

    portfolio.forEach(item => {
      const { percentage } = calculatePnL(item);
      if (percentage > bestPerformance) {
        bestPerformance = percentage;
        bestPerformer = item;
      }
      if (percentage < worstPerformance) {
        worstPerformance = percentage;
        worstPerformer = item;
      }
    });

    const uniqueCoins = new Set(portfolio.map(item => item.coin)).size;
    const diversificationScore = Math.min(100, (uniqueCoins / 10) * 100);

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      bestPerformer,
      worstPerformer,
      diversificationScore
    };
  };

  const metrics = calculateMetrics();

  const getPositionStatus = (item: PortfolioItem) => {
    if (item.currentPrice >= item.target) return { status: 'Target Reached', color: '#22c55e' };
    if (item.currentPrice <= item.stopLoss) return { status: 'Stop Loss Hit', color: '#ef4444' };
    return { status: 'Active', color: '#3b82f6' };
  };

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
        <ThemedText type="title">Advanced Portfolio</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.metricsContainer}>
        <ThemedText type="subtitle">Portfolio Analytics</ThemedText>
        
        <ThemedView style={styles.mainMetrics}>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Total Value</ThemedText>
            <ThemedText style={styles.metricValue}>${metrics.totalValue.toFixed(2)}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Total P&L</ThemedText>
            <ThemedText style={[
              styles.metricValue,
              { color: metrics.totalPnL >= 0 ? '#22c55e' : '#ef4444' }
            ]}>
              {metrics.totalPnL >= 0 ? '+' : ''}${metrics.totalPnL.toFixed(2)}
            </ThemedText>
            <ThemedText style={[
              styles.metricSubValue,
              { color: metrics.totalPnL >= 0 ? '#22c55e' : '#ef4444' }
            ]}>
              ({metrics.totalPnLPercentage.toFixed(2)}%)
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.performanceMetrics}>
          <ThemedView style={styles.performanceCard}>
            <ThemedText style={styles.performanceLabel}>Best Performer</ThemedText>
            <ThemedText style={styles.performanceValue}>
              {metrics.bestPerformer ? 
                `${metrics.bestPerformer.coin}: +${calculatePnL(metrics.bestPerformer).percentage.toFixed(1)}%` 
                : 'N/A'
              }
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.performanceCard}>
            <ThemedText style={styles.performanceLabel}>Diversification</ThemedText>
            <ThemedText style={styles.performanceValue}>
              {metrics.diversificationScore.toFixed(0)}/100
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
          <TextInput
            style={styles.input}
            placeholder="Target Price"
            value={newTarget}
            onChangeText={setNewTarget}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Stop Loss"
            value={newStopLoss}
            onChangeText={setNewStopLoss}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addToPortfolio}>
            <ThemedText style={styles.buttonText}>Add Position</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Collapsible>

      <ThemedView style={styles.portfolioList}>
        <ThemedText type="subtitle">Your Positions</ThemedText>
        {portfolio.map((item) => {
          const { pnl, percentage } = calculatePnL(item);
          const positionStatus = getPositionStatus(item);
          const daysHeld = Math.floor((Date.now() - new Date(item.buyDate).getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <ThemedView key={item.id} style={styles.portfolioItem}>
              <ThemedView style={styles.itemHeader}>
                <ThemedView style={styles.coinInfo}>
                  <ThemedText type="defaultSemiBold">{item.coin}</ThemedText>
                  <ThemedText style={styles.amount}>Amount: {item.amount}</ThemedText>
                  <ThemedText style={styles.daysHeld}>Held: {daysHeld} days</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statusBadge}>
                  <ThemedText style={[styles.status, { color: positionStatus.color }]}>
                    {positionStatus.status}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity onPress={() => removeFromPortfolio(item.id)}>
                  <ThemedText style={styles.removeButton}>✕</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              
              <ThemedView style={styles.priceInfo}>
                <ThemedView style={styles.priceRow}>
                  <ThemedText style={styles.priceLabel}>Buy:</ThemedText>
                  <ThemedText>${item.buyPrice.toLocaleString()}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.priceRow}>
                  <ThemedText style={styles.priceLabel}>Current:</ThemedText>
                  <ThemedText>${item.currentPrice.toLocaleString()}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.priceRow}>
                  <ThemedText style={styles.priceLabel}>Target:</ThemedText>
                  <ThemedText style={styles.targetPrice}>${item.target.toLocaleString()}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.priceRow}>
                  <ThemedText style={styles.priceLabel}>Stop Loss:</ThemedText>
                  <ThemedText style={styles.stopLoss}>${item.stopLoss.toLocaleString()}</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.pnlContainer}>
                <ThemedText style={[styles.pnl, pnl >= 0 ? styles.profit : styles.loss]}>
                  P&L: {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({percentage.toFixed(2)}%)
                </ThemedText>
                <ThemedText style={styles.positionValue}>
                  Value: ${(item.currentPrice * item.amount).toFixed(2)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>

      <Collapsible title="Investment Strategies">
        <ThemedText type="defaultSemiBold">Risk Management</ThemedText>
        <ThemedText>• Set stop losses at 15-20% below entry price</ThemedText>
        <ThemedText>• Take profits at 50-100% gains for altcoins</ThemedText>
        <ThemedText>• Use position sizing (max 5% per trade)</ThemedText>
        
        <ThemedText type="defaultSemiBold" style={styles.strategyTitle}>
          Portfolio Allocation
        </ThemedText>
        <ThemedText>• 40-60% large cap (BTC, ETH)</ThemedText>
        <ThemedText>• 20-30% mid cap established projects</ThemedText>
        <ThemedText>• 10-20% small cap/DeFi (higher risk)</ThemedText>
        <ThemedText>• Keep 10-20% in stablecoins for opportunities</ThemedText>
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
  metricsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  mainMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricSubValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  performanceLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
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
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  coinInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 12,
    color: '#666',
  },
  daysHeld: {
    fontSize: 11,
    color: '#888',
  },
  statusBadge: {
    marginRight: 10,
  },
  status: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  removeButton: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  priceInfo: {
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  targetPrice: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  stopLoss: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  pnlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pnl: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  profit: {
    color: '#22c55e',
  },
  loss: {
    color: '#ef4444',
  },
  positionValue: {
    fontSize: 12,
    color: '#666',
  },
  strategyTitle: {
    marginTop: 15,
    marginBottom: 5,
  },
});
