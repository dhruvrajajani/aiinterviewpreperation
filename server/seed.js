const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const questions = [
    {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        testCases: [
            { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "2 + 7 = 9" },
            { input: "[3,2,4], 6", output: "[1,2]", explanation: "2 + 4 = 6" }
        ],
        starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}"
    },
    {
        title: "Reverse String",
        description: "Write a function that reverses a string. The input string is given as an array of characters s.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        testCases: [
            { input: "['h','e','l','l','o']", output: "['o','l','l','e','h']", explanation: "Details..." }
        ],
        starterCode: "function reverseString(s) {\n  // Write your code here\n}"
    },
    {
        title: "Valid Anagram",
        description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        category: "Coding",
        difficulty: "Medium",
        points: 20,
        testCases: [
            { input: "anagram, nagaram", output: "true", explanation: "Both contain same characters" }
        ],
        starterCode: "function isAnagram(s, t) {\n  // Write your code here\n}"
    },
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
