const express = require('express');
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP/email to 3 OTP requests per windowMs
  message: 'Too many OTP requests, please try again after 10 minutes',
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  }
});

router.post('/request-otp', otpLimiter, authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/logout', authController.logout);

module.exports = router;
