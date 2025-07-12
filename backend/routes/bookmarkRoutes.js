
// routes/bookmarkRoutes.js
const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const authMiddleware = require("../middleware/authMiddleware");

// Bookmark an internship or workshop
router.post("/add", authMiddleware, async (req, res) => {
    try {
      const { internshipId, workshopId } = req.body;
      const userId = req.user.id;
      if (!internshipId && !workshopId) {
        return res.status(400).json({ message: "Internship ID or Workshop ID is required" });
      }
  
      const filter = { user: userId };
      if (internshipId) filter.internship = internshipId;
      if (workshopId) filter.workshop = workshopId;

      const existingBookmark = await Bookmark.findOne(filter);

  
      if (existingBookmark) {
        return res.status(400).json({ message: "Item already bookmarked" });
      }
  
      // Create a new bookmark
      const newBookmark = new Bookmark({
        user: userId,
        internship: internshipId,
        workshop: workshopId,
      });
      await newBookmark.save();
  
      res.status(201).json({ message: "Bookmark added successfully", bookmark: newBookmark });
    } catch (err) {
      res.status(500).json({ message: "Error adding bookmark", error: err });
    }
  });
// Remove a bookmark
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    const bookmarkId = req.params.id;
    const userId = req.user.id;

    // Check if the bookmark belongs to the user
    const bookmark = await Bookmark.findOne({ _id: bookmarkId, user: userId });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await Bookmark.findByIdAndDelete(bookmarkId);
    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing bookmark", error: err });
  }
});

// Fetch all bookmarks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all bookmarks for the user and populate internship/workshop details
    const bookmarks = await Bookmark.find({ user: userId })
      .populate("internship")
      .populate("workshop");

    res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookmarks", error: err });
  }
});

module.exports = router;

