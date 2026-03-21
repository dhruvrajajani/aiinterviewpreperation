const { getAuth } = require('@clerk/express');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    if (req.isMockMode) {
        req.user = { id: req.headers['x-mock-user-id'] || 'mock-id' };
        return next();
    }

    try {
        const auth = getAuth(req);
        req.auth = auth; // Ensure it's available

        if (!auth || !auth.userId) {
            return res.status(401).json({ msg: 'No active session found' });
        }

        const user = await User.findOne({ clerkId: auth.userId });
        if (user) {
            req.user = { id: user._id };
        }
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(401).json({ msg: 'Authentication failed', detail: err.message });
    }
};
