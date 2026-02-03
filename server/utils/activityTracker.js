const Activity = require('../models/Activity');
const User = require('../models/User');

/**
 * Track user activity for the current day
 * @param {String} userId - User ID
 * @param {Object} activityData - { questionsSolved, interviewsCompleted, resumesCreated, coinsEarned }
 */
const trackActivity = async (userId, activityData) => {
    try {
        // Get today's date at midnight (normalized)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create activity for today
        let activity = await Activity.findOne({ user: userId, date: today });

        if (activity) {
            // Update existing activity
            if (activityData.questionsSolved) {
                activity.questionsSolved += activityData.questionsSolved;
            }
            if (activityData.interviewsCompleted) {
                activity.interviewsCompleted += activityData.interviewsCompleted;
            }
            if (activityData.resumesCreated) {
                activity.resumesCreated += activityData.resumesCreated;
            }
            if (activityData.coinsEarned) {
                activity.coinsEarned += activityData.coinsEarned;
            }
            await activity.save();
        } else {
            // Create new activity
            activity = new Activity({
                user: userId,
                date: today,
                questionsSolved: activityData.questionsSolved || 0,
                interviewsCompleted: activityData.interviewsCompleted || 0,
                resumesCreated: activityData.resumesCreated || 0,
                coinsEarned: activityData.coinsEarned || 0
            });
            await activity.save();
        }

        // Update streak
        await updateStreak(userId);

        return activity;
    } catch (error) {
        console.error('Error tracking activity:', error);
        throw error;
    }
};

/**
 * Update user stats
 * @param {String} userId - User ID
 * @param {Object} statsUpdate - Stats to update
 */
const updateUserStats = async (userId, statsUpdate) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Initialize stats if not exists
        if (!user.stats) {
            user.stats = {
                totalQuestionsSolved: 0,
                questionsByDifficulty: { easy: 0, medium: 0, hard: 0 },
                interviewsCompleted: 0,
                averageInterviewScore: 0,
                resumesCreated: 0
            };
        }

        // Update stats
        if (statsUpdate.questionsSolved) {
            user.stats.totalQuestionsSolved += 1;
            const difficulty = statsUpdate.difficulty?.toLowerCase() || 'medium';
            if (user.stats.questionsByDifficulty[difficulty] !== undefined) {
                user.stats.questionsByDifficulty[difficulty] += 1;
            }
        }

        if (statsUpdate.interviewCompleted) {
            user.stats.interviewsCompleted += 1;
            // Update average score
            if (statsUpdate.interviewScore) {
                const totalScore = user.stats.averageInterviewScore * (user.stats.interviewsCompleted - 1) + statsUpdate.interviewScore;
                user.stats.averageInterviewScore = totalScore / user.stats.interviewsCompleted;
            }
        }

        if (statsUpdate.resumeCreated) {
            user.stats.resumesCreated += 1;
        }

        await user.save();
        return user;
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
};

/**
 * Update user streak based on activity
 * @param {String} userId - User ID
 */
const updateStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if user was active yesterday
        const yesterdayActivity = await Activity.findOne({
            user: userId,
            date: yesterday
        });

        const lastActive = user.lastActive ? new Date(user.lastActive) : null;

        if (lastActive) {
            lastActive.setHours(0, 0, 0, 0);
            const daysSinceActive = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

            if (daysSinceActive === 1) {
                // Consecutive day - increment streak
                user.streak = (user.streak || 0) + 1;
            } else if (daysSinceActive > 1) {
                // Streak broken - reset
                user.streak = 1;
            }
            // If same day (daysSinceActive === 0), keep streak as is
        } else {
            // First time active
            user.streak = 1;
        }

        user.lastActive = new Date();
        await user.save();
    } catch (error) {
        console.error('Error updating streak:', error);
    }
};

/**
 * Award coins to user
 * @param {String} userId - User ID
 * @param {Number} amount - Coins to award
 */
const awardCoins = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.coins = (user.coins || 0) + amount;
        await user.save();

        return user.coins;
    } catch (error) {
        console.error('Error awarding coins:', error);
        throw error;
    }
};

module.exports = {
    trackActivity,
    updateUserStats,
    updateStreak,
    awardCoins
};
