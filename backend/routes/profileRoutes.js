const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Alumni = require('../models/AlumniModel');
const Student = require('../models/StudentModel');

// Configure multer storage for profile pictures
const profilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/profile-pictures/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-${req.params.userId}-${uniqueSuffix}${ext}`);
    }
});

const uploadProfilePicture = multer({ 
    storage: profilePictureStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get user type (alumni or student)
router.get('/user-type/:userId', async (req, res) => {
    try {
        const alumni = await Alumni.findOne({ userId: req.params.userId });
        if (alumni) {
            return res.json({ isAlumni: true });
        }

        const student = await Student.findOne({ userId: req.params.userId });
        if (student) {
            return res.json({ isAlumni: false });
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get alumni profile
router.get('/alumni/:userId', async (req, res) => {
    try {
        const alumni = await Alumni.findOne({ userId: req.params.userId });
        if (!alumni) {
            return res.status(404).json({ message: 'Alumni not found' });
        }
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get student profile
router.get('/student/:userId', async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.params.userId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update alumni profile with file upload
router.put('/alumni/:userId', uploadProfilePicture.single('profilePicture'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, '/'); // Convert to forward slashes for consistency
        }

        const updatedAlumni = await Alumni.findOneAndUpdate(
            { userId: req.params.userId },
            updateData,
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedAlumni) {
            // Clean up uploaded file if profile not found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Alumni not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedAlumni
        });
    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error updating alumni profile:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
});

// Update student profile with file upload
router.put('/student/:userId', uploadProfilePicture.single('profilePicture'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, '/'); // Convert to forward slashes for consistency
        }

        const updatedStudent = await Student.findOneAndUpdate(
            { userId: req.params.userId },
            updateData,
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            // Clean up uploaded file if profile not found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error updating student profile:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
});

module.exports = router;