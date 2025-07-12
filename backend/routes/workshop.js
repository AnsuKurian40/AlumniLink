const express = require("express");
const Workshop = require("../models/Workshop");
const router = express.Router();

// Fetch all workshops
router.get("/all", async (req, res) => {
  try {
    const workshops = await Workshop.find().populate("postedBy", "name");
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workshops", error: err });
  }
});

// Add a new workshop (for alumni)
router.post("/add", async (req, res) => {
  const { title, description, date, duration, location, organizer,applicationLink, postedBy } = req.body;

  try {
    const newWorkshop = new Workshop({
      title,
      description,
      date,
      duration,
      location,
      organizer,
      applicationLink,
      postedBy,
    });
    await newWorkshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(500).json({ message: "Error adding workshop", error: err });
  }
});

// Get workshop details by ID
router.get("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate("postedBy", "name");
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    res.json(workshop);
  } catch (err) {
    console.error("Error fetching workshop details:", err);
    res.status(500).json({ message: "Failed to fetch workshop details" });
  }
});

module.exports = router;
