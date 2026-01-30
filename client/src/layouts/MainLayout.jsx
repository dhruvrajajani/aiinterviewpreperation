import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import Footer from '../components/Footer';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <Sparkles className="text-secondary" />
            <span>Interview<span className="text-primary">Prep</span></span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/coding" className="text-sm font-medium hover:text-primary transition-colors">Coding</Link>
            <Link to="/resume" className="text-sm font-medium hover:text-primary transition-colors">Resume AI</Link>
            <Link to="/interview" className="text-sm font-medium hover:text-primary transition-colors">AI Interview</Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white">
                        {user.username ? user.username[0].toUpperCase() : 'U'}
                    </div>
                    <Link to="/profile" className="hidden md:block font-medium">{user.username}</Link>
                </div>
                <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold hover:text-white">Sign In</Link>
                <Link to="/register" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
