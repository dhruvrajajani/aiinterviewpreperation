import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm text-muted mb-1">{title}</p>
                    <p className={`text-4xl font-bold ${color}`}>{value}</p>
                    {subtitle && (
                        <p className="text-xs text-muted mt-2">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-20`}>
                        <Icon size={24} className={color} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
