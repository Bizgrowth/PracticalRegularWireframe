
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PortfolioManager({ user }) {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddInvestment, setShowAddInvestment] = useState(false);

  const [newInvestment, setNewInvestment] = useState({
    cryptocurrency_symbol: '',
    cryptocurrency_name: '',
    amount: '',
    buy_price: '',
    notes: ''
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchInvestments();
    }
  }, [selectedPortfolio]);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data);
      if (data.length > 0) {
        setSelectedPortfolio(data[0]);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('portfolio_id', selectedPortfolio.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const addInvestment = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([
          {
            portfolio_id: selectedPortfolio.id,
            cryptocurrency_symbol: newInvestment.cryptocurrency_symbol.toUpperCase(),
            cryptocurrency_name: newInvestment.cryptocurrency_name,
            amount: parseFloat(newInvestment.amount),
            buy_price: parseFloat(newInvestment.buy_price),
            current_price: parseFloat(newInvestment.buy_price),
            notes: newInvestment.notes
          }
        ])
        .select();

      if (error) throw error;
      
      setInvestments([...investments, data[0]]);
      setNewInvestment({
        cryptocurrency_symbol: '',
        cryptocurrency_name: '',
        amount: '',
        buy_price: '',
        notes: ''
      });
      setShowAddInvestment(false);
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const deleteInvestment = async (id) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInvestments(investments.filter(inv => inv.id !== id));
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const calculatePortfolioValue = () => {
    return investments.reduce((total, investment) => {
      return total + (investment.current_price * investment.amount);
    }, 0);
  };

  const calculateTotalCost = () => {
    return investments.reduce((total, investment) => {
      return total + (investment.buy_price * investment.amount);
    }, 0);
  };

  if (loading) {
    return <div className="loading">Loading portfolio...</div>;
  }

  const totalValue = calculatePortfolioValue();
  const totalCost = calculateTotalCost();
  const totalPnL = totalValue - totalCost;

  return (
    <div className="portfolio-manager">
      <div className="portfolio-header">
        <h2>Portfolio Tracker</h2>
        <div className="portfolio-summary">
          <div className="summary-item">
            <span className="label">Total Value:</span>
            <span className="value">${totalValue.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Cost:</span>
            <span className="value">${totalCost.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">P&L:</span>
            <span className={`value ${totalPnL >= 0 ? 'profit' : 'loss'}`}>
              ${totalPnL.toFixed(2)} ({totalCost > 0 ? ((totalPnL / totalCost) * 100).toFixed(2) : 0}%)
            </span>
          </div>
        </div>
      </div>

      <div className="portfolio-actions">
        <button 
          className="add-investment-btn"
          onClick={() => setShowAddInvestment(true)}
        >
          Add Investment
        </button>
      </div>

      {showAddInvestment && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Investment</h3>
            <form onSubmit={addInvestment}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Symbol (e.g., BTC)"
                  value={newInvestment.cryptocurrency_symbol}
                  onChange={(e) => setNewInvestment({...newInvestment, cryptocurrency_symbol: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name (e.g., Bitcoin)"
                  value={newInvestment.cryptocurrency_name}
                  onChange={(e) => setNewInvestment({...newInvestment, cryptocurrency_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="Amount"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Buy Price"
                  value={newInvestment.buy_price}
                  onChange={(e) => setNewInvestment({...newInvestment, buy_price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Notes (optional)"
                  value={newInvestment.notes}
                  onChange={(e) => setNewInvestment({...newInvestment, notes: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">Add Investment</button>
                <button type="button" onClick={() => setShowAddInvestment(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="investments-list">
        <h3>Your Investments</h3>
        {investments.length === 0 ? (
          <p>No investments yet. Add your first investment above!</p>
        ) : (
          investments.map((investment) => {
            const pnl = (investment.current_price - investment.buy_price) * investment.amount;
            const percentage = ((investment.current_price - investment.buy_price) / investment.buy_price) * 100;
            
            return (
              <div key={investment.id} className="investment-card">
                <div className="investment-header">
                  <h4>{investment.cryptocurrency_symbol}</h4>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteInvestment(investment.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="investment-details">
                  <p><strong>Name:</strong> {investment.cryptocurrency_name}</p>
                  <p><strong>Amount:</strong> {investment.amount}</p>
                  <p><strong>Buy Price:</strong> ${investment.buy_price}</p>
                  <p><strong>Current Price:</strong> ${investment.current_price}</p>
                  <p><strong>P&L:</strong> 
                    <span className={pnl >= 0 ? 'profit' : 'loss'}>
                      ${pnl.toFixed(2)} ({percentage.toFixed(2)}%)
                    </span>
                  </p>
                  {investment.notes && <p><strong>Notes:</strong> {investment.notes}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
