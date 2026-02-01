import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.username, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Join the Platform</h2>
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-all mt-4">
            Get Started
          </button>
        </form>
        <p className="mt-6 text-center text-muted text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
