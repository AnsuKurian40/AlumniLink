const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Name or ID of the user who performed the action
    action: { type: String, required: true }, // Description of the action
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);