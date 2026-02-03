const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    questionsSolved: {
        type: Number,
        default: 0
    },
    interviewsCompleted: {
        type: Number,
        default: 0
    },
    resumesCreated: {
        type: Number,
        default: 0
    },
    coinsEarned: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Compound index for efficient querying by user and date
ActivitySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', ActivitySchema);
