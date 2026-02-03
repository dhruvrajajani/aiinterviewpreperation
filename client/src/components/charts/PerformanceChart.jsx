import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const PerformanceChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-muted">No performance data yet. Complete some activities to see your progress!</p>
            </div>
        );
    }

    // Format data for the chart
    const chartData = data.map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        questions: item.questionsSolved || 0,
        interviews: item.interviewsCompleted || 0
    }));

    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Activity Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                        dataKey="date" 
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                        stroke="#888"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="questions" 
                        stroke="#60a5fa" 
                        strokeWidth={2}
                        name="Questions Solved"
                        dot={{ fill: '#60a5fa', r: 4 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="interviews" 
                        stroke="#34d399" 
                        strokeWidth={2}
                        name="Interviews"
                        dot={{ fill: '#34d399', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
