import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, X, Bot, User, Award, ArrowRight, Clock, StopCircle, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';

const MockInterview = () => {
    const [status, setStatus] = useState('setup'); // setup, active, completed
    const [topic, setTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('Beginner');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes default
    
    // Voice state
    const [isRecording, setIsRecording] = useState(false);
    
    // Feedback Report state
    const [feedbackReport, setFeedbackReport] = useState(null);

    const questionsTopics = ["Frontend", "Backend", "Behavioral", "System Design", "Database"];

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (status === 'active' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && status === 'active') {
             endInterview();
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Text to Speech
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            // Strip markdown for TTS
            const cleanText = text.replace(/[*#_`~]/g, '').trim();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Voice Recognition (Speech to Text)
    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Input. Please try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                // Safely update the input text without erasing manually typed content
                setInputText((prev) => prev + " " + finalTranscript.trim());
            }
        };
        recognition.onerror = (event) => {
             console.error('Speech recognition error', event.error);
             setIsRecording(false);
        };
        recognition.onend = () => {
             setIsRecording(false);
        };

        recognition.start();
    };

    const startInterview = async () => {
        if (!topic) return;
        setStatus('active');
        setMessages([]);
        setTimeLeft(15 * 60);
        setIsTyping(true);
        
        try {
            const initialMsg = `Hi! I'm ready to start the ${topic} interview at the ${difficulty} level. Let's begin.`;
            // Add a mock system/user start to kickoff
            const kickoffMsgs = [{ id: Date.now(), sender: 'user', text: initialMsg }];
            
            const response = await api.post('/interview/generate', {
                topic,
                difficulty,
                messages: kickoffMsgs
            });
            
            const aiReply = response.data.text;
            setMessages([{ id: Date.now() + 1, sender: 'ai', text: aiReply }]);
            speakText(aiReply);
        } catch (error) {
            console.error('Failed to start interview:', error);
            setMessages([{ id: Date.now() + 1, sender: 'ai', text: 'Error connecting to the interviewer. Please try again.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const userText = inputText.trim();
        if (!userText) return;

        if (isRecording) {
            setIsRecording(false);
            window.speechSynthesis?.cancel();
        }

        const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
        const newMessages = [...messages, newUserMsg];
        
        setMessages(newMessages);
        setInputText('');
        setIsTyping(true);

        try {
             const response = await api.post('/interview/generate', {
                 topic,
                 difficulty,
                 messages: newMessages
             });
             
             const aiReply = response.data.text;
             setMessages([...newMessages, { id: Date.now() + 1, sender: 'ai', text: aiReply }]);
             speakText(aiReply);
        } catch (error) {
             console.error('Failed to send message:', error);
             setMessages([...newMessages, { id: Date.now() + 1, sender: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
        } finally {
             setIsTyping(false);
        }
    };

    const endInterview = async () => {
        window.speechSynthesis?.cancel(); // stop talking
        setIsRecording(false);
        setStatus('completed');
        setFeedbackReport(null); // Reset report while loading
        
        try {
            const response = await api.post('/interview/feedback', {
                topic,
                difficulty,
                messages: messages
            });
            setFeedbackReport(response.data);
            
            // Save to dashboard - pair up AI questions with user answers
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
            }
            
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            setFeedbackReport({
                score: 0,
                strengths: ['Unable to generate report due to backend error.'],
                weaknesses: ['API Error occurred.'],
                tips: ['Please try taking another interview later.']
            });
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-background text-text pb-10">
            {/* HEADERS */}
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Bot className="text-primary" size={40} /> AI Mock Interview
                </h1>
                <p className="text-muted text-lg">Experience a realistic technical interview powered by AI.</p>
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
                                <label className="block text-sm font-bold text-muted mb-3 uppercase tracking-wider">Select Role / Topic</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {questionsTopics.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                topic === t 
                                                ? 'border-primary bg-primary/10 text-primary dark:text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                                                : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 text-muted hover:border-black/20 dark:hover:border-white/30'
                                            }`}
                                        >
                                            <div className="font-bold text-lg mb-1">{t}</div>
                                            <div className="text-xs opacity-70">Interview for {t} Role</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                           
                             <div className="mb-8">
                                <label className="block text-sm font-bold text-muted mb-3 uppercase tracking-wider">Difficulty Level</label>
                                <div className="flex bg-black/5 dark:bg-black/30 rounded-lg p-1 w-max border border-black/10 dark:border-white/10">
                                    {['Junior', 'Mid-Level', 'Senior'].map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${difficulty === d ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-text'}`}>{d}</button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={startInterview}
                                disabled={!topic}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                    topic ? 'bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/25 transform hover:scale-[1.02]' : 'bg-gray-200 dark:bg-gray-800 text-muted cursor-not-allowed'
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
                            className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[650px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-surface/50 dark:bg-black/40 p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                        <Bot size={20} className="text-white" />
                                        {/* Speaking Indicator */}
                                        {!isTyping && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 border-2 border-indigo-400 rounded-full" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text leading-tight">AI Interviewer ({difficulty})</h3>
                                        <span className="text-xs text-green-500 flex items-center gap-1">● Live • {topic}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                     <div className={`text-sm font-bold flex items-center gap-1 px-3 py-1 rounded-full ${timeLeft < 300 ? 'bg-red-500/10 text-red-500' : 'bg-black/10 dark:bg-white/10'}`}>
                                         <Clock size={16} /> {formatTime(timeLeft)}
                                     </div>
                                     <button onClick={endInterview} className="text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors tooltip" title="End Interview Early">
                                         <StopCircle size={22} />
                                     </button>
                                </div>
                            </div>

                            {/* Chat Log */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/5 dark:bg-black/20">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-black/10 dark:bg-white/10' : 'bg-primary/20'}`}>
                                            {msg.sender === 'user' ? <User size={14} className="text-text" /> : <Bot size={14} className="text-primary" />}
                                        </div>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'bg-white border border-black/10 text-text dark:bg-white/5 dark:text-gray-200 dark:border-white/5 rounded-tl-none'
                                        }`}>
                                            {/* Markdown rendering for AI MSgs if needed */}
                                            {msg.sender === 'ai' ? (
                                                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                                    <ReactMarkdown>
                                                    {msg.text}
                                                </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <span>{msg.text}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1"><Bot size={14} className="text-primary" /></div>
                                        <div className="bg-white dark:bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-black/10 dark:border-white/5 flex items-center gap-1">
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                             {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-surface/50 dark:bg-black/40 border-t border-black/10 dark:border-white/10 backdrop-blur-md">
                                <div className="flex gap-2 relative">
                                    <button 
                                        type="button" 
                                        onClick={toggleRecording}
                                        className={`px-4 rounded-xl flex items-center justify-center transition-all shadow-md ${
                                            isRecording 
                                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-text'
                                        }`}
                                        title={isRecording ? "Stop Recording" : "Start Voice Input"}
                                    >
                                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>
                                    <input 
                                        type="text" 
                                        value={inputText} 
                                        onChange={(e) => setInputText(e.target.value)} 
                                        className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface dark:focus:bg-black/40 transition-all" 
                                        placeholder={isRecording ? "Listening..." : "Type your answer..."}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!inputText.trim()} 
                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-all flex items-center justify-center shadow-lg"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* COMPLETED PHASE */}
                    {status === 'completed' && (
                         <motion.div key="completed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
                            {!feedbackReport ? (
                                <div className="text-center py-10">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold mb-2">Analyzing Interview...</h2>
                                    <p className="text-muted">The AI is generating your personalized feedback report.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-center mb-8">
                                        <div className="inline-flex w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-4"><Award size={40} className="text-green-500" /></div>
                                        <h2 className="text-3xl font-bold mb-2">Interview Completed</h2>
                                        <p className="text-muted">Here is your comprehensive performance breakdown.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-black/5 dark:bg-black/20 p-4 rounded-xl text-center border border-black/10 dark:border-white/5">
                                            <div className="text-3xl font-black text-primary mb-1">{feedbackReport.score}<span className="text-lg text-muted font-medium">/100</span></div>
                                            <div className="text-xs text-muted uppercase tracking-widest font-bold">Overall Score</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 text-left">
                                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                                            <h3 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-3"><CheckCircle2 size={18} /> Strengths</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-text">
                                                {feedbackReport.strengths?.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                                            <h3 className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 mb-3"><X size={18} /> Areas to Improve</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-text">
                                                {feedbackReport.weaknesses?.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                                            <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-3"><Award size={18} /> Actionable Tips</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-text">
                                                {feedbackReport.tips?.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-center mt-10">
                                        <button onClick={() => setStatus('setup')} className="px-6 py-3 rounded-xl font-bold border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm w-full">Back to Menu</button>
                                        <button onClick={() => { setStatus('setup'); setTopic(null); }} className="px-6 py-3 rounded-xl font-bold bg-primary hover:bg-primary/80 transition-all text-white text-sm shadow-lg w-full">Start New Interview</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
export default MockInterview;
