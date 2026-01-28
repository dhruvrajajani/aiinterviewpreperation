// Simple in-memory store for when DB is down
module.exports = {
    users: [],
    questions: [
        {
            _id: '1',
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            category: "Coding",
            difficulty: "Easy",
            points: 10,
            testCases: [],
            starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}"
        },
        {
            _id: '2',
            title: "Logical Sequence",
            description: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
            category: "Aptitude",
            difficulty: "Easy",
            points: 5,
            options: [
                { text: "42", isCorrect: true },
                { text: "40", isCorrect: false }
            ]
        }
    ]
};
