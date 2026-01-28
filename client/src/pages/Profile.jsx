import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Award, TrendingUp, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mb-8 overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="px-8 pb-8 relative">
            <div className="absolute -top-16 left-8 w-32 h-32 rounded-full border-4 border-background bg-surface flex items-center justify-center text-4xl font-bold">
                {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="pl-40 pt-4">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted flex items-center gap-2 mt-1">
                    <Mail size={16} /> {user.email}
                </p>
            </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
        >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{user.coins || 0}</div>
                    <div className="text-xs uppercase tracking-wider text-muted">Coins</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">{user.streak || 0} 🔥</div>
                    <div className="text-xs uppercase tracking-wider text-muted">Day Streak</div>
                </div>
                {/* Add more stats if available */}
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
        >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-secondary" /> Badges
            </h2>
            {user.badges && user.badges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {user.badges.map((badge, index) => (
                        <div key={index} className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm">
                            {badge}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted text-center py-8">No badges earned yet. Keep practicing!</p>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
