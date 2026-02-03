import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Mic, Play, Pause, X, Bot, User, Award, ArrowRight, Settings } from 'lucide-react';
import api from '../utils/api';

const MockInterview = () => {
    const [status, setStatus] = useState('setup'); // setup, active, completed
    const [topic, setTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('Beginner');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    // Human-like Phrases
    const phrases = {
        intros: [
            "Nice to meet you. I'll be conducting your technical interview today.",
            "Hi there. I'm looking forward to discussing your background and skills.",
            "Hello. Let's dive into some technical concepts and see how you approach problems."
        ],
        thinking: [
            "Let me see...",
            "Interesting...",
            "Okay...",
            "Right...",
            "Taking a look..."
        ],
        transitions: [
            "Moving on to the next topic.",
            "Let's shift gears a bit.",
            "Here's a scenario for you.",
            "Ready for the next one?",
            "Okay, next question."
        ],
        praise: [
            "That's a solid explanation. I like how you structured that.",
            "Spot on. You clearly understand the core concept.",
            "Exactly. That's the key point I was looking for.",
            "Good answer. Efficient and clear.",
            "I agree with your reasoning there."
        ],
        correction: [
            "That's one way to look at it, but typically we consider...",
            "You're close, but you missed a crucial detail. Consider this:",
            "Not quite. In a production environment, we'd actually say:",
            "I see where you're coming from, but strictly speaking:",
            "That's a common misconception. Actually,"
        ],
        unknown: [
            "That's okay! It's better to admit when you're unsure than to guess. Here's how it works:",
            "No worries, this is a tricky concept. Let me break it down for you:",
            "That's perfectly fine. We encounter this often. Here's the key takeaway:",
            "Honesty is good. Let's turn this into a learning moment:",
            "Don't sweat it. Let's go through the answer together:"
        ],
        short: [
            "Could you elaborate on that a bit more?",
            "That's a start, but I'd love to hear more details.",
            "Can you expand on that? usage or examples?",
            "Brief is good, but for this interview, walk me through your thinking.",
            "Interesting point. How would you apply that in a real feature?"
        ],
        partial: [
            "You're on the right track, but there's a bit more to it.",
            "You've got the core idea. Don't forget about the edge cases.",
            "That's partially correct. Also consider the performance implications.",
            "Good start. Expanding on that...",
            "You covered one aspect well. Let's look at the full picture:"
        ]
    };

    // Scenario-Based Questions
    const questionBank = {
        Frontend: [
            {
                q: "Imagine you have a variable inside a function that you need to access after the function finishes executing. How would you implement this pattern in JavaScript?",
                keywords: ["closure", "outer scope", "lexical", "return function", "remember"],
                explanation: "This describes a **Closure**. A closure allows a function to access variables from its outer (enclosing) lexical scope even after that outer function has returned."
            },
            {
                q: "We noticed our React app is re-rendering too often. How would you debug this and what techniques would you use to optimize performance?",
                keywords: ["memo", "usememo", "usecallback", "profiler", "dependency array", "virtual dom"],
                explanation: "I'd start by using the **React Profiler** to identify expensive renders. Then, I'd apply `React.memo` for components, and `useMemo`/`useCallback` to cache values and functions."
            },
            {
                q: "How would you design a button component that needs to support multiple themes (light/dark) and sizes without prop drilling?",
                keywords: ["context api", "css variables", "styled components", "theme provider", "props"],
                explanation: "I would use **React Context API** or a **Theme Provider** to pass theme data globally. For the component itself, I'd use CSS variables or a utility-first approach to handle the dynamic styles."
            },
             {
                q: "Explain the Box Model to a junior developer who is confused why their element is wider than the specified width.",
                keywords: ["box-sizing", "border-box", "padding", "border", "content-box"],
                explanation: "The default `content-box` adds padding and border to the defined width. I'd explain how `box-sizing: border-box` solves this by including padding and border *within* the total width."
            }
        ],
        Backend: [
            {
                q: "We need to choose a database for a social media app with millions of interconnected users. SQL or NoSQL? Defend your choice.",
                keywords: ["nosql", "graph database", "relationships", "scaling", "flexible schema", "sql"],
                explanation: "For complex relationships (friends of friends), a **Graph Database** (NoSQL) like Neo4j is ideal. If strict consistency is key (payments), SQL is better. For general feeds, a document store (MongoDB) works well for scaling."
            },
            {
                q: "You have an endpoint that performs a heavy image processing task. How do you prevent this from blocking the main thread in Node.js?",
                keywords: ["worker threads", "child process", "queue", "offload", "asynchronous", "cluster"],
                explanation: "Since Node is single-threaded, I would offload CPU-intensive tasks to **Worker Threads**, a separate **Microservice**, or use a message queue (like RabbitMQ) to process it asynchronously background."
            },
            {
                q: "I want to log every incoming request method and URL in my Express app. Where would I put this logic?",
                keywords: ["middleware", "app.use", "before routes", "logging", "next"],
                explanation: "I would create a custom **Middleware** function using `app.use()` at the top level of the application, before any route definitions, ensuring it intercepts every request."
            }
        ],
        Behavioral: [
            {
                q: "Tell me about a time you had to deal with a legacy codebase with no documentation. How did you handle it?",
                keywords: ["read code", "tests", "debug", "small changes", "documentation", "ask team"],
                explanation: "I started by reading existing tests to understand expected behavior. I used debuggers to trace execution flow, refactored small pieces incrementally, and wrote documentation as I learned."
            },
             {
                q: "A Product Manager gives you a feature requirement that you know will cause performance issues. What do you do?",
                keywords: ["communicate", "trade-offs", "alternative", "data", "compromise", "solution"],
                explanation: "I would communicate the technical risks clearly, explaining *why* it affects performance. I'd then propose an **alternative solution** that meets the user need without compromising the system."
            }
        ]
    };

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const startInterview = () => {
        if (!topic) return;
        setStatus('active');
        setIsTyping(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        
        setTimeout(() => {
            const firstQ = questionBank[topic][0];
            setMessages([
                { id: 1, sender: 'ai', text: `${getRandom(phrases.intros)} I'm your interviewer for the ${topic} role.` },
                { id: 2, sender: 'ai', text: `Let's start with this: ${firstQ.q}` }
            ]);
            setIsTyping(false);
        }, 1500);
    };

    const evaluateAnswer = (answer, questionObj) => {
        const lowerAnswer = answer.toLowerCase();
        return questionObj.keywords.filter(k => lowerAnswer.includes(k.toLowerCase()));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newUserMsg = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);

        const currentQ = questionBank[topic][currentQuestionIndex];
        const matches = evaluateAnswer(inputText, currentQ);
        const matchCount = matches.length;
        const threshold = 1;

        // Simulate "Reading/Thinking" Delay
        const thinkingDelay = Math.random() * 1000 + 1000;

        setTimeout(() => {
            let feedback = "";
            let isUnknown = ["i don't know", "idk", "no idea", "not sure", "pass", "skip", "no clue"].some(phrase => inputText.toLowerCase().includes(phrase));
            let isShort = inputText.length < 20 && !isUnknown; // Too short, unless it's an "IDK"
            let isCorrect = matchCount >= threshold;

            if (isUnknown) {
                 feedback = `${getRandom(phrases.unknown)} ${currentQ.explanation}`;
            } else if (isShort) {
                 feedback = `${getRandom(phrases.short)}`;
                 // Don't advance index, let them try again or give a hint in real app. 
                 // For this mock flow, we'll append the explanation after a nudge.
                 feedback += ` (Hint: ${currentQ.explanation.split('.')[0]}...)`;
            } else if (matchCount >= threshold) {
                 const joinedMatches = matches.slice(0, 2).map(m => `**${m}**`).join(" and ");
                 feedback = `Good job mentioning ${joinedMatches}. ${getRandom(phrases.praise)} ${currentQ.explanation.split('.')[0]}.`;
                 setScore(s => s + 10);
            } else if (matchCount > 0) { // Partial match (found some keywords but maybe not main ones / distinct count low)
                 // If threshold is 1, this block is unreachable unless we raise threshold. 
                 // Let's assume we want "Strong" answers to have 2+ matches?
                 // For now, let's treat 1 match as "Partial" if we want strictness, but 1 is currently "Correct".
                 // Let's rely on the text content.
                 feedback = `${getRandom(phrases.partial)} ${currentQ.explanation}`;
                 setScore(s => s + 5);
            } else {
                 feedback = `I noticed you didn't mention **${currentQ.keywords[0]}** or **${currentQ.keywords[1]}**. ${getRandom(phrases.correction)} ${currentQ.explanation}`;
            }

            // Send Feedback
            const feedbackMsgId = Date.now() + 1;
            setMessages(prev => [...prev, { id: feedbackMsgId, sender: 'ai', text: feedback, isCorrection: !matchCount >= threshold && !isShort }]);

            // Next Question Flow with Transition
            setTimeout(() => {
                 const nextIndex = currentQuestionIndex + 1;
                 if (nextIndex < questionBank[topic].length) {
                     setCurrentQuestionIndex(nextIndex);
                     const nextQ = questionBank[topic][nextIndex];
                     const transition = getRandom(phrases.transitions);
                     setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: `${transition} ${nextQ.q}` }]);
                     setIsTyping(false);
                 } else {
                     setMessages(prev => [...prev, { id: Date.now() + 3, sender: 'ai', text: "That wraps up our technical session. I have a good sense of your skills now." }]);
                     
                     // Save interview session to backend
                     setTimeout(async () => {
                         try {
                             await api.post('/dashboard/interview/complete', {
                                 type: topic.toLowerCase(),
                                 questions: [],
                                 overallScore: score / 10, // Convert to 1-5 scale
                                 duration: 15 // Approximate minutes
                             });
                         } catch (error) {
                             console.error('Error saving interview session:', error);
                         }
                         setStatus('completed');
                     }, 2500);
                 }
            }, isCorrect ? 2000 : 5000); // Longer pause if user needs to read correction

        }, thinkingDelay);
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-background text-white pb-10">
            {/* HEADERS */}
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Bot className="text-primary" size={40} /> AI Mock Interview
                </h1>
                <p className="text-muted text-lg">Experience a realistic technical interview with scenario-based questions.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* SETUP PHASE */}
                    {status === 'setup' && (
                        <motion.div 
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-surface border border-white/10 rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Interview Configuration</h2>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Role / Topic</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.keys(questionBank).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                topic === t 
                                                ? 'border-primary bg-primary/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                                                : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            <div className="font-bold text-lg mb-1">{t}</div>
                                            <div className="text-xs opacity-70">Interview for {t} Role</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                           
                            {/* Difficulty (Visual only for now) */}
                             <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Difficulty Level</label>
                                <div className="flex bg-black/30 rounded-lg p-1 w-max border border-white/10">
                                    {['Junior', 'Mid-Level', 'Senior'].map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${difficulty === d ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>{d}</button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={startInterview}
                                disabled={!topic}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                    topic ? 'bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/25 transform hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Enter Interview Room <ArrowRight />
                            </button>
                        </motion.div>
                    )}

                    {/* ACTIVE INTERVIEW PHASE */}
                    {status === 'active' && (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[600px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-black/40 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white leading-tight">Interviewer ({difficulty})</h3>
                                        <span className="text-xs text-green-400 flex items-center gap-1">● Live • {topic}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                     <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">Score: {score}</div>
                                     <button onClick={() => setStatus('setup')} className="text-gray-400 hover:text-red-400 transition-colors"><X size={20} /></button>
                                </div>
                            </div>

                            {/* Chat Log */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-white/10' : 'bg-primary/20'}`}>
                                            {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} className="text-primary" />}
                                        </div>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : msg.isCorrection ? 'bg-orange-500/10 border border-orange-500/20 text-orange-100 rounded-tl-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1"><Bot size={14} className="text-primary" /></div>
                                        <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                             {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
                                <div className="flex gap-2 relative">
                                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type your answer..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:bg-black/40 transition-all pl-4" />
                                    <button type="submit" disabled={!inputText.trim()} className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-all flex items-center justify-center shadow-lg"><Send size={20} /></button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* COMPLETED PHASE */}
                    {status === 'completed' && (
                         <motion.div key="completed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-2xl p-10 text-center shadow-2xl max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Award size={48} className="text-green-400" /></div>
                            <h2 className="text-3xl font-bold mb-2">Interview Completed!</h2>
                            <p className="text-gray-400 mb-8">You showed great potential. Keep practicing!</p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-primary">{score}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest">Total XP</div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-purple-400">{topic && Math.round((score / (questionBank[topic].length * 10)) * 100)}%</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest">Accuracy</div>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => setStatus('setup')} className="px-6 py-3 rounded-lg font-bold border border-white/20 hover:bg-white/5 transition-all text-sm">Back to Menu</button>
                                <button onClick={() => { setStatus('setup'); setTopic(null); }} className="px-6 py-3 rounded-lg font-bold bg-primary hover:bg-primary/80 transition-all text-white text-sm shadow-lg">Start New Interview</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MockInterview;
