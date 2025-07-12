const express = require("express");
const multer = require("multer");
const Resource = require("../models/Resource");
const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Alumni Uploads a Resource (File + Metadata)
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { title, description, uploadedBy } = req.body;
        const fileUrl = 'http://localhost:5000/uploads/${req.file.filename}';

        const newResource = new Resource({ title, description, fileUrl, uploadedBy });
        await newResource.save();
        console.log("📤 Resource uploaded:", newResource);
        // res.status(201).json({ message: "Resource uploaded successfully!" });
        res.status(201).json({ message: "Resource uploaded successfully!", fileUrl });

    } catch (error) {
        console.error("❌ Error uploading resource:", error);
        res.status(500).json({ message: "Error uploading resource", error });
    }
});

// ✅ Students Fetch All Resources (Including Alumni Name)

router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find({});
        console.log("📂 Sending resources:", resources); // Debug log
        res.json(resources);
    } catch (error) {
        console.error("❌ Error fetching resources:", error);
        res.status(500).json({ message: "Failed to fetch resources" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const resources = await Resource.find();

        console.log("📂 Fetched resources from DB:", resources); // ✅ Log data

        if (resources.length === 0) {
            console.log("⚠️ No resources found in DB!");
        }

        res.status(200).json(resources);
    } catch (error) {
        console.error("❌ Error fetching resources:", error);
        res.status(500).json({ message: "Error fetching resources", error });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedResource = await Resource.findByIdAndDelete(id);

        if (!deletedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting resource:", error);
        res.status(500).json({ message: "Error deleting resource", error });
    }
});


module.exports = router;

