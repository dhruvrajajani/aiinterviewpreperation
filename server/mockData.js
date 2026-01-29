// Simple in-memory store for when DB is down
module.exports = {
    users: [
        {
            id: 'mock-user-1',
            username: 'TestUser',
            email: 'test@example.com',
            password: 'password',
            coins: 100,
            streak: 5,
            badges: ['Early Adopter']
        }
    ],
    questions: [
        {
            _id: '1',
            title: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            category: "Coding",
            difficulty: "Easy",
            points: 10,
            companies: ["Google", "Amazon", "Meta"],
            link: "https://leetcode.com/problems/two-sum/",
            testCases: [],
            starterCode: ""
        },
        {
            _id: '2',
            title: "Reverse String",
            description: "Write a function that reverses a string. The input string is given as an array of characters s.",
            category: "Coding",
            difficulty: "Easy",
            points: 10,
            companies: ["Microsoft", "Adobe"],
            link: "https://leetcode.com/problems/reverse-string/",
            testCases: [],
            starterCode: ""
        },
        {
            _id: '3',
            title: "Valid Palindrome",
            description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
            category: "Coding",
            difficulty: "Easy",
            points: 15,
            companies: ["Facebook", "Apple"],
            link: "https://leetcode.com/problems/valid-palindrome/",
            testCases: [],
            starterCode: ""
        },
        {
            _id: '101',
            title: "Longest Substring Without Repeating Characters",
            description: "Given a string s, find the length of the longest substring without repeating characters.",
            category: "Coding",
            difficulty: "Medium",
            points: 30,
            companies: ["Google", "Amazon", "Netflix"],
            link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
            testCases: [],
            starterCode: ""
        },
        {
            _id: '102',
            title: "Median of Two Sorted Arrays",
            description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            category: "Coding",
            difficulty: "Hard",
            points: 50,
            companies: ["Google", "Microsoft"],
            link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
            testCases: [],
            starterCode: ""
        },
        {
            _id: '4',
            title: "Logical Sequence",
            description: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
            category: "Aptitude",
            difficulty: "Easy",
            points: 5,
            options: [
                { text: "42", isCorrect: true },
                { text: "40", isCorrect: false },
                { text: "38", isCorrect: false },
                { text: "44", isCorrect: false }
            ]
        },
        {
            _id: '5',
            title: "Speed vs Time",
            description: "If a car travels at 60 km/h, how long will it take to cover 300 km?",
            category: "Aptitude",
            difficulty: "Medium",
            points: 10,
            options: [
                { text: "5 hours", isCorrect: true },
                { text: "6 hours", isCorrect: false },
                { text: "4 hours", isCorrect: false },
                { text: "4.5 hours", isCorrect: false }
            ]
        }
    ]
};
