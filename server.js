const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
);

// Initialize cache
let apiCache = require('apicache').middleware;
const cache = apiCache('5 minutes'); // Cache for 5 minutes

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// AI Analysis API endpoint
app.post('/api/analyze', cache, async (req, res) => {
  try {
    const { riskTolerance, investmentAmount, timeHorizon, experience } = req.body;

    // Import OpenAI dynamically
    const { OpenAI } = await import('openai');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.includes('***')) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not properly configured. Please set OPENAI_API_KEY in your environment variables.'
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `As a cryptocurrency investment expert, provide TOP 10 RANKED investment recommendations based on comprehensive analysis:

Investment Profile:
- Risk Tolerance: ${riskTolerance}
- Investment Amount: $${investmentAmount}  
- Time Horizon: ${timeHorizon}
- Experience Level: ${experience}

ANALYSIS REQUIREMENTS:
📊 **90-Day Performance Analysis**: Include actual performance data trends
🔮 **Future Outlook**: 3-6 month projections based on fundamentals
📈 **Current Market Position**: Support/resistance levels and momentum
⚖️ **Risk-Adjusted Rankings**: Score each investment 1-10

FORMAT AS NUMBERED LIST (1-10):
**[RANK]. [COIN] ([SYMBOL]) - $[CURRENT_PRICE]**
📊 90-Day Performance: [+/- %]
🎯 Investment Score: [X/10]
💡 Why Now: [2-3 sentence analysis]
📈 Target: $[price] | ⚠️ Risk: [Low/Med/High]

Focus on coins with strong 90-day momentum AND positive future catalysts. Tailor rankings to the specified risk tolerance and investment amount.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional cryptocurrency investment advisor with extensive knowledge of digital assets, market trends, and risk management strategies."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    const response = {
      success: true,
      analysis: analysis
    };

    // Cache the response
    // apiCache.set(cacheKey, {
    //   data: response,
    //   timestamp: Date.now()
    // });

    res.json(response);

  } catch (error) {
    console.error('Investment Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate investment analysis'
    });
  }
});

// Top 10 Cryptocurrencies endpoint
app.get('/api/top10', cache, async (req, res) => {
  try {
    // Import OpenAI dynamically
    const { OpenAI } = await import('openai');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.includes('***')) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not properly configured. Please set OPENAI_API_KEY in your environment variables.'
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `As a cryptocurrency investment analyst, provide detailed analysis for the TOP 10 cryptocurrency investment opportunities. For each cryptocurrency, provide comprehensive analysis formatted as JSON.

**Target Cryptocurrencies:**
1. Bitcoin (BTC)
2. Ethereum (ETH)
3. Binance Coin (BNB)
4. Solana (SOL)
5. XRP (XRP)
6. Cardano (ADA)
7. Dogecoin (DOGE)
8. Avalanche (AVAX)
9. Polygon (MATIC)
10. Chainlink (LINK)

**Required Analysis Framework:**
- 90-day performance analysis with key metrics
- Current market outlook and positioning
- Future growth potential (6-12 month horizon)
- Moderate return investment strategy
- Brief overview of the cryptocurrency's purpose and technology

**Output Format (JSON structure for each crypto):**
{
  "rank": 1,
  "name": "Bitcoin",
  "symbol": "BTC",
  "currentPrice": "$43,250",
  "change24h": "+2.3%",
  "marketCap": "#1",
  "performance90d": "+15.2%",
  "riskLevel": "Low",
  "riskColor": "green",
  "growthPotential": "20-30%",
  "allocation": "25-30%",
  "overview": "Leading cryptocurrency and digital store of value...",
  "keyMetrics": "High institutional adoption, limited supply of 21M coins",
  "marketOutlook": "Positive sentiment with ETF approvals and institutional interest",
  "strategy": "Dollar-cost averaging approach with long-term hold strategy",
  "catalysts": "Spot ETF approvals, institutional adoption, halving event"
}

Provide this analysis for all 10 cryptocurrencies with current market data and professional investment insights.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional cryptocurrency investment analyst specializing in comprehensive market analysis and investment recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const analysis = completion.choices[0].message.content;

    const response = {
      success: true,
      analysis: analysis
    };

    // Cache the response
    // apiCache.set(cacheKey, {
    //   data: response,
    //   timestamp: Date.now()
    // });

    res.json(response);

  } catch (error) {
    console.error('Top 10 Cryptocurrencies Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate top 10 cryptocurrency analysis'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    supabase: {
      configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Crypto Investment AI Expert running on port ${PORT}`);
  console.log(`📱 Open http://0.0.0.0:${PORT} to view the app`);
});