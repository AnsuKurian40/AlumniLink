const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile } = require('../controllers/AlumniController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

// 🟢 Get Student Profile
router.get('/profile', authMiddleware, getStudentProfile); // Use authMiddleware to protect the route

// 🟢 Update Student Profile
router.put('/profile', authMiddleware, updateStudentProfile); // Protect the update route with authMiddleware

module.exports = router;
