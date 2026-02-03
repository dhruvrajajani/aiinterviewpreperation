import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-4">
                            <img src="/logo.png" alt="InterviewPrep" className="h-10 w-10" />
                            <span>Interview<span className="text-primary">Prep</span></span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed">
                            A smart revision platform helping developers ace technical interviews with AI-powered mock interviews, coding challenges, and resume building.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/coding" className="hover:text-primary transition-colors">Coding Challenges</Link></li>
                            <li><Link to="/interview" className="hover:text-primary transition-colors">AI Mock Interview</Link></li>
                            <li><Link to="/resume" className="hover:text-primary transition-colors">Resume Builder</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Progress Dashboard</Link></li>
                        </ul>
                    </div>



                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Community</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                        <p className="text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} InterviewPrep AI.<br />All rights reserved.
                        </p>
                    </div>
                </div>
                
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                    <p>Designed for developers, by developers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
