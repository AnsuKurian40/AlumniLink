const mongoose = require('mongoose');



const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  stipend: { type: String, required: true },
  duration: { type: String, required: true },
  applicationLink: { type: String, required: true },
  
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the internship
  createdAt: { type: Date, default: Date.now },
});












module.exports = mongoose.model('Internship', internshipSchema);


