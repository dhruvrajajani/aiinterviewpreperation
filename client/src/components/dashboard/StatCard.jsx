import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 hover:scale-105 transition-transform"
        >
            <div className="flex items-start justify-between">
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
