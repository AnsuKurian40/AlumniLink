const express = require("express");
const multer = require("multer");
const Report = require("../models/Report");
//const ActivityLog = require('../models/ActivityLog');  // Adjust the path to match your project structure
    
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Configure Multer for file uploads (storing images in memory)
//const storage = multer.memoryStorage();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Add Report API
router.post("/add-report", adminAuthMiddleware, upload.single("document"), async (req, res) => {
    try {
        const { title, description, category, year, month } = req.body;
       // const image = req.file ? req.file.buffer : null; // Store as Buffer

        const newReport = new Report({
            title,
            description,
            category,
            year,
            month,
            document: req.file? `/uploads/${req.file.filename}` : null, // Store image as Buffer instead of Base64
        });

        await newReport.save();
        res.status(201).json({ message: "Report added successfully", report: newReport });
    } catch (error) {
        console.error("Error adding report:", error);
        res.status(500).json({ message: "Failed to add report" });
    }
});


// Get all reports
router.get("/get-reports", adminAuthMiddleware, async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

router.get("/view-document/:id", async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report || !report.image) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.sendFile(report.image, { root: "uploads/" }); // Adjust storage path
    } catch (error) {
        res.status(500).json({ message: "Error fetching document", error });
    }
});

  

module.exports = router;
