const Groq = require('groq-sdk');

// Initialize Groq SDK. 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateResponse = async (req, res) => {
    try {
        const { messages, topic, difficulty } = req.body;
        
        if (!messages || !topic) {
            return res.status(400).json({ error: 'Messages and topic are required' });
        }

        const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a ${difficulty || 'Mid-Level'} ${topic} role. 
Keep your responses conversational, realistic, and relatively concise (2-4 sentences max). Ask one relevant technical or behavioral question at a time based on the topic.
Do not break character. Do not provide the answer immediately if the user struggles; instead, give a hint or guide them. If they explicitly say they don't know, explain it briefly and move on to the next question.
The history of the conversation is provided. Respond directly to the user's latest message. Formulate your response using Markdown (for any code snippets or bold text).`;

        // Map existing messages to Groq format.
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));
        
        const lastMessage = messages[messages.length - 1].text;

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'assistant', content: `Understood. I'll stay in character and act as the interviewer.` },
                ...history,
                { role: 'user', content: lastMessage }
            ]
        });

        res.json({ text: response.choices[0].message.content });
    } catch (error) {
        console.error('AI Interview Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
};

const generateFeedback = async (req, res) => {
    try {
        const { messages, topic, difficulty } = req.body;
        
        if (!messages || messages.length === 0) {
           return res.status(400).json({ error: 'Messages are required for feedback' });
        }

        const prompt = `Review the following mock interview transcript for a ${difficulty} ${topic} role.
Provide detailed feedback in JSON format with exactly these four keys: 
- "score": a number from 0 to 100 representing overall performance
- "strengths": an array of strings (max 3) highlighting what the candidate did well
- "weaknesses": an array of strings (max 3) highlighting areas to improve
- "tips": an array of strings (max 3) with actionable advice for their next interview.

Do not return markdown code blocks around the JSON. Just return the raw JSON string.
Transcript:
${JSON.stringify(messages)}`;

        const response = await groq.chat.completions.create({
             model: 'llama-3.3-70b-versatile',
             messages: [
                 { role: 'user', content: prompt }
             ],
             response_format: { type: "json_object" }
        });

        let feedbackText = response.choices[0].message.content;
        const feedback = JSON.parse(feedbackText);
        res.json(feedback);
    } catch (error) {
        console.error('AI Feedback Error:', error);
        res.status(500).json({ error: 'Failed to generate feedback' });
    }
};

module.exports = { generateResponse, generateFeedback };
