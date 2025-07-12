const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// ✅ Get all reports (with optional filtering)
router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }
    const reports = await Report.find(query);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
});

// ✅ Add a new report (Only for Alumni Incharge)
router.post("/", async (req, res) => {
  try {
    const { title, description, category, image, date } = req.body;
    const newReport = new Report({ title, description, category, image, date });
    await newReport.save();
    res.status(201).json({ message: "Report added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding report", error });
  }
});

module.exports = router;
