import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, MessageSquare, FileText, Zap, TrendingUp, Award } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import PerformanceChart from '../components/charts/PerformanceChart';
import DifficultyPieChart from '../components/charts/DifficultyPieChart';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await api.get('/dashboard/stats');
        setStats(statsRes.data);

        // Fetch recent activities
        const activitiesRes = await api.get('/dashboard/recent?limit=10');
        setActivities(activitiesRes.data);

        // Fetch performance data
        const performanceRes = await api.get('/dashboard/performance?days=7');
        setPerformanceData(performanceRes.data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-10"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
          Welcome back, <span className="gradient-text">{user?.username}</span>! 👋
        </h1>
        <p className="text-muted text-base sm:text-lg mb-4 sm:mb-6">Here's your progress overview</p>
        
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/coding')}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Code size={20} /> Solve Problems
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/interview')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <MessageSquare size={20} /> Start Interview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/resume')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <FileText size={20} /> Create Resume
          </motion.button>
        </div>
      </motion.div>


      {/* Stats Overview */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Questions Solved"
            value={stats?.stats?.totalQuestionsSolved || 0}
            icon={Code}
            color="text-blue-400"
            subtitle={`${stats?.stats?.questionsByDifficulty?.hard || 0} hard problems`}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Interviews Completed"
            value={stats?.stats?.interviewsCompleted || 0}
            icon={MessageSquare}
            color="text-green-400"
            subtitle={`Avg score: ${stats?.stats?.averageInterviewScore?.toFixed(1) || 0}/5`}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Resumes Created"
            value={stats?.stats?.resumesCreated || 0}
            icon={FileText}
            color="text-purple-400"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Current Streak"
            value={`${stats?.streak || 0} 🔥`}
            icon={Zap}
            color="text-orange-400"
            subtitle={`${stats?.coins || 0} coins earned`}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <PerformanceChart data={performanceData} />
        <DifficultyPieChart stats={stats?.stats} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />

      {/* Achievement Section (Optional) */}
      {stats?.coins > 0 && (
        <div className="glass-card p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Award className="text-yellow-400" size={24} />
                Your Achievements
              </h3>
              <p className="text-muted">Keep up the great work!</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-yellow-400">{stats.coins}</p>
              <p className="text-sm text-muted">Total Coins</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
