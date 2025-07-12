// models/Bookmark.js
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who bookmarked
  internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" }, // Bookmarked internship
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }, // Bookmarked workshop
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);


