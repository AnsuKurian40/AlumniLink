const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Internship",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String,
    required: true,
    default: '/referral-resumes/default-resume.pdf'
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },
  rejectReason: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Improved population handling for modern Mongoose
referralSchema.post('find', async function(docs) {
  if (!docs || docs.length === 0) return;
  
  try {
    await Promise.all(docs.map(async doc => {
      try {
        // Modern Mongoose population (no execPopulate needed)
        await doc.populate([
          { 
            path: 'student', 
            select: 'name email',
            model: 'User'
          },
          { 
            path: 'alumni', 
            select: 'name email',
            model: 'User'
          },
          { 
            path: 'internship', 
            select: 'title company position postedBy',
            model: 'Internship',
            populate: {
              path: 'postedBy',
              select: 'name email',
              model: 'User'
            }
          }
        ]);
      } catch (populateErr) {
        console.error('Population error for referral:', {
          referralId: doc._id,
          error: populateErr.message,
          stack: process.env.NODE_ENV === 'development' ? populateErr.stack : undefined
        });
        // Optionally attach error to document for frontend handling
        doc.populateError = populateErr.message;
      }
    }));
  } catch (err) {
    console.error('Global population error:', {
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Virtuals for easier frontend access
referralSchema.virtual('studentName').get(function() {
  return this.student?.name || 'Unknown Student';
});

referralSchema.virtual('alumniName').get(function() {
  return this.alumni?.name || 'Unknown Alumni';
});

referralSchema.virtual('internshipTitle').get(function() {
  return this.internship?.title || this.internship?.position || 'Unknown Position';
});

referralSchema.virtual('companyName').get(function() {
  return this.internship?.company || 'Unknown Company';
});

// Add indexes for better query performance
referralSchema.index({ student: 1, status: 1 });
referralSchema.index({ alumni: 1, status: 1 });
referralSchema.index({ internship: 1 });
referralSchema.index({ student: 1, internship: 1 }, { unique: false });

module.exports = mongoose.model("Referral", referralSchema);