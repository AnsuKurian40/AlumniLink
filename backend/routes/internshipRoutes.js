const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Internship = require("../models/Internship");
const authMiddleware = require("../middleware/authMiddleware");

// Alumni - Add Internship (unchanged)
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { title, company, location, description, stipend, duration, applicationLink } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found." });
        }

        const newInternship = new Internship({
            title,
            company,
            location,
            description,
            stipend,
            duration,
            applicationLink,
            postedBy: userId,
        });

        await newInternship.save();
        res.status(201).json({ message: "Internship added successfully!", internship: newInternship });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Students - Get All Internships (unchanged)
router.get("/all", async (req, res) => {
    try {
        const internships = await Internship.find().populate("postedBy", "name company");
        res.status(200).json(internships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get internship details by ID (optimized version)
router.get("/:id", async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid internship ID format" });
        }

        const internship = await Internship.findById(req.params.id)
            .populate("postedBy", "_id name email role")
            .lean();

        if (!internship) {
            console.log("Internship not found:", req.params.id);
            return res.status(404).json({ message: "Internship not found" });
        }

        // Verify alumni data exists
        if (!internship.postedBy || !internship.postedBy._id) {
            console.error("Missing alumni data for internship:", internship._id);
            return res.status(400).json({ 
                message: "No valid alumni associated with this internship",
                debug: process.env.NODE_ENV === 'development' ? { internship } : undefined
            });
        }

        // Prepare response data - keeping all existing fields
        const responseData = {
            ...internship,
            // Ensure alumniId is always included as a string
            alumniId: internship.postedBy._id.toString(),
            // Maintain the alumni object structure
            alumni: {
                id: internship.postedBy._id,
                name: internship.postedBy.name,
                email: internship.postedBy.email,
                role: internship.postedBy.role
            },
            // Keep original postedBy reference if needed by other services
            postedBy: internship.postedBy
        };

        res.json(responseData);

    } catch (error) {
        console.error("Error fetching internship:", {
            error: error.message,
            stack: error.stack,
            params: req.params
        });
        res.status(500).json({ 
            message: "Failed to fetch internship details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router