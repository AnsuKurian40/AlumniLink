// backend/controllers/authController.js
const User = require('../models/User');
const OTP = require('../models/OtpModel');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../utils/email');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    // Check if user exists (security measure)
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("Email not found in database:", email);
      // Generic response for security
      return res.status(200).json({ 
        success: true,
        message: "If this email exists in our system, you'll receive an OTP" 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp, "for email:", email);
    
    // Create or update OTP record
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        createdAt: new Date(),
        verified: false
      },
      { upsert: true, new: true }
    );

    console.log("Attempting to send password reset OTP email");
    await sendOtpEmail(email, otp, 'reset');
    console.log("Password reset OTP email sent successfully");

    res.status(200).json({ 
      success: true,
      message: "OTP sent to your email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to process OTP request",
      error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("OTP verification request for:", email);
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      console.log("No OTP found for this email");
      return res.status(400).json({ 
        success: false,
        message: "OTP expired or invalid" 
      });
    }

    console.log("Stored OTP:", otpRecord.otp, "Received OTP:", otp);
    
    // OTP comparison
    if (otpRecord.otp !== otp.toString()) {
      console.log("OTP mismatch");
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP" 
      });
    }

    // Manual expiration check (redundant with TTL but good practice)
    const currentTime = new Date();
    const otpAge = (currentTime - otpRecord.createdAt) / 1000 / 60;
    if (otpAge > 5) {
      console.log("Expired OTP");
      await OTP.deleteOne({ email }); // Clean up expired OTP
      return res.status(400).json({ 
        success: false,
        message: "OTP expired" 
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    console.log("OTP verified successfully");
    res.status(200).json({ 
      success: true,
      message: "OTP verified successfully",
      data: { email } // Include email for next step
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to verify OTP",
      error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Password reset request for:", email);
    
    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found during password reset");
      return res.status(404).json({ 
        success: false,
        message: "User account not found" 
      });
    }

    // Verify OTP record
    const otpRecord = await OTP.findOne({ 
      email,
      otp,
      verified: true
    });
    
    if (!otpRecord) {
      console.log("Invalid or unverified OTP during password reset");
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired OTP" 
      });
    }

    // Final expiration check
    const currentTime = new Date();
    const otpAge = (currentTime - otpRecord.createdAt) / 1000 / 60;
    if (otpAge > 5) {
      console.log("Expired OTP during password reset");
      await OTP.deleteOne({ email });
      return res.status(400).json({ 
        success: false,
        message: "OTP session expired" 
      });
    }

    // Password validation
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    console.log("Hashing new password");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Clean up OTP record
    await OTP.deleteOne({ email });

    console.log("Password reset successful for:", email);
    res.status(200).json({ 
      success: true,
      message: "Password reset successful",
      data: { email: user.email }
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to reset password",
      error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
    });
  }
};