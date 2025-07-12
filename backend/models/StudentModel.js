const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admissionNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  yearOfAdmission: { type: Number, required: true },
  currentYear: { type: String, required: true },
  rollNumber: { type: String, required: true },
  ktuId: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  idCard: { type: String },
  profilePicture: {
    type: String,
    default: '/defaults/profile-picture.png' // Default image path
  },
  resume: { type: String }, // Added resume field
  linkedInProfile: { type: String }, // Added LinkedIn field
  isVerified: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now } // Track when profile was last updated
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Student', studentSchema);