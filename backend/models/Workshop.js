const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true }, // Name of the alumni organizing the workshop
  applicationLink: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId,
     ref: "User" }, // Reference to the alumni who posted the workshop
});

module.exports = mongoose.model("Workshop", workshopSchema);


