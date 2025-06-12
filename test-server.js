require('dotenv').config();
const express = require('express');
const app = express();

console.log('API Key loaded:', process.env.CLAUDE_API_KEY ? 'YES' : 'NO');

app.use(express.static('.'));
app.use(express.json());

app.post('/api/claude', (req, res) => {
    console.log('API call received:', req.body);
    console.log('API Key available:', !!process.env.CLAUDE_API_KEY);
    res.json({ response: 'Test response - API working!' });
});

app.listen(3001, () => console.log('Test server running on 3001'));
