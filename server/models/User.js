const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ''
    },
    currentPosition: {
        type: String,
        default: ''
    },
    skills: [String],
    avatar: {
        type: String,
        default: ''
    },
    banner: {
        type: String,
        default: ''
    },
    resume: {
        type: String,
        default: ''
    },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        portfolio: { type: String, default: '' }
    },
    location: {
        type: String,
        default: ''
    },
    badges: [String],
    solvedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    streak: {
        type: Number,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
