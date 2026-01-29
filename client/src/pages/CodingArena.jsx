import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ExternalLink, Filter, Search, Building2, Signal } from 'lucide-react';
import api from '../utils/api';

const CodingArena = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary outline-none text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2">
                        <Signal size={16} className="text-muted" />
                        <select 
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
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
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
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
                                        className="text-muted hover:text-white transition-colors"
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
                                    <span key={c} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 flex items-center gap-1">
                                        <Building2 size={10} /> {c}
                                    </span>
                                ))}
                            </div>

                            <a 
                                href={q.link || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                                    q.link 
                                    ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' 
                                    : 'bg-white/5 text-muted cursor-not-allowed'
                                }`}
                            >
                                {q.link ? 'Solve Challenge' : 'Link Unavailable'} <ExternalLink size={16} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CodingArena;
