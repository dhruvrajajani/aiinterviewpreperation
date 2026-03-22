const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const codingQuestions = require('./data/codingQuestions.js');

dotenv.config();

const topicMapping = {
    "Arrays & Hashing": ["Two Sum", "Contains Duplicate", "Group Anagrams", "Top K Frequent Elements", "Product of Array Except Self"],
    "Two Pointers": ["Valid Palindrome", "3Sum", "Container With Most Water"],
    "Sliding Window": ["Best Time to Buy and Sell Stock", "Longest Substring Without Repeating Characters"],
    "Stack": ["Valid Parentheses", "Min Stack"],
    "Binary Search": ["Binary Search", "Search in Rotated Sorted Array"],
    "Linked List": ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle"],
    "Trees": ["Invert Binary Tree", "Maximum Depth of Binary Tree", "Level Order Traversal", "Validate Binary Search Tree"],
    "Graphs": ["Number of Islands", "Clone Graph"],
    "Dynamic Programming": ["Climbing Stairs", "House Robber", "Longest Increasing Subsequence", "Coin Change"],
    "Backtracking": ["Permutations", "Word Search"],
    "Advanced / Hard": ["Median of Two Sorted Arrays", "Trapping Rain Water", "Merge k Sorted Lists", "Serialize and Deserialize Binary Tree"]
};

// Create a reverse map for O(1) lookups
const titleToTopic = {};
for (const [topic, titles] of Object.entries(topicMapping)) {
    for (const title of titles) {
        titleToTopic[title] = topic;
    }
}

const updateDbTopics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Topic Migration');

        const questions = await Question.find({});
        console.log(`Found ${questions.length} questions in DB`);

        let updatedCount = 0;
        for (let q of questions) {
            if (q.category === 'Coding') {
                const newTopic = titleToTopic[q.title] || 'General';
                if (q.topic !== newTopic) {
                    q.topic = newTopic;
                    await q.save();
                    updatedCount++;
                }
            } else if (!q.topic || q.topic === 'General') {
                 // Update aptitude/behavioral to default General if not set natively
                 q.topic = 'General';
                 await q.save();
            }
        }
        
        console.log(`Successfully updated ${updatedCount} coding questions with specific topics.`);
        
        // Also update the static file content with topics
        const fs = require('fs');
        const path = require('path');
        const codingFilePath = path.join(__dirname, 'data', 'codingQuestions.js');
        
        let fileContent = fs.readFileSync(codingFilePath, 'utf-8');
        
        // Let's iterate and replace "category: "Coding"," with "category: "Coding",\n        topic: "Topic","
        for (const [topic, titles] of Object.entries(topicMapping)) {
             for (const title of titles) {
                   // Regex to find the block for this title and add topic
                   const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                   const regex = new RegExp(`(title:\\s*"${escapedTitle}"[\\s\\S]*?category:\\s*"Coding",)`, 'g');
                   fileContent = fileContent.replace(regex, `$1\n        topic: "${topic}",`);
             }
        }
        
        // Only write if topics not already present to avoid duplication
        if (!fileContent.includes('topic: "Arrays & Hashing"')) {
             fs.writeFileSync(codingFilePath, fileContent, 'utf-8');
             console.log('Successfully updated codingQuestions.js file with topics.');
        } else {
             console.log('codingQuestions.js already contains topic fields.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateDbTopics();
