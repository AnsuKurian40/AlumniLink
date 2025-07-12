const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admissionNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  profilePicture: { 
    type: String,
    default: '/defaults/profile-picture.png' // Default image path
  },
  idProof: { type: String },
  industry: { type: String },
  yearsOfExperience: { type: Number },
  currentJobTitle: { type: String },
  company: { type: String },
  linkedInProfile: { type: String },
  isVerified: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now } // Track when profile was last updated
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Alumni', alumniSchema);