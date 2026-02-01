import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import Footer from '../components/Footer';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };


  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <Sparkles className="text-secondary" />
            <span>Interview<span className="text-primary">Prep</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/coding" className="text-sm font-medium hover:text-primary transition-colors">Coding</Link>
                <Link to="/resume" className="text-sm font-medium hover:text-primary transition-colors">Resume AI</Link>
                <Link to="/interview" className="text-sm font-medium hover:text-primary transition-colors">AI Interview</Link>
                
                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white">
                          {user.username ? user.username[0].toUpperCase() : 'U'}
                      </div>
                      <Link to="/profile" className="font-medium max-w-[100px] truncate">{user.username}</Link>
                  </div>
                  <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors">
                      <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold hover:text-white">Sign In</Link>
                <Link to="/register" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-muted hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-surface border-b border-white/10 px-6 py-4 absolute w-full shadow-2xl animate-fade-in-down">
                <div className="flex flex-col gap-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-white/5">Dashboard</Link>
                            <Link to="/coding" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-white/5">Coding Challenges</Link>
                            <Link to="/resume" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-white/5">AI Resume Builder</Link>
                            <Link to="/interview" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium hover:text-primary py-2 border-b border-white/5">Mock Interview</Link>
                            
                            <div className="pt-2 flex items-center justify-between">
                                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white">
                                        {user.username ? user.username[0].toUpperCase() : 'U'}
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
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-bold border border-white/10 rounded-lg">Sign In</Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-bold bg-primary text-white rounded-lg">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        )}
      </nav>

      <main className="pt-20 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
