const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['behavioral', 'technical', 'mixed'],
        default: 'mixed'
    },
    questions: [{
        question: String,
        answer: String,
        score: Number // 1-5 scale
    }],
    overallScore: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
