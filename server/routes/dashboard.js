const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');
const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');

// @route   GET /api/dashboard/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('stats coins streak');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({
            stats: user.stats || {
                totalQuestionsSolved: 0,
                questionsByDifficulty: { easy: 0, medium: 0, hard: 0 },
                interviewsCompleted: 0,
                averageInterviewScore: 0,
                resumesCreated: 0
            },
            coins: user.coins || 0,
            streak: user.streak || 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/activity
// @desc    Get user activity history
// @access  Private
router.get('/activity', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const activities = await Activity.find({
            user: req.user.id,
            date: { $gte: startDate }
        }).sort({ date: -1 });

        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/recent
// @desc    Get recent user activities
// @access  Private
router.get('/recent', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent interview sessions
        const recentInterviews = await InterviewSession.find({ user: req.user.id })
            .sort({ completedAt: -1 })
            .limit(3)
            .select('type overallScore completedAt');

        // Get recent resumes
        const recentResumes = await Resume.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('fullName createdAt');

        // Combine and format activities
        const activities = [];

        recentInterviews.forEach(interview => {
            activities.push({
                type: 'interview',
                description: `Completed ${interview.type} interview`,
                score: interview.overallScore,
                timestamp: interview.completedAt
            });
        });

        recentResumes.forEach(resume => {
            activities.push({
                type: 'resume',
                description: `Created resume: ${resume.fullName || 'Untitled'}`,
                timestamp: resume.createdAt
            });
        });

        // Sort by timestamp and limit
        activities.sort((a, b) => b.timestamp - a.timestamp);
        res.json(activities.slice(0, limit));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/performance
// @desc    Get performance trends
// @access  Private
router.get('/performance', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get activity data for the period
        const activities = await Activity.find({
            user: req.user.id,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Get interview performance
        const interviews = await InterviewSession.find({
            user: req.user.id,
            completedAt: { $gte: startDate }
        }).sort({ completedAt: 1 });

        res.json({
            activities,
            interviews
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/dashboard/interview/complete
// @desc    Record completed interview
// @access  Private
router.post('/interview/complete', auth, async (req, res) => {
    try {
        const { type, questions, overallScore, duration } = req.body;

        const { trackActivity, updateUserStats } = require('../utils/activityTracker');
        const InterviewSession = require('../models/InterviewSession');

        // Create interview session
        const session = new InterviewSession({
            user: req.user.id,
            type: type || 'mixed',
            questions: questions || [],
            overallScore: overallScore || 0,
            duration: duration || 0,
            completedAt: new Date()
        });

        await session.save();

        // Track activity
        await trackActivity(req.user.id, {
            interviewsCompleted: 1,
            coinsEarned: Math.floor(overallScore) * 2 // 2 coins per score point
        });

        // Update user stats
        await updateUserStats(req.user.id, {
            interviewCompleted: true,
            interviewScore: overallScore
        });

        res.json({ success: true, session });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
