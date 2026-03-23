import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { Sparkles, LogOut, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

const MainLayout = () => {
  const { user } = useAuth();
  const { signOut } = useClerkAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };


  return (
    <div className="min-h-screen text-text font-sans pt-24 pb-12">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 glass-panel">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full group-hover:bg-primary/60 transition-colors"></div>
              <img src="/logo.png" alt="InterviewPrep" className="h-10 w-10 relative z-10" />
            </div>
            <span>Interview<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Prep</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-muted hover:text-text transition-all hover:text-glow">Dashboard</Link>
                <Link to="/coding" className="text-sm font-semibold text-muted hover:text-text transition-all hover:text-glow">Coding</Link>
                <Link to="/resume" className="text-sm font-semibold text-muted hover:text-text transition-all hover:text-glow">Resume AI</Link>
                <Link to="/interview" className="text-sm font-semibold text-muted hover:text-text transition-all hover:text-glow">AI Interview</Link>
                
                <div className="flex items-center gap-5 pl-8 border-l border-black/10 dark:border-white/10">
                  <Link to="/profile" id="user-profile-link" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-shadow">
                          <div className="w-full h-full rounded-full overflow-hidden bg-surface flex items-center justify-center font-bold text-white">
                            {user.avatar ? (
                                <img 
                                    src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar}`} 
                                    alt={user.username} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                user.username ? user.username[0].toUpperCase() : 'U'
                            )}
                          </div>
                      </div>
                      <span className="font-semibold text-sm max-w-[100px] truncate text-muted group-hover:text-text transition-colors">{user.username}</span>
                  </Link>
                  <button onClick={handleLogout} id="logout-button" className="text-muted hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-xl">
                      <LogOut size={18} />
                  </button>
                  <button onClick={toggleTheme} className="text-muted hover:text-primary transition-colors p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl">
                      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/login" className="text-sm font-semibold text-muted hover:text-text transition-colors">Sign In</Link>
                <Link to="/register" className="relative group px-6 py-2 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="relative text-sm font-bold text-white flex flex-row items-center gap-2">
                    Get Started <Sparkles size={14} className="group-hover:animate-pulse" />
                  </div>
                </Link>
                <button onClick={toggleTheme} className="text-muted hover:text-primary transition-colors p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl">
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="text-muted hover:text-primary transition-colors p-2">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="text-muted hover:text-text transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-surface border-b border-black/10 dark:border-white/10 px-6 py-4 absolute w-full shadow-2xl animate-fade-in-down">
                <div className="flex flex-col gap-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-black/5 dark:border-white/5">Dashboard</Link>
                            <Link to="/coding" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-black/5 dark:border-white/5">Coding Challenges</Link>
                            <Link to="/resume" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-black/5 dark:border-white/5">AI Resume Builder</Link>
                            <Link to="/interview" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-black/5 dark:border-white/5">Mock Interview</Link>
                            
                            <div className="pt-2 flex items-center justify-between">
                                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white overflow-hidden">
                                        {user.avatar ? (
                                            <img 
                                                src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar}`} 
                                                alt={user.username} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            user.username ? user.username[0].toUpperCase() : 'U'
                                        )}
                                    </div>
                                    {user.username}
                                 </Link>
                                 <button onClick={handleLogout} className="text-red-400 flex items-center gap-2 text-sm font-medium">
                                    <LogOut size={16} /> Logout
                                 </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-bold border border-black/10 dark:border-white/10 rounded-lg">Sign In</Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-bold bg-primary text-white rounded-lg">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
