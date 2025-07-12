const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUsers");
const adminreportRoutes = require("./routes/adminReports");
const dashboardRoutes = require("./routes/dashboardRoutes");
const admininternworkRoutes = require("./routes/admininternworkroutes");
const adminmentorprojRoutes = require("./routes/adminmentorprojroutes");


const adminresourceRoutes = require("./routes/adminresources");


const uploadRoutes = require("./routes/upload");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const resourceRoutes = require("./routes/resources");
const downloadRoutes = require("./routes/download");
const reviewRoutes = require("./routes/reviewRoutes");
const internshipRoutes = require('./routes/internshipRoutes');
const workshopRoutes = require("./routes/workshop");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reportRoutes");
const fundRoutes = require("./routes/FundRoutes");
const mentorshipRoutes = require("./routes/mentorship");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const referralRoutes = require("./routes/referralRoutes");
const profileRoutes = require('./routes/profileRoutes');
const authRoutess = require('./routes/authRoutes');






const app = express();

// Debug log to check if the server receives requests
app.use((req, res, next) => {
    console.log(`📥 Request Received: ${req.method} ${req.url}`);
    console.log("🔹 Body:", req.body);
    next();
});










// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/referral-resumes', express.static(path.join(__dirname, 'referral_resumes')));
app.use('/uploads/profile-pictures', express.static(path.join(__dirname, 'uploads/profile-pictures')));

// Use Routes
app.use("/api/upload", uploadRoutes);
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", adminRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/reports", adminreportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/", downloadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/internships', internshipRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", fundRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/user", userRoutes);
app.use("/api", projectRoutes);
app.use("/api/referrals", referralRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', authRoutess); // This prefixes all authRoutes with '/api'

app.use("/api", admininternworkRoutes);
app.use("/api", adminmentorprojRoutes);
app.use("/", dashboardRoutes);

app.use("/api/admin/resources", adminresourceRoutes);



// Ensure uploads/ and subdirectories exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
const profilePicturesDir = path.join(uploadDir, "profile-pictures");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Created 'uploads' folder");
}

if (!fs.existsSync(profilePicturesDir)) {
    fs.mkdirSync(profilePicturesDir, { recursive: true });
    console.log("✅ Created 'uploads/profile-pictures' folder");
}

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/alumnilink", {})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));