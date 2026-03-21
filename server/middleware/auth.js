const { clerkMiddleware, getAuth } = require('@clerk/express');
const User = require('../models/User');

module.exports = function (req, res, next) {
    if (req.isMockMode) {
        req.user = { id: req.headers['x-mock-user-id'] || 'mock-id' };
        return next();
    }

    // Use modern @clerk/express middleware
    clerkMiddleware()(req, res, async (err) => {
        if (err) {
            console.error('Clerk Middleware Error:', err);
            return res.status(401).json({ msg: 'Authentication failed', detail: err.message });
        }

        try {
            const auth = getAuth(req);
            req.auth = auth; // expose for routes that need clerkId directly

            if (auth && auth.userId) {
                const user = await User.findOne({ clerkId: auth.userId });
                if (user) {
                    req.user = { id: user._id };
                }
            }
        } catch (dbErr) {
            console.error('DB User Lookup Error:', dbErr);
        }
        next();
    });
};
