const fs = require('fs');

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

let text = fs.readFileSync('data/codingQuestions.js', 'utf8');

for (const [topic, titles] of Object.entries(topicMapping)) {
    for (const title of titles) {
        let titleLine = `title: "${title}"`;
        let idx = text.indexOf(titleLine);
        if (idx !== -1) {
             let catIdx = text.indexOf('category: "Coding",', idx);
             if (catIdx !== -1 && catIdx < idx + 300) { // arbitrary limit to ensure we are in the same object
                  // Check if topic already exists to avoid duplication
                  let block = text.slice(idx, catIdx + 150);
                  if (!block.includes('topic:')) {
                      text = text.slice(0, catIdx + 19) + `\n        topic: "${topic}",` + text.slice(catIdx + 19);
                  }
             }
        }
    }
}

fs.writeFileSync('data/codingQuestions.js', text, 'utf8');
console.log('Successfully updated codingQuestions.js');
