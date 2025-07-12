const express = require("express");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Alumni Adds Anonymous Review
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { companyName, description } = req.body;

        // ✅ Ensure only alumni can post reviews
        if (req.user.role !== "Alumni") {
            return res.status(403).json({ message: "Only alumni can add reviews" });
        }

        if (!companyName || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Store review anonymously
        const newReview = new Review({ companyName, description });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully!" });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get All Reviews (No Alumni Data)
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
