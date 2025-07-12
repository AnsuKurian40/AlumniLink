const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  introduction: { type: String, required: true },
  interestReason: { type: String, required: true },
  skills: { type: String, required: true },
  portfolioLink: { type: String },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true }, // Store the alumni who posted the project
  rejectReason: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);