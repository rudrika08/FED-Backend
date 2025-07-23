const express = require('express');
const { getSummary, getAutofill } = require('../../../../controllers/blog/gemini');

const router = express.Router();

// Route for 2-line summary
router.post('/summary', getSummary);

// Route for autofill
router.post('/autofill', getAutofill);

module.exports = router;