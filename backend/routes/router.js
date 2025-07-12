const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure the correct path

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging line

        const { email, password, role } = req.body; // Ensure role is extracted

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Validate role
        if (user.role !== role) {
            return res.status(400).json({ message: `Invalid role selection. You are registered as a ${user.role}.` });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, role: user.role });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Export the router
module.exports = router;
