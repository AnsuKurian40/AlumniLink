const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Send success response
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
