// Simple resume tracking route (can be expanded later)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   POST /api/resume/created
// @desc    Track resume creation
// @access  Private
router.post('/created', auth, async (req, res) => {
    try {
        const { trackActivity, updateUserStats, awardCoins } = require('../utils/activityTracker');
        const User = require('../models/User');

        const user = await User.findById(req.user.id);
        if (user.coins < 10) {
            return res.status(400).json({ msg: 'Not enough coins. Creating a resume costs 10 coins.' });
        }

        // Deduct coins for creating resume
        await awardCoins(req.user.id, -10);

        // Track activity
        await trackActivity(req.user.id, {
            resumesCreated: 1,
            coinsEarned: -10
        });

        // Update stats
        await updateUserStats(req.user.id, {
            resumeCreated: true
        });

        res.json({ success: true, message: 'Resume creation tracked' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
