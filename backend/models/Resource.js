const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
//   uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
uploadedBy: { type: String, required: false, default: "Unknown" },


createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);