const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

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

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log('Data Seeded Successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
