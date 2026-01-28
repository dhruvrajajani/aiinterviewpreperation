import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Hello, <span className="gradient-text">{user?.username}</span>!</h1>
      <p className="text-muted text-lg mb-10">Here's your progress overview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">Coins</h3>
          <p className="text-4xl font-bold text-yellow-400">{user?.coins || 0}</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">Streak</h3>
          <p className="text-4xl font-bold text-orange-500">{user?.streak || 0} 🔥</p>
        </div>
        {/* Add more stats later */}
      </div>
    </div>
  );
};

export default Dashboard;
