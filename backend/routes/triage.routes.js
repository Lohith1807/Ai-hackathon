const express = require('express');
const triageController = require('../controllers/triage.controller');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const triageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: 'Too many triage requests, please try again after a minute',
});

// Protect all routes in triage - wait, the user prompt says:
// "Add an auth middleware (requireAuth) that verifies the JWT cookie and attaches the user to req.user, applied to every protected route (/triage, /history)"
// But also says "Save each result to MongoDB linked to the user's email, with a user-facing consent toggle before any history is stored"
// So the triage endpoint requires auth.
router.use(protect);

router.post('/', triageLimiter, triageController.assessTriage);

module.exports = router;
