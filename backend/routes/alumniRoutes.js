const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Alumni = require("../models/AlumniModel");

// 🟢 GET Alumni Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        console.log("Fetching Alumni Profile for User ID:", req.user.id);

        const alumni = await Alumni.findOne({ userId: req.user.id });

        if (!alumni) {
            return res.status(404).json({ message: "Alumni profile not found" });
        }

        res.json(alumni);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🟢 UPDATE Alumni Profile
router.put("/update-profile", authMiddleware, async (req, res) => {
    try {
        console.log("Update Request Body:", req.body);

        // Ensure user is authenticated
        if (!req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        // Check if the alumni exists
        let alumni = await Alumni.findOne({ userId: req.user.id });
        if (!alumni) {
            return res.status(404).json({ message: "Alumni profile not found" });
        }

        // Ensure the request body contains valid fields (example check for name)
        const { name, email, profession } = req.body;
        if (!name || !email || !profession) {
            return res.status(400).json({ message: "Missing required fields: name, email, profession" });
        }

        // Update alumni profile
        const updatedAlumni = await Alumni.findOneAndUpdate(
            { userId: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedAlumni) {
            return res.status(400).json({ message: "Profile update failed" });
        }

        console.log("Updated Alumni Profile:", updatedAlumni);
        res.json(updatedAlumni);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

module.exports = router;
