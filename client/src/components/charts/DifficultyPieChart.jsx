import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
    easy: '#34d399',
    medium: '#fbbf24',
    hard: '#f87171'
};

const DifficultyPieChart = ({ stats }) => {
    if (!stats || !stats.questionsByDifficulty) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-muted">No questions solved yet. Start solving to see the breakdown!</p>
            </div>
        );
    }

    const { easy, medium, hard } = stats.questionsByDifficulty;
    const total = easy + medium + hard;

    if (total === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-muted">No questions solved yet. Start solving to see the breakdown!</p>
            </div>
        );
    }

    const data = [
        { name: 'Easy', value: easy, percentage: ((easy / total) * 100).toFixed(1) },
        { name: 'Medium', value: medium, percentage: ((medium / total) * 100).toFixed(1) },
        { name: 'Hard', value: hard, percentage: ((hard / total) * 100).toFixed(1) }
    ].filter(item => item.value > 0); // Only show non-zero values

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface p-3 rounded-lg border border-white/10">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-muted text-sm">{payload[0].value} questions ({payload[0].payload.percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Questions by Difficulty</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DifficultyPieChart;
