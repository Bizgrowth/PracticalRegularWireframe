
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         !supabaseUrl.includes('placeholder') &&
         !supabaseAnonKey.includes('placeholder');
};

// Mock data for when Supabase is not configured
const mockPortfolio = {
  id: 'mock-portfolio-1',
  user_id: 'mock-user-1',
  name: 'My Portfolio',
  created_at: new Date().toISOString()
};

let mockInvestments = [];

// Enhanced client with fallback functionality
export const portfolioClient = {
  async getPortfolios(userId = 'mock-user-1') {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } else {
      // Return mock data
      return { data: [mockPortfolio], error: null };
    }
  },

  async getInvestments(portfolioId = 'mock-portfolio-1') {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });
      return { data, error };
    } else {
      // Return mock data
      return { data: mockInvestments, error: null };
    }
  },

  async addInvestment(investment) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('investments')
        .insert([investment])
        .select();
      return { data, error };
    } else {
      // Add to mock data
      const newInvestment = {
        id: Date.now().toString(),
        ...investment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockInvestments.push(newInvestment);
      return { data: [newInvestment], error: null };
    }
  },

  async deleteInvestment(id) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      return { error };
    } else {
      // Remove from mock data
      mockInvestments = mockInvestments.filter(inv => inv.id !== id);
      return { error: null };
    }
  }
};
