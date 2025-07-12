const express = require("express"); 
const multer = require("multer"); 
const path = require("path"); 
const bcrypt = require("bcryptjs"); 
const Alumni = require("../models/AlumniModel"); 
const Student = require("../models/StudentModel"); 
const User = require("../models/User"); 
const { sendOtpEmail } = require("../utils/email"); 
const OTP = require("../models/OtpModel"); 
const AdminUser = require("../models/AdminUserModel"); 
 
const router = express.Router(); 
 
// Configure multer for file uploads 
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    cb(null, "uploads/"); 
  }, 
  filename: (req, file, cb) => { 
    cb(null, Date.now() + path.extname(file.originalname)); 
  }, 
}); 
const upload = multer({ storage }); 
 
// Step 1: Check if User Exists & Send OTP 
router.post("/send-otp", async (req, res) => { 
  try { 
    const { admissionNumber, name, email } = req.body; 
 
    // Check if user exists in Admin Database 
    const adminUser = await AdminUser.findOne({ admissionNumber, name }); 
    if (!adminUser) { 
      return res.status(400).json({ message: "User not found in records. Please contact admin." }); 
    } 
 
    // Generate & Store OTP 
    const otpCode = Math.floor(100000 + Math.random() * 900000); 
    const otpData = { 
      email, 
      otp: otpCode, 
      createdAt: Date.now(), 
      verified: false, 
    }; 
 
    await OTP.updateOne({ email }, otpData, { upsert: true }); 
    await sendOtpEmail(email, otpCode); 
    res.status(200).json({ message: "OTP sent successfully. Please verify." }); 
  } catch (error) { 
    res.status(500).json({ message: "Failed to send OTP.", error: error.message }); 
  } 
}); 
 
// Step 2: Verify OTP 
router.post("/verify-otp", async (req, res) => { 
  try { 
    const { email, otp } = req.body; 
    const otpRecord = await OTP.findOne({ email }); 
    console.log("OTP Record found:", otpRecord); 
 
    if (!otpRecord || otpRecord.otp.toString() !== otp.toString()) { 
      return res.status(400).json({ message: "Invalid OTP. Please try again." }); 
    } 
 
    const otpExpiryTime = 10 * 60 * 1000; 
    if (Date.now() - otpRecord.createdAt > otpExpiryTime) { 
      return res.status(400).json({ message: "OTP has expired. Please request a new one." }); 
    } 
 
    // Mark OTP as verified 
    await OTP.updateOne({ email }, { $set: { verified: true } }); 
    console.log("OTP Verified for:", email); 
 
    res.status(200).json({ success: true, message: "OTP verified successfully." }); 
  } catch (error) { 
    res.status(500).json({ message: "Failed to verify OTP.", error: error.message }); 
  } 
}); 
 
// Step 3: Register User (Without OTP Validation Again) 
router.post( 
  "/register", 
  upload.fields([ 
    { name: "idCard", maxCount: 1 }, 
    { name: "profilePicture", maxCount: 1 }, 
    { name: "idProof", maxCount: 1 }, 
  ]), 
  async (req, res) => { 
    try { 
      console.log("     Received Registration Request:", req.body); 
 
      const { 
        admissionNumber, 
        name, 
        email, 
        password, 
        gender, 
        dob, 
        role, 
        department, 
        yearOfAdmission, 
        graduationYear, 
        currentYear, 
        rollNumber, 
        ktuId, 
        industry, 
        yearsOfExperience, 
        currentJobTitle, 
        company, 
      } = req.body; 
 
      if (!email || !password || !role || !name || !admissionNumber) { 
        return res.status(400).json({ message: "Required fields missing" }); 
      } 
 
      // Check if OTP was verified before allowing registration 
      const otpRecord = await OTP.findOne({ email }); 
      if (!otpRecord || !otpRecord.verified) { 
        return res.status(400).json({ message: "OTP not verified. Please verify before registration." }); 
      } 
 
      const salt = await bcrypt.genSalt(10); 
      //    FIX: Ensure `hashedPassword` is declared **before** using it 
      const hashedPassword = await bcrypt.hash(password, salt); 
 
      console.log("Original Password:", password); 
      console.log("Hashed Password Stored:", hashedPassword); 
 
      // Create User in `User` collection 
      const user = new User({ 
        admissionNumber, 
        name, 
        email, 
        password: hashedPassword, //    Correctly placed now 
        role, 
      }); 
      await user.save(); 
      console.log("   User saved successfully:", user); 
 
      if (role.toLowerCase() === "student") { 
        console.log("     Saving student data..."); 
        const student = new Student({ 
          userId: user._id, 
          admissionNumber, 
          name, 
          email, 
          gender, 
          dob, 
          department, 
          yearOfAdmission: parseInt(yearOfAdmission), 
          graduationYear: parseInt(graduationYear), 
          ktuId, 
          currentYear, 
          rollNumber, 
          idCard: req.files["idCard"] ? req.files["idCard"][0].path : null, 
          profilePicture: req.files["profilePicture"] ? req.files["profilePicture"][0].path : null, 
          isVerified: false, 
        }); 
        await student.save(); 
        console.log("   Student data saved successfully:", student); 
      } else if (role.toLowerCase() === "alumni") { 
        console.log("     Saving alumni data..."); 
        const alumni = new Alumni({ 
          userId: user._id, 
          admissionNumber, 
          name, 
          email, 
          gender, 
          dob, 
          department, 
          graduationYear: parseInt(graduationYear), 
          profilePicture: req.files["profilePicture"] ? req.files["profilePicture"][0].path : null, 
          idProof: req.files["idProof"] ? req.files["idProof"][0].path : null, 
          industry, 
          yearsOfExperience: parseInt(yearsOfExperience), 
          currentJobTitle, 
          company, 
          isVerified: false, 
        }); 
        await alumni.save(); 
        console.log("   Alumni data saved successfully:", alumni); 
      } else { 
        console.log("  Invalid role:", role); 
        return res.status(400).json({ message: "Invalid role provided" }); 
      } 
 
      // Delete OTP after successful registration 
      await OTP.deleteOne({ email }); 
 
      res.status(200).json({ message: "Registration successful. You can now log in." }); 
    } catch (error) { 
      console.error("  Registration failed:", error); 
      res.status(500).json({ message: "Registration failed.", error: error.message }); 
    } 
  } 
); 
 
module.exports = router; 