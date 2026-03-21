const express = require('express');
const router = express.Router();
const { generateResponse, generateFeedback } = require('../controllers/interviewController');

router.post('/generate', generateResponse);
router.post('/feedback', generateFeedback);

module.exports = router;
