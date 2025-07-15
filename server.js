
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
