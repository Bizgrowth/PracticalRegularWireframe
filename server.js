
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// AI Analysis API endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { riskTolerance, investmentAmount, timeHorizon, experience } = req.body;
    
    // Import OpenAI dynamically
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    });

    const prompt = `As a cryptocurrency investment expert, provide personalized investment advice based on:
    
Investment Profile:
- Risk Tolerance: ${riskTolerance}
- Investment Amount: $${investmentAmount}
- Time Horizon: ${timeHorizon}
- Experience Level: ${experience}

Please provide:
1. Recommended cryptocurrency allocation
2. Specific coins to consider
3. Risk management strategies
4. Entry and exit strategies

Keep the response concise but comprehensive, around 200-300 words.`;

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

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Investment Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate investment analysis'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Crypto Investment AI Expert running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to view the app`);
});
