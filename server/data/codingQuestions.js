const codingQuestions = [
    // ARRAYS & HASHING
    {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Google", "Amazon", "Facebook"],
        link: "https://leetcode.com/problems/two-sum/",
        testCases: [{ input: "[2,7,11,15], 9", output: "[0,1]", explanation: "2 + 7 = 9" }],
        starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}"
    },
    {
        title: "Contains Duplicate",
        description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Microsoft", "Apple"],
        link: "https://leetcode.com/problems/contains-duplicate/",
        testCases: [{ input: "[1,2,3,1]", output: "true", explanation: "1 appears twice" }],
        starterCode: "function containsDuplicate(nums) {\n  // Write your code here\n}"
    },
    {
        title: "Group Anagrams",
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        category: "Coding",
        difficulty: "Medium",
        points: 20,
        companies: ["Amazon", "Affirm"],
        link: "https://leetcode.com/problems/group-anagrams/",
        testCases: [{ input: "['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]", explanation: "" }],
        starterCode: "function groupAnagrams(strs) {\n  // Write your code here\n}"
    },
    {
        title: "Top K Frequent Elements",
        description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
        category: "Coding",
        difficulty: "Medium",
        points: 20,
        companies: ["Facebook", "Amazon"],
        link: "https://leetcode.com/problems/top-k-frequent-elements/",
        testCases: [{ input: "[1,1,1,2,2,3], 2", output: "[1,2]", explanation: "" }],
        starterCode: "function topKFrequent(nums, k) {\n  // Write your code here\n}"
    },
    {
        title: "Product of Array Except Self",
        description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
        category: "Coding",
        difficulty: "Medium",
        points: 25,
        companies: ["Apple", "Asana"],
        link: "https://leetcode.com/problems/product-of-array-except-self/",
        testCases: [{ input: "[1,2,3,4]", output: "[24,12,8,6]", explanation: "" }],
        starterCode: "function productExceptSelf(nums) {\n  // Write your code here\n}"
    },

    // TWO POINTERS
    {
        title: "Valid Palindrome",
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Facebook", "Microsoft"],
        link: "https://leetcode.com/problems/valid-palindrome/",
        testCases: [{ input: "'A man, a plan, a canal: Panama'", output: "true", explanation: "" }],
        starterCode: "function isPalindrome(s) {\n  // Write your code here\n}"
    },
    {
        title: "3Sum",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Amazon", "Facebook", "Google"],
        link: "https://leetcode.com/problems/3sum/",
        testCases: [{ input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "" }],
        starterCode: "function threeSum(nums) {\n  // Write your code here\n}"
    },
    {
        title: "Container With Most Water",
        description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Google", "Amazon"],
        link: "https://leetcode.com/problems/container-with-most-water/",
        testCases: [{ input: "[1,8,6,2,5,4,8,3,7]", output: "49", explanation: "" }],
        starterCode: "function maxArea(height) {\n  // Write your code here\n}"
    },

    // SLIDING WINDOW
    {
        title: "Best Time to Buy and Sell Stock",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Amazon", "Microsoft", "Google"],
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        testCases: [{ input: "[7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }],
        starterCode: "function maxProfit(prices) {\n  // Write your code here\n}"
    },
    {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        category: "Coding",
        difficulty: "Medium",
        points: 25,
        companies: ["Facebook", "Microsoft", "Google"],
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        testCases: [{ input: "'abcabcbb'", output: "3", explanation: "" }],
        starterCode: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n}"
    },

    // STACK
    {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        category: "Coding",
        difficulty: "Easy",
        points: 15,
        companies: ["Amazon", "Microsoft", "Facebook"],
        link: "https://leetcode.com/problems/valid-parentheses/",
        testCases: [{ input: "'()[]{}'", output: "true", explanation: "" }],
        starterCode: "function isValid(s) {\n  // Write your code here\n}"
    },
    {
        title: "Min Stack",
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
        category: "Coding",
        difficulty: "Medium",
        points: 20,
        companies: ["Amazon", "Lyft"],
        link: "https://leetcode.com/problems/min-stack/",
        testCases: [],
        starterCode: "class MinStack {\n  constructor() {\n  }\n}"
    },

    // BINARY SEARCH
    {
        title: "Binary Search",
        description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Google", "Microsoft"],
        link: "https://leetcode.com/problems/binary-search/",
        testCases: [{ input: "[-1,0,3,5,9,12], 9", output: "4", explanation: "" }],
        starterCode: "function search(nums, target) {\n  // Write your code here\n}"
    },
    {
        title: "Search in Rotated Sorted Array",
        description: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Facebook", "Microsoft", "Amazon"],
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        testCases: [{ input: "[4,5,6,7,0,1,2], 0", output: "4", explanation: "" }],
        starterCode: "function search(nums, target) {\n  // Write your code here\n}"
    },

    // LINKED LIST
    {
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Google", "Facebook", "Microsoft"],
        link: "https://leetcode.com/problems/reverse-linked-list/",
        testCases: [],
        starterCode: "function reverseList(head) {\n  // Write your code here\n}"
    },
    {
        title: "Merge Two Sorted Lists",
        description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
        category: "Coding",
        difficulty: "Easy",
        points: 15,
        companies: ["Amazon", "Microsoft"],
        link: "https://leetcode.com/problems/merge-two-sorted-lists/",
        testCases: [],
        starterCode: "function mergeTwoLists(list1, list2) {\n  // Write your code here\n}"
    },
    {
        title: "Linked List Cycle",
        description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
        category: "Coding",
        difficulty: "Easy",
        points: 15,
        companies: ["Amazon", "Microsoft", "Spotify"],
        link: "https://leetcode.com/problems/linked-list-cycle/",
        testCases: [],
        starterCode: "function hasCycle(head) {\n  // Write your code here\n}"
    },

    // TREES
    {
        title: "Invert Binary Tree",
        description: "Given the root of a binary tree, invert the tree, and return its root.",
        category: "Coding",
        difficulty: "Easy",
        points: 15,
        companies: ["Google", "Homebrew"],
        link: "https://leetcode.com/problems/invert-binary-tree/",
        testCases: [],
        starterCode: "function invertTree(root) {\n  // Write your code here\n}"
    },
    {
        title: "Maximum Depth of Binary Tree",
        description: "Given the root of a binary tree, return its maximum depth.",
        category: "Coding",
        difficulty: "Easy",
        points: 10,
        companies: ["Facebook", "Google"],
        link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        testCases: [],
        starterCode: "function maxDepth(root) {\n  // Write your code here\n}"
    },
    {
        title: "Level Order Traversal",
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        category: "Coding",
        difficulty: "Medium",
        points: 20,
        companies: ["Amazon", "Microsoft", "Facebook"],
        link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        testCases: [],
        starterCode: "function levelOrder(root) {\n  // Write your code here\n}"
    },
    {
        title: "Validate Binary Search Tree",
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        category: "Coding",
        difficulty: "Medium",
        points: 25,
        companies: ["Amazon", "Facebook", "Bloomberg"],
        link: "https://leetcode.com/problems/validate-binary-search-tree/",
        testCases: [],
        starterCode: "function isValidBST(root) {\n  // Write your code here\n}"
    },

    // GRAPHS
    {
        title: "Number of Islands",
        description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Amazon", "Google", "Microsoft"],
        link: "https://leetcode.com/problems/number-of-islands/",
        testCases: [],
        starterCode: "function numIslands(grid) {\n  // Write your code here\n}"
    },
    {
        title: "Clone Graph",
        description: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
        category: "Coding",
        difficulty: "Medium",
        points: 35,
        companies: ["Facebook", "Google", "Pinterest"],
        link: "https://leetcode.com/problems/clone-graph/",
        testCases: [],
        starterCode: "function cloneGraph(node) {\n  // Write your code here\n}"
    },

    // DP
    {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        category: "Coding",
        difficulty: "Easy",
        points: 15,
        companies: ["Amazon", "Google", "Adobe"],
        link: "https://leetcode.com/problems/climbing-stairs/",
        testCases: [{ input: "3", output: "3", explanation: "" }],
        starterCode: "function climbStairs(n) {\n  // Write your code here\n}"
    },
    {
        title: "House Robber",
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Return the maximum amount of money you can rob tonight without alerting the police.",
        category: "Coding",
        difficulty: "Medium",
        points: 25,
        companies: ["Google", "Microsoft", "AirBnB"],
        link: "https://leetcode.com/problems/house-robber/",
        testCases: [{ input: "[1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 4." }],
        starterCode: "function rob(nums) {\n  // Write your code here\n}"
    },
    {
        title: "Longest Increasing Subsequence",
        description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Microsoft", "Google", "Amazon"],
        link: "https://leetcode.com/problems/longest-increasing-subsequence/",
        testCases: [{ input: "[10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4." }],
        starterCode: "function lengthOfLIS(nums) {\n  // Write your code here\n}"
    },
    {
        title: "Coin Change",
        description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
        category: "Coding",
        difficulty: "Medium",
        points: 35,
        companies: ["Amazon", "Walmart", "ByteDance"],
        link: "https://leetcode.com/problems/coin-change/",
        testCases: [{ input: "[1,2,5], 11", output: "3", explanation: "" }],
        starterCode: "function coinChange(coins, amount) {\n  // Write your code here\n}"
    },

    // BACKTRACKING
    {
        title: "Permutations",
        description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
        category: "Coding",
        difficulty: "Medium",
        points: 25,
        companies: ["Microsoft", "Google", "LinkedIn"],
        link: "https://leetcode.com/problems/permutations/",
        testCases: [],
        starterCode: "function permute(nums) {\n  // Write your code here\n}"
    },
    {
        title: "Word Search",
        description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
        category: "Coding",
        difficulty: "Medium",
        points: 30,
        companies: ["Amazon", "Bloomberg", "Zillow"],
        link: "https://leetcode.com/problems/word-search/",
        testCases: [],
        starterCode: "function exist(board, word) {\n  // Write your code here\n}"
    },

    // ADVANCED / HARD
    {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        category: "Coding",
        difficulty: "Hard",
        points: 50,
        companies: ["Amazon", "Google", "Microsoft", "Goldman Sachs"],
        link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        testCases: [],
        starterCode: "function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}"
    },
    {
        title: "Trapping Rain Water",
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        category: "Coding",
        difficulty: "Hard",
        points: 50,
        companies: ["Amazon", "Google", "Facebook", "Goldman Sachs"],
        link: "https://leetcode.com/problems/trapping-rain-water/",
        testCases: [],
        starterCode: "function trap(height) {\n  // Write your code here\n}"
    },
    {
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        category: "Coding",
        difficulty: "Hard",
        points: 50,
        companies: ["Facebook", "Amazon", "Microsoft"],
        link: "https://leetcode.com/problems/merge-k-sorted-lists/",
        testCases: [],
        starterCode: "function mergeKLists(lists) {\n  // Write your code here\n}"
    },
    {
        title: "Serialize and Deserialize Binary Tree",
        description: "Design an algorithm to serialize and deserialize a binary tree.",
        category: "Coding",
        difficulty: "Hard",
        points: 40,
        companies: ["Facebook", "Microsoft", "Amazon"],
        link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        testCases: [],
        starterCode: "function serialize(root) {\n  // Write your code here\n}\n\nfunction deserialize(data) {\n  // Write your code here\n}"
    }

];

module.exports = codingQuestions;
