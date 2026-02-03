import { formatDistanceToNow } from 'date-fns';
import { Code, MessageSquare, FileText, Award } from 'lucide-react';

const ActivityIcon = ({ type }) => {
    switch (type) {
        case 'coding':
            return <Code size={20} className="text-blue-400" />;
        case 'interview':
            return <MessageSquare size={20} className="text-green-400" />;
        case 'resume':
            return <FileText size={20} className="text-purple-400" />;
        default:
            return <Award size={20} className="text-yellow-400" />;
    }
};

const RecentActivity = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-muted">No recent activity. Start coding to see your progress!</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5">
                            <ActivityIcon type={activity.type} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">{activity.description}</p>
                            {activity.score && (
                                <p className="text-sm text-green-400">Score: {activity.score}/5</p>
                            )}
                            <p className="text-xs text-muted mt-1">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
