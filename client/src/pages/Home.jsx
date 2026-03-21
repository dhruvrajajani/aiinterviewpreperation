import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Brain, Trophy, ChevronRight, Users, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-text overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-20 mix-blend-overlay"></div>
            
            {/* Animated Background Blobs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob z-0"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 z-0"></div>
            <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000 z-0"></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-surface border border-primary/30 text-primary text-sm font-semibold tracking-wide uppercase">
                        🚀 Launch Your Career
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
                        Master Your <br />
                        <span className="gradient-text">Dream Interview</span>
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
                        The ultimate AI-powered platform for coding, aptitude, and behavioral interview preparation using the MERN stack.
                    </p>
                    <div className="flex gap-4 justify-center">
                        {user ? (
                            <Link to="/dashboard" className="bg-primary hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25">
                                Go to Dashboard <ChevronRight size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="bg-primary hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25">
                                    Get Started <ChevronRight size={20} />
                                </Link>
                                <Link to="/login" className="bg-surface border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-surface/80 text-text px-8 py-4 rounded-full font-semibold transition-all">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-10 border-y border-black/5 dark:border-white/5 bg-surface/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatBox number="10k+" label="Questions" />
                    <StatBox number="5k+" label="Mock Interviews" />
                    <StatBox number="98%" label="Success Rate" />
                    <StatBox number="24/7" label="AI Support" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <span className="text-primary">succeed</span></h2>
                    <p className="text-muted text-lg">Comprehensive tools to tackle every stage of the interview process.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard
                        icon={<Code className="text-primary" size={40} />}
                        title="Coding Arena"
                        desc="Practice one-on-one with our advanced code editor supporting multiple languages and real-time compilation."
                    />
                    <FeatureCard
                        icon={<Brain className="text-secondary" size={40} />}
                        title="AI Mock Interviews"
                        desc="Simulate real interviews with our intelligent AI that adapts to your responses and provides instant feedback."
                    />
                    <FeatureCard
                        icon={<Trophy className="text-accent" size={40} />}
                        title="Gamified Learning"
                        desc="Stay motivated with streaks, badges, and leaderboards. Earn rewards as you master new skills."
                    />
                    <FeatureCard
                        icon={<Users className="text-green-400" size={40} />}
                        title="Peer Challenges"
                        desc="Compete with friends or random opponents in timed coding battles to test your speed and accuracy."
                    />
                    <FeatureCard
                        icon={<Zap className="text-yellow-400" size={40} />}
                        title="Aptitude & Logic"
                        desc="Sharpen your logical reasoning with thousands of aptitude questions from top company archives."
                    />
                    <FeatureCard
                        icon={<CheckCircle className="text-cyan-400" size={40} />}
                        title="AI Resume Builder"
                        desc="Create ATS-friendly resumes instantly with our AI that highlights your strengths and projects."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-surface/20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                         {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10"></div>
                        
                        <StepCard 
                            step="01"
                            title="Create Profile"
                            desc="Sign up and set your goals. We'll curate a personalized learning path for you."
                        />
                        <StepCard 
                            step="02"
                            title="Practice & Learn"
                            desc="Solve questions, build projects, and take mock interviews to improve your skills."
                        />
                        <StepCard 
                            step="03"
                            title="Get Hired"
                            desc="Use our resume builder and interview tips to land your dream job with confidence."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Success Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        name="Alex Johnson"
                        role="Software Engineer at Google"
                        quote="The AI mock interviews were a game changer. I felt so much more confident going into the real thing."
                    />
                    <TestimonialCard 
                        name="Sarah Williams"
                        role="Frontend Developer at Amazon"
                        quote="Coding Arena helped me master DSA concepts I was struggling with for months. Highly recommended!"
                    />
                    <TestimonialCard 
                        name="Michael Chen"
                        role="Full Stack Dev at Meta"
                        quote="The gamification kept me addicted to learning. I practiced every day without it feeling like a chore."
                    />
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-transparent to-primary/20">
                <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                <p className="text-xl text-muted mb-10">Join thousands of developers acing their interviews today.</p>
                {user ? (
                    <Link to="/dashboard" className="bg-text text-background px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:opacity-90">
                        Continue Learning
                    </Link>
                ) : (
                    <Link to="/register" className="bg-text text-background px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:opacity-90">
                        Join Now - It's Free
                    </Link>
                )}
            </section>


        </div>
    );
};

const StatBox = ({ number, label }) => (
    <div className="p-4">
        <h3 className="text-4xl font-bold text-text mb-2">{number}</h3>
        <p className="text-muted uppercase text-sm tracking-wider">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel p-8 hover:bg-black/5 dark:hover:bg-white/[0.08] transition-all duration-300 w-full group"
    >
        <div className="mb-6 p-4 bg-black/5 dark:bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">{icon}</div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted leading-relaxed">{desc}</p>
    </motion.div>
);

const StepCard = ({ step, title, desc }) => (
    <div className="relative bg-background border border-black/10 dark:border-white/10 p-8 rounded-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-surface border border-primary text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            {step}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted">{desc}</p>
    </div>
);

const TestimonialCard = ({ name, role, quote }) => (
    <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-text" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h4V8h-4zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h4V8h-4z" />
            </svg>
        </div>
        <p className="text-lg italic text-gray-600 dark:text-gray-300 mb-6 relative z-10">"{quote}"</p>
        <div className="relative z-10">
            <h4 className="font-bold text-text text-lg">{name}</h4>
            <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{role}</p>
        </div>
    </div>
);

export default Home;
