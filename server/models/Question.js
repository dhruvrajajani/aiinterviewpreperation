const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Coding', 'Aptitude', 'Behavioral'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    points: {
        type: Number,
        default: 10
    },
    // For Coding Questions
    testCases: [{
        input: String,
        output: String,
        explanation: String
    }],
    starterCode: {
        type: String
    },
    // For Aptitude Questions
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    companies: [String] // e.g., "Google", "Amazon"
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
