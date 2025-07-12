const jwt = require("jsonwebtoken");
const Alumni = require("../models/AlumniModel");
const Student = require("../models/StudentModel");
//const User = require("../models/User");
// Function to verify JWT token
const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
    return null;
};

// ✅ Get user profile
const getUserProfile = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        const userId = decoded.id;
        let user = await Alumni.findOne({ userId }) || await Student.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        const userId = decoded.id;
        let user = await Alumni.findOne({ userId }) || await Student.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the fields sent in the request
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key];
            }
        });

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUserProfile, updateUserProfile };



