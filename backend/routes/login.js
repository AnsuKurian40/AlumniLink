const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        console.log("Login route hit!"); 
        console.log("Received request body:", req.body); // Debugging line

        const { email, password, role } = req.body; // Ensure role is extracted

        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the selected role matches the user's role in the database
        if (user.role !== role) {
            return res.status(400).json({ message: `Invalid role selection. You are registered as a ${user.role}.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
      

        console.log("Backend found user:", user); // ✅ Step 3: Check retrieved user
        console.log("Backend sent role:", user.role); // ✅ Step 4: Confirm role exists
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // console.log("Backend sent role:", user.role); // ✅ Debug the role before sending it

        res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
