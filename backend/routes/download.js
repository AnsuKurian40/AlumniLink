const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// ✅ Serve files correctly
router.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);
    console.log("📂 Checking file:", filePath);  // Debugging

    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        return res.status(404).json({ message: "File not found" });
    }

    // ✅ Ensure correct Content-Disposition for proper downloading
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("❌ File download error:", err);
            res.status(500).json({ message: "Failed to download file" });
        }
    });
});

module.exports = router;

