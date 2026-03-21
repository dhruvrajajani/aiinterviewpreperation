import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ExternalLink, Filter, Search, Building2, Signal, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CodingArena = () => {
    const { user, refreshUser } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);
    const [clickedLeetCode, setClickedLeetCode] = useState(new Set());
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [filterCompany, setFilterCompany] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/questions?category=Coding');
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleMarkSolved = async (id) => {
        try {
            setSubmitting(id);
            const res = await api.post(`/questions/submit/${id}`);
            if (res.data.success) {
                toast.success(`Success! +5 Coins. Current Streak: ${res.data.streak} 🔥`);
                if (refreshUser) refreshUser();
            }
        } catch (err) {
            console.error('Error marking solved:', err);
            toast.error(err.response?.data?.msg || 'Error marking question as solved');
        } finally {
            setSubmitting(null);
        }
    };

    const handleLeetCodeClick = (id) => {
        setClickedLeetCode(prev => new Set(prev).add(id));
    };

    // Extract unique companies for filter
    const allCompanies = ['All', ...new Set(questions.flatMap(q => q.companies || []))];

    const filteredQuestions = questions.filter(q => {
        const matchesDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
        const matchesComp = filterCompany === 'All' || (q.companies && q.companies.includes(filterCompany));
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDiff && matchesComp && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Terminal className="text-primary" size={40} /> Coding Challenges
                </h1>
                <p className="text-muted text-lg max-w-2xl mx-auto">
                    Master data structures and algorithms with our curated list of problems from top tech companies.
                </p>
            </div>

            {/* Filters */}
            <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search questions..." 
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary outline-none text-text placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Signal size={16} className="text-muted" />
                        <select 
                            className="bg-surface dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-muted" />
                        <select 
                            className="bg-surface dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                            value={filterCompany}
                            onChange={(e) => setFilterCompany(e.target.value)}
                        >
                            {allCompanies.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Questions Grid */}
            {loading ? (
                <div className="text-center py-20 text-muted">Loading library...</div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-20 text-muted">No questions found matching your filters.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuestions.map((q, index) => (
                        <motion.div
                            key={q._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card hover:bg-surface/80 p-6 flex flex-col transition-all group border-l-4"
                            style={{ 
                                borderLeftColor: 
                                    q.difficulty === 'Easy' ? '#4ade80' : 
                                    q.difficulty === 'Medium' ? '#facc15' : '#f87171' 
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                                    q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                    q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                    {q.difficulty}
                                </span>
                                {q.link && (
                                    <a 
                                        href={q.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-muted hover:text-text transition-colors"
                                        title="Solve on Platform"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {q.title}
                            </h3>
                            
                            <p className="text-muted text-sm line-clamp-2 mb-4 flex-grow">
                                {q.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {q.companies && q.companies.map(c => (
                                    <span key={c} className="text-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-0.5 rounded text-gray-500 dark:text-gray-300 flex items-center gap-1">
                                        <Building2 size={10} /> {c}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <a 
                                    href={q.link || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => handleLeetCodeClick(q._id)}
                                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                                        q.link 
                                        ? 'bg-black/5 dark:bg-white/10 text-text hover:bg-black/10 dark:hover:bg-white/20' 
                                        : 'bg-black/5 dark:bg-white/5 text-muted cursor-not-allowed'
                                    }`}
                                >
                                    LeetCode <ExternalLink size={14} />
                                </a>
                                <button 
                                    onClick={() => handleMarkSolved(q._id)}
                                    disabled={submitting === q._id || user?.solvedQuestions?.includes(q._id) || !clickedLeetCode.has(q._id)}
                                    title={user?.solvedQuestions?.includes(q._id) ? "You have already claimed this reward!" : !clickedLeetCode.has(q._id) ? "You must open the LeetCode link first to unlock this button!" : "Claim completion reward"}
                                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 text-sm transition-all ${
                                        user?.solvedQuestions?.includes(q._id)
                                        ? 'bg-green-500/20 text-green-600 dark:text-green-400 cursor-default'
                                        : !clickedLeetCode.has(q._id)
                                        ? 'bg-black/5 dark:bg-white/5 text-muted cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-indigo-600 disabled:opacity-50'
                                    }`}
                                >
                                    {submitting === q._id ? 'Verifying...' : user?.solvedQuestions?.includes(q._id) ? (
                                        <>Solved <CheckCircle size={14} /></>
                                    ) : (
                                        <>Mark Solved <CheckCircle size={14} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CodingArena;
