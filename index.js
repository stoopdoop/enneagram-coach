const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('.'));
app.use(express.json());

app.post('/api/claude', async (req, res) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `You are an expert Enneagram coach specifically helping a Type ${req.body.userType} person. 

IMPORTANT CONTEXT:
- The user is Type ${req.body.userType} 
- Keep responses conversational, helpful, and under 250 words
- Focus on practical advice and insights specific to their type
- Ask follow-up questions to keep the conversation going
- If they mention relationships with other types, provide specific type compatibility advice
- Stay within Enneagram coaching scope (not therapy)
- Be warm, encouraging, and insightful

USER'S MESSAGE: "${req.body.message}"

Respond as their personal Enneagram coach with specific insights for Type ${req.body.userType}:`
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API error:', response.status, errorText);
            throw new Error(`Claude API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json({ response: data.content[0].text });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message 
        });
    }
});

app.listen(3001, () => {
    console.log('🚀 Working server running on port 3001');
    console.log('Visit: http://localhost:3001/enneagram-coach.html');
});
