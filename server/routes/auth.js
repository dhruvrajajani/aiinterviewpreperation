const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to check and grant 100 coins if a new month has started
const checkMonthlyCoins = async (user) => {
    const now = new Date();
    if (!user.lastMonthlyCoinsDate || 
        user.lastMonthlyCoinsDate.getMonth() !== now.getMonth() || 
        user.lastMonthlyCoinsDate.getFullYear() !== now.getFullYear()) {
        
        user.coins = (user.coins || 0) + 100;
        user.lastMonthlyCoinsDate = now;
        await user.save();
    }
};

// Sync user from Clerk to our DB
router.post('/sync', require('../middleware/auth'), async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const { email, username, avatar } = req.body; 

        if (!clerkId || !email) {
            return res.status(400).json({ msg: 'Clerk ID and email are required' });
        }

        let user = await User.findOne({ clerkId });
        if (!user) {
            // New user, create them in our DB
            let baseUsername = (username || email.split('@')[0]).replace(/\s+/g, '').toLowerCase();
            let finalUsername = baseUsername;
            let exists = await User.findOne({ username: finalUsername });
            while (exists) {
                finalUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
                exists = await User.findOne({ username: finalUsername });
            }

            user = new User({
                clerkId,
                email,
                username: finalUsername,
                avatar: avatar || ''
            });
            await user.save();
        } else {
            // Existing user, update avatar if necessary, provided they haven't set a custom Cloudinary avatar
            if (avatar && user.avatar !== avatar && (!user.avatar || !user.avatar.includes('cloudinary.com'))) {
                user.avatar = avatar;
                await user.save();
            }
        }

        // Grant monthly coins if applicable
        await checkMonthlyCoins(user);

        res.json(user);
    } catch (err) {
        console.error('Sync Error Full:', err);
        res.status(500).json({ msg: 'Server Error', detail: err.message });
    }
});

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(404).json({ msg: 'User profile not yet synced to DB' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Grant monthly coins if applicable
        await checkMonthlyCoins(user);

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
