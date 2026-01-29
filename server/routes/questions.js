const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all questions
router.get('/', async (req, res) => {
    try {
        if (req.isMockMode) {
            const mockData = require('../mockData');
            const { category } = req.query;
            if (category) {
                return res.json(mockData.questions.filter(q => q.category === category));
            }
            return res.json(mockData.questions);
        }

        const { category, difficulty } = req.query;
        let query = {};
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query).select('-testCases -starterCode');
        res.json(questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single question by ID
router.get('/:id', async (req, res) => {
    try {
        if (req.isMockMode) {
            const mockData = require('../mockData');
            const q = mockData.questions.find(q => q._id === req.params.id);
            if (!q) return res.status(404).json({ msg: 'Question not found' });
            return res.json(q);
        }

        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ msg: 'Question not found' });
        res.json(question);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Question not found' });
        res.status(500).send('Server Error');
    }
});

// Submit Answer
router.post('/submit/:id', auth, async (req, res) => {
    try {
        if (req.isMockMode) {
            const mockData = require('../mockData');
            const q = mockData.questions.find(q => q._id === req.params.id);
            if (!q) return res.status(404).json({ msg: 'Question not found' });

            // In mock mode, find user in array
            // Since we don't have user ID in token for mock easily unless we matched it perfectly, 
            // we'll just return success for the demo.
            return res.json({ success: true, points: q.points, coins: 100 });
        }

        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ msg: 'Question not found' });

        const user = await User.findById(req.user.id);

        if (!user.solvedQuestions.includes(question.id)) {
            user.solvedQuestions.push(question.id);
            user.coins += question.points;
            user.streak += 1; // Simple streak logic
            await user.save();
        }

        res.json({ success: true, points: question.points, coins: user.coins });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
