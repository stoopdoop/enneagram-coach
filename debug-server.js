const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('.'));
app.use(express.json());

app.post('/api/claude', async (req, res) => {
    try {
        const requestBody = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: 'Hello test'
            }]
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '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',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response:', responseText);
        
        if (response.status === 401) {
            res.status(401).json({ error: 'API key invalid', details: responseText });
        } else {
            const data = JSON.parse(responseText);
            res.json({ response: data.content[0].text });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log('Debug server running'));
