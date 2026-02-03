const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { bio, currentPosition, skills, socialLinks, location } = req.body;

    // Build profile object
    const profileFields = {};
    if (bio) profileFields.bio = bio;
    if (currentPosition) profileFields.currentPosition = currentPosition;
    if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    if (location) profileFields.location = location;
    const { avatar, banner, resume } = req.body;
    if (avatar) profileFields.avatar = avatar;
    if (avatar) profileFields.avatar = avatar;
    if (banner) profileFields.banner = banner;
    if (resume) profileFields.resume = resume;
    if (req.body.username) profileFields.username = req.body.username;

    profileFields.socialLinks = {};
    if (socialLinks) {
        if (socialLinks.github) profileFields.socialLinks.github = socialLinks.github;
        if (socialLinks.linkedin) profileFields.socialLinks.linkedin = socialLinks.linkedin;
        if (socialLinks.portfolio) profileFields.socialLinks.portfolio = socialLinks.portfolio;
    }

    try {
        if (req.isMockMode) {
            const mockData = require('../mockData');
            let user = mockData.users.find(u => u.id === req.user.id);
            if (!user) return res.status(404).json({ msg: 'User not found' });

            // Update mock user
            if (bio) user.bio = bio;
            if (currentPosition) user.currentPosition = currentPosition;
            if (skills) user.skills = profileFields.skills;
            if (skills) user.skills = profileFields.skills;
            if (location) user.location = location;
            if (avatar) user.avatar = avatar;
            if (avatar) user.avatar = avatar;
            if (banner) user.banner = banner;
            if (req.body.username) user.username = req.body.username;
            if (resume) user.resume = resume;
            if (socialLinks) {
                user.socialLinks = { ...user.socialLinks, ...profileFields.socialLinks };
            }

            const { password, ...userData } = user;
            return res.json(userData);
        }

        let user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update fields individually to avoid overwriting entire object if using findOneAndUpdate with strict replacement, 
        // though $set in findOneAndUpdate is better. Let's use simple assignment and save.
        // Actually findOneAndUpdate is cleaner.

        user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/resume
// @desc    Delete user's resume
// @access  Private
router.delete('/resume', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // If user has a resume, delete the file
        if (user.resume) {
            const resumePath = path.join(__dirname, '..', user.resume);

            // Check if file exists and delete it
            if (fs.existsSync(resumePath)) {
                fs.unlinkSync(resumePath);
            }

            // Clear resume from database
            user.resume = '';
            await user.save();

            res.json({ msg: 'Resume deleted successfully', user });
        } else {
            res.status(400).json({ msg: 'No resume to delete' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
