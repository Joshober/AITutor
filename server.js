require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Test API connection with mock response
app.get('/api/test', async (req, res) => {
  res.json({ 
    status: 'Mock Mode', 
    response: 'Hello! This is a test response. The chatbot is working but using mock data since the API key needs credits.' 
  });
});

// List available models
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });
    
    const freeModels = response.data.data.filter(model => 
      model.pricing && model.pricing.prompt === '0' && model.pricing.completion === '0'
    );
    
    res.json({ freeModels: freeModels.map(m => m.id) });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message' });
    }
    
    console.log('Received message:', message);
    
    // Mock response for testing
    const mockResponses = [
      `I understand you're asking about "${message}". As an AI tutor, I'd be happy to help explain this concept.`,
      `That's a great question about "${message}". Let me break this down for you step by step.`,
      `Regarding "${message}", here's what you need to know: This is a mock response since the API key needs credits.`
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    res.json({ response: randomResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});