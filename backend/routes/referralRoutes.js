const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Referral = require("../models/Referral");
const Internship = require("../models/Internship");
const User = require("../models/User");
const { sendReferralNotification, sendReferralStatusUpdate } = require('../utils/email');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../referral_resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// Middleware to validate ObjectIDs
const validateObjectId = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

// Apply validation to all ID parameters
router.param('id', validateObjectId);
router.param('alumniId', validateObjectId);
router.param('studentId', validateObjectId);
router.param('internshipId', validateObjectId);

// Student sends referral request with resume upload
router.post("/", upload.single('resume'), async (req, res) => {
  try {
    console.log('Received referral data:', req.body);
    
    const { studentId, alumniId, internshipId, message } = req.body;

    // Validate required fields
    if (!studentId || !alumniId || !internshipId || !message) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Check if student already has a referral request for this internship
    const existingReferral = await Referral.findOne({
      student: studentId,
      internship: internshipId
    });

    if (existingReferral) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: "You have already requested a referral for this internship",
        existingStatus: existingReferral.status
      });
    }

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Internship not found" });
    }

    // Check if alumni exists and is actually an alumni
    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== "Alumni") {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Alumni not found or invalid role" });
    }

    // Check if student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Student not found or invalid role" });
    }

    // Create new referral with resume URL
    const newReferral = new Referral({
      student: studentId,
      alumni: alumniId,
      internship: internshipId,
      message,
      resumeUrl: `/referral-resumes/${req.file.filename}`,
      status: "Pending"
    });

    await newReferral.save();

    // Send email notification to alumni
    await sendReferralNotification(
      alumni.email,
      student.name,
      internship.position || internship.title,
      internship.company,
      message,
      `${req.protocol}://${req.get('host')}${newReferral.resumeUrl}`
    );

    res.status(201).json(newReferral);
  } catch (error) {
    console.error('Error creating referral:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Resume download endpoint
router.get('/resume/:filename', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../referral_resumes', req.params.filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alumni gets all referral requests
router.get("/alumni/:alumniId", async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, must-revalidate');
    
    const referrals = await Referral.find({ alumni: req.params.alumniId })
      .populate("student", "name email")
      .populate({
        path: "internship",
        select: "title company position postedBy",
        populate: {
          path: "postedBy",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    // Enhanced debug logging
    console.log('Fetched referrals for alumni:', {
      alumniId: req.params.alumniId,
      count: referrals.length,
      referrals: referrals.map(r => ({
        id: r._id,
        student: r.student?.name || 'Unknown',
        alumni: r.alumni?.toString(), // Since we didn't populate alumni here
        internship: {
          title: r.internship?.title || 'No title',
          position: r.internship?.position || 'No position',
          company: r.internship?.company || 'No company',
          postedBy: r.internship?.postedBy?.name || 'Unknown'
        },
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      })),
      populatedFields: {
        student: true,
        internship: true,
        'internship.postedBy': true
      }
    });
    
    res.json(referrals);
  } catch (error) {
    console.error('Error fetching alumni referrals:', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      params: req.params,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to fetch referral requests',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Student gets their referral requests
router.get("/student/:studentId", async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, must-revalidate');
    
    const referrals = await Referral.find({ student: req.params.studentId })
      .populate("alumni", "name email")
      .populate({
        path: "internship",
        select: "title company location position",
        populate: {
          path: "postedBy",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (error) {
    console.error('Error fetching student referrals:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Alumni updates referral status
router.put("/:id/status", async (req, res) => {
  try {
    const { status, rejectReason } = req.body;
    
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (status === "Rejected" && !rejectReason?.trim()) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        rejectReason: status === "Rejected" ? rejectReason : undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    )
      .populate("student", "name email")
      .populate("internship", "position company title")
      .populate("alumni", "name email");

    if (!referral) {
      return res.status(404).json({ error: "Referral not found" });
    }

    await sendReferralStatusUpdate(
      referral.student.email,
      referral.alumni.name,
      referral.internship.position || referral.internship.title,
      referral.internship.company,
      status,
      rejectReason
    );

    res.json(referral);
  } catch (error) {
    console.error('Error updating referral status:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;