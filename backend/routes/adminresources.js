const express = require("express");
const Resource = require("../models/Resource");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// ✅ Fetch all resources (Admin View)
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);
    } catch (error) {
        console.error("❌ Error fetching resources:", error);
        res.status(500).json({ message: "Error fetching resources", error });
    }
});

// ✅ Delete resource by ID (Admin Action)
router.delete("/:id", async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // ✅ Correct the file path extraction
        const fileName = resource.fileUrl.split("/uploads/")[1]; 
        const filePath = path.join(__dirname, "../uploads", fileName);

        console.log("🗑 Deleting file:", filePath); // Debugging log

        // ✅ Check if file exists before deleting
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete file
        } else {
            console.warn("⚠ File not found on server.");
        }

        // ✅ Remove from database
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting resource:", error);
        res.status(500).json({ message: "Error deleting resource", error });
    }
});


module.exports = router;

