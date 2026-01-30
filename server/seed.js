const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Question = require('./models/Question');
const User = require('./models/User');

dotenv.config();

const codingQuestions = require('./data/codingQuestions');

const questions = [
    ...codingQuestions,
    {
        title: "Logical Sequence",
        description: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
        category: "Aptitude",
        difficulty: "Easy",
        points: 5,
        options: [
            { text: "40", isCorrect: false },
            { text: "42", isCorrect: true },
            { text: "44", isCorrect: false },
            { text: "38", isCorrect: false }
        ],
        companies: ["TCS", "Infosys"]
    },
    {
        title: "Probability Basics",
        description: "What is the probability of getting a sum of 9 when two dice are thrown simultaneously?",
        category: "Aptitude",
        difficulty: "Medium",
        points: 10,
        options: [
            { text: "1/6", isCorrect: false },
            { text: "1/8", isCorrect: false },
            { text: "1/9", isCorrect: true },
            { text: "1/12", isCorrect: false }
        ],
        companies: ["Wipro", "Accenture"]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Seed Questions
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log('Questions Seeded Successfully');

        // Seed User
        await User.deleteMany({}); // Optional: Clear users to avoid duplicates/conflicts for this seeded user

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt); // Default password

        const user = new User({
            username: 'TestUser',
            email: 'test@example.com',
            password: hashedPassword,
            coins: 100,
            streak: 5,
            badges: ['Early Adopter'],
            solvedQuestions: []
        });

        await user.save();
        console.log('Test User Seeded Successfully');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
