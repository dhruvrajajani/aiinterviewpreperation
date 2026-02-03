// Seed script to populate dashboard test data
const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');
const InterviewSession = require('./models/InterviewSession');
require('dotenv').config();

const seedDashboardData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for dashboard seeding...');

        // Find test user
        const userEmail = 'test@example.com';
        let user = await User.findOne({ email: userEmail });

        if (!user) {
            console.log(`❌ User with email ${userEmail} not found.`);
            console.log('Please run the main seed script first: node seed.js');
            process.exit(0);
        }

        console.log(`\n🌱 Seeding dashboard data for user: ${user.username}\n`);

        // Clear existing dashboard data
        await Activity.deleteMany({ user: user._id });
        await InterviewSession.deleteMany({ user: user._id });
        console.log('✓ Cleared existing dashboard data');

        // Create activity data for the last 7 days
        const activities = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            activities.push({
                user: user._id,
                date: date,
                questionsSolved: Math.floor(Math.random() * 5) + 1,
                interviewsCompleted: i % 3 === 0 ? 1 : 0,
                resumesCreated: i === 0 ? 1 : 0,
                coinsEarned: Math.floor(Math.random() * 50) + 10
            });
        }

        await Activity.insertMany(activities);
        console.log('✓ Created 7 days of activity data');

        // Create interview sessions
        const interviews = [
            {
                user: user._id,
                type: 'frontend',
                questions: [
                    { question: 'Explain closures in JavaScript', answer: 'A closure is a function that has access to variables...', score: 4 },
                    { question: 'What is React and virtual DOM?', answer: 'React is a JavaScript library...', score: 5 }
                ],
                overallScore: 4.5,
                duration: 15,
                completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                user: user._id,
                type: 'backend',
                questions: [
                    { question: 'SQL vs NoSQL database choice', answer: 'I would use NoSQL for...', score: 3 },
                    { question: 'Node.js async operations', answer: 'Using worker threads and queues...', score: 4 }
                ],
                overallScore: 3.5,
                duration: 12,
                completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                user: user._id,
                type: 'behavioral',
                questions: [
                    { question: 'Tell me about a challenging project', answer: 'I worked on a legacy codebase...', score: 5 }
                ],
                overallScore: 5.0,
                duration: 10,
                completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
        ];

        await InterviewSession.insertMany(interviews);
        console.log('✓ Created 3 interview sessions');

        // Update user stats
        user.stats = {
            totalQuestionsSolved: 23,
            questionsByDifficulty: {
                easy: 10,
                medium: 8,
                hard: 5
            },
            interviewsCompleted: 3,
            averageInterviewScore: 4.3,
            resumesCreated: 1
        };
        user.coins = 250;
        user.streak = 7;
        user.lastActive = new Date();

        await user.save();
        console.log('✓ Updated user stats\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Dashboard seeding complete!\n');
        console.log('📊 User Stats:');
        console.log('   • Questions Solved:', user.stats.totalQuestionsSolved);
        console.log('   • Easy:', user.stats.questionsByDifficulty.easy);
        console.log('   • Medium:', user.stats.questionsByDifficulty.medium);
        console.log('   • Hard:', user.stats.questionsByDifficulty.hard);
        console.log('   • Interviews:', user.stats.interviewsCompleted);
        console.log('   • Avg Score:', user.stats.averageInterviewScore.toFixed(1));
        console.log('   • Resumes:', user.stats.resumesCreated);
        console.log('   • Coins:', user.coins);
        console.log('   • Streak:', user.streak);
        console.log('\n🚀 Login and visit /dashboard to see the data!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDashboardData();
