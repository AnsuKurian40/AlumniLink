const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUserModel");

router.post("/check-user", async (req, res) => {
    try {
        const admissionNumber = String(req.body.admissionNumber).trim().toUpperCase();
        const name = req.body.name.trim().replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

        console.log("🔍 Checking user:", { admissionNumber, name });

        // Fetch user with strict admissionNumber match & case-insensitive name match
        const user = await AdminUser.findOne({
            admissionNumber: admissionNumber, // Strict match
            name: { $regex: new RegExp(`^${name}$`, "i") } // Case-insensitive match
        }).select("-password"); // Exclude password field

        if (user) {
            console.log("✅ User found:", user);
            return res.json({ success: true, message: "User exists in database" });
        } else {
            console.log("❌ User not found in records:", { admissionNumber, name });
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("❌ Error checking user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
