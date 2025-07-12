const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: String,
  description: String, // Detailed report content
  category: {
    type: String,
    enum: ["Workshops", "Alumni Meetups", "Cultural Events", "Others"], // Categories for filtering
  },
  year: Number, // Year for grouping
  month: Number, // Month for filtering
  document: String, // Store image URL
  date: { type: Date, default: Date.now }, // Original event date
});

module.exports = mongoose.model("Report", ReportSchema);

