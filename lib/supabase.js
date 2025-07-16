
import { createClient } from '@supabase/supabase-js';

// Use Replit PostgreSQL if available, otherwise fall back to Supabase
const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (databaseUrl) {
  // Using Replit PostgreSQL - create a simple client
  const { Client } = require('pg');
  
  supabase = {
    from: (table) => ({
      select: (columns = '*') => ({
        eq: async (column, value) => {
          const client = new Client({ connectionString: databaseUrl });
          await client.connect();
          const result = await client.query(`SELECT ${columns} FROM ${table} WHERE ${column} = $1`, [value]);
          await client.end();
          return { data: result.rows, error: null };
        }
      }),
      insert: async (data) => {
        const client = new Client({ connectionString: databaseUrl });
        await client.connect();
        // Implementation for insert would go here
        await client.end();
        return { data: [], error: null };
      }
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => {}
    }
  };
} else {
  // Using Supabase
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_') || supabaseAnonKey.includes('YOUR_')) {
    console.warn('Database credentials not properly configured. Portfolio features will be unavailable.');
  }

  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder-key'
  );
}

export { supabase };
