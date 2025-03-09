const express = require("express");
const multer = require("multer");
const path = require("path");
const Resource = require("../models/Resource");

const router = express.Router();


// ✅ Ensure `uploads/` folder exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Created 'uploads' folder");
}


// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads"); // Ensure correct folder
        console.log("Upload Path:", uploadPath); // Debugging log
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ Basic Upload Route
router.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log("Received file:", req.file);
        console.log("Received body:", req.body);

        if (!req.file) {
            console.log("❌ No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // ✅ File path for local storage
        // const fileUrl = http://localhost:5000/uploads/${req.file.filename};
        // const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        const fileUrl = req.file.filename;
        // ✅ Check if metadata exists
        const { title, description, uploadedBy } = req.body;
        if (!title || !description) {
            console.log("❌ Missing title or description");
            return res.status(400).json({ message: "Title and description are required" });
        }

        // ✅ Ensure uploadedBy is a string (or default to "Unknown")
        const newResource = new Resource({
            title,
            description,
            fileUrl,
            uploadedBy: uploadedBy || "Unknown"
        });

        console.log("Saving to DB:", newResource); // ✅ Debugging

        await newResource.save(); // ✅ This must execute
        console.log("✅ Resource saved successfully!");

        res.status(201).json({
            success: true,
            message: "Resource uploaded and saved successfully!",
             fileUrl // ✅ Full URL
        });

    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Error uploading resource", error });
    }
});

// ✅ Fetch all resources
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find();
        console.log("Fetched resources:", resources); // 🔍 Debugging log
        res.json(resources);
    } catch (error) {
        console.error("❌ Error fetching resources:", error);
        res.status(500).json({ message: "Error fetching resources" });
    }
});

module.exports = router;