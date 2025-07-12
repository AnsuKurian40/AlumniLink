// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  verifyOtp,
  resetPassword
} = require('../controllers/authController');

const { sendOtpEmail } = require('../utils/email'); // Make sure to import sendOtpEmail



router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);


// Email test endpoint (for debugging)
router.get('/test-email', async (req, res) => {
    try {
      await sendOtpEmail("your@test.com", "123456", "reset");
      res.send("Email sent successfully");
    } catch (error) {
      console.error("Email test failed:", error);
      res.status(500).send("Email test failed: " + error.message);
    }
  });


module.exports = router;