const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

app.use(cors());
app.use(express.json());

// Serve all static files
app.use(express.static(__dirname));

// Test route
app.get('/test', (req, res) => {
    res.send('Server is working! Files should be at root.');
});

// Redirect root to the HTML file
app.get('/', (req, res) => {
    res.redirect('/enneagram-coach.html');
});

app.post('/api/claude', async (req, res) => {
    try {
        const { message, userType } = req.body;
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `You are an expert Enneagram coach specifically helping a Type ${userType} person. 
IMPORTANT CONTEXT:
- The user is Type ${userType} 
- Keep responses conversational, helpful, and under 250 words
- Focus on practical advice and insights specific to their type
- Ask follow-up questions to keep the conversation going
- If they mention relationships with other types, provide specific type compatibility advice
- If they mention work situations, give type-specific workplace guidance
- Stay within Enneagram coaching scope (not therapy)
- Be warm, encouraging, and insightful

FORMATTING GUIDELINES:
- Use emojis sparingly but effectively (e.g., 💡 for insights, ❤️ for relationships, 💪 for strengths)
- Use **bold** for key concepts and important points
- Break up text into short, digestible paragraphs (2-3 sentences max)
- Use bullet points for lists or multiple tips
- Add line breaks between main ideas for better readability

USER'S MESSAGE: "${message}"

Respond as their personal Enneagram coach with specific insights for Type ${userType}:`
                }]
            })
        });
        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }
        const data = await response.json();
        res.json({ response: data.content[0].text });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from Claude',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
