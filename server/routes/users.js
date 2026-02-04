const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{folder}/{public_id}.{ext}
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    // Get everything after 'upload/v{version}/'
    const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
    const publicIdWithExt = pathParts.join('/');
    // Remove file extension
    return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
};

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

        if (user.resume) {
            // Delete from Cloudinary if it's a Cloudinary URL
            if (user.resume.includes('cloudinary.com')) {
                const publicId = getPublicIdFromUrl(user.resume);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                        console.log('✅ Resume deleted from Cloudinary:', publicId);
                    } catch (error) {
                        console.error('⚠️ Cloudinary deletion failed:', error.message);
                    }
                }
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

// @route   DELETE /api/users/avatar
// @desc    Delete user's avatar
// @access  Private
router.delete('/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete from Cloudinary if it's a Cloudinary URL
        if (user.avatar && user.avatar.includes('cloudinary.com')) {
            const publicId = getPublicIdFromUrl(user.avatar);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('✅ Avatar deleted from Cloudinary:', publicId);
                } catch (error) {
                    console.error('⚠️ Cloudinary deletion failed:', error.message);
                }
            }
        }

        // Clear avatar from database
        user.avatar = '';
        await user.save();

        res.json({ msg: 'Avatar deleted successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/banner
// @desc    Delete user's banner
// @access  Private
router.delete('/banner', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete from Cloudinary if it's a Cloudinary URL
        if (user.banner && user.banner.includes('cloudinary.com')) {
            const publicId = getPublicIdFromUrl(user.banner);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('✅ Banner deleted from Cloudinary:', publicId);
                } catch (error) {
                    console.error('⚠️ Cloudinary deletion failed:', error.message);
                }
            }
        }

        // Clear banner from database
        user.banner = '';
        await user.save();

        res.json({ msg: 'Banner deleted successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
