const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (req.isMockMode) {
            const mockData = require('../mockData');
            let user = mockData.users.find(u => u.email === email);
            if (user) return res.status(400).json({ msg: 'User already exists' });

            user = {
                id: Date.now().toString(),
                username,
                email,
                password, // In mock mode, we store plain text or simple hash
                coins: 0,
                streak: 0
            };
            mockData.users.push(user);

            const payload = { user: { id: user.id } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
            });
            return;
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (req.isMockMode) {
            const mockData = require('../mockData');
            let user = mockData.users.find(u => u.email === email);
            if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

            if (user.password !== password) return res.status(400).json({ msg: 'Invalid Credentials' }); // Simple check for mock

            const payload = { user: { id: user.id } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
            });
            return;
        }

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, coins: user.coins } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        if (req.isMockMode) {
            const mockData = require('../mockData');
            const user = mockData.users.find(u => u.id === req.user.id);
            if (!user) return res.status(404).json({ msg: 'User not found' });
            // remove password
            const { password, ...userData } = user;
            return res.json(userData);
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
