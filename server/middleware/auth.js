const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerkAuth = ClerkExpressRequireAuth();

module.exports = function (req, res, next) {
    if (req.isMockMode) {
        // Simple mock mode passthrough if needed
        req.user = { id: req.headers['x-mock-user-id'] || 'mock-id' };
        return next();
    }

    clerkAuth(req, res, async (err) => {
        if (err) {
            console.error('Clerk Auth Error:', err);
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        
        if (req.auth && req.auth.userId) {
            try {
                const user = await User.findOne({ clerkId: req.auth.userId });
                if (user) {
                    req.user = { id: user._id };
                }
            } catch (dbErr) {
                console.error('DB User Lookup Error:', dbErr);
            }
        }
        next();
    });
};
