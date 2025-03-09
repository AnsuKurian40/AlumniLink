const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const uploadRoutes = require("./routes/upload");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const resourceRoutes = require("./routes/resources");
const downloadRoutes = require("./routes/download");


const reviewRoutes = require("./routes/reviewRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Use Routes
app.use("/api/upload", uploadRoutes);
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api/resources", resourceRoutes);
app.use("/", downloadRoutes);

app.use("/api/reviews", reviewRoutes);

// ✅ Ensure `uploads/` folder exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Created 'uploads' folder");
}

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/alumnilink", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
