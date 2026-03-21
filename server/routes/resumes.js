// Simple resume tracking route (can be expanded later)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Groq = require('groq-sdk');

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @route   POST /api/resume/ats
// @desc    Analyze resume content for ATS scoring via AI
// @access  Private
router.post('/ats', auth, async (req, res) => {
    try {
        const { trackActivity, awardCoins } = require('../utils/activityTracker');
        const User = require('../models/User');
        const { resumeData } = req.body;

        const user = await User.findById(req.user.id);
        if (user.coins < 5) {
            return res.status(400).json({ msg: 'Not enough coins. ATS Analysis costs 5 coins.' });
        }

        if (!resumeData) {
            return res.status(400).json({ msg: 'Resume data is required' });
        }

        // Deduct 5 coins
        await awardCoins(req.user.id, -5);

        // Track activity
        await trackActivity(req.user.id, {
            coinsEarned: -5
        });

        const prompt = `Act as an expert Applicant Tracking System (ATS) and a Senior Technical Recruiter.
Evaluate the following raw resume data in JSON format. Calculate an overall ATS match score out of 100 based on standard criteria: 
completeness of sections, use of action verbs, quantifiable metrics, and overall keyword richness.

Respond ONLY with a valid, perfectly parsing JSON object (no markdown wrapping, no extra text) with the following structure:
{
  "score": number (0-100),
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "tips": ["string", "string", "string"]
}

Resume Data:
${JSON.stringify(resumeData)}`;

        const response = await groq.chat.completions.create({
             model: 'llama-3.3-70b-versatile',
             messages: [
                 { role: 'user', content: prompt }
             ],
             response_format: { type: "json_object" }
        });

        const feedback = JSON.parse(response.choices[0].message.content);
        res.json(feedback);
    } catch (err) {
        console.error('ATS Analysis Error:', err);
        res.status(500).json({ msg: 'Failed to analyze resume' });
    }
});

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
