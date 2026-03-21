const fs = require('fs');
let c = fs.readFileSync('client/src/pages/MockInterview.jsx', 'utf8');

const oldSnippet = "// Optionally save to dashboard exactly like old code";
const startIdx = c.indexOf(oldSnippet);
if (startIdx === -1) {
    console.log('NOT FOUND');
    process.exit(1);
}
// Find the end of the block (the closing });)
const endSnippet = 'duration: 15 - Math.floor(timeLeft / 60)\r\n            });';
const endIdx = c.indexOf(endSnippet, startIdx);
if (endIdx === -1) {
    console.log('END NOT FOUND');
    process.exit(1);
}
const endPos = endIdx + endSnippet.length;

const newCode = `// Save to dashboard - pair up AI questions with user answers
            try {
                const aiMsgs = messages.filter(m => m.sender === 'ai');
                const userMsgs = messages.filter(m => m.sender === 'user');
                const formattedQuestions = aiMsgs.map((msg, idx) => ({
                    question: msg.text,
                    answer: userMsgs[idx] ? userMsgs[idx].text : '',
                    score: 0
                }));
                await api.post('/dashboard/interview/complete', {
                    type: topic.toLowerCase(),
                    questions: formattedQuestions,
                    overallScore: (response.data.score || 0) / 10,
                    duration: 15 - Math.floor(timeLeft / 60)
                });
            } catch (saveError) {
                console.warn('Could not save interview to dashboard:', saveError.message);
            }`;

c = c.substring(0, startIdx) + newCode + c.substring(endPos);
fs.writeFileSync('client/src/pages/MockInterview.jsx', c);
console.log('Replacement successful!');
