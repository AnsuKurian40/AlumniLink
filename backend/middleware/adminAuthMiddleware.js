const jwt = require("jsonwebtoken");
const AdminUser = require("../models/Admin");
require("dotenv").config(); // Ensure environment variables are loaded

const adminAuthMiddleware = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    // Check if Authorization header exists and starts with "Bearer "
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is missing or malformed" });
    }

    // Extract token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    console.log("Extracted Token:", token);

    // Ensure JWT secret is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    
    // Find the admin user by ID from the decoded token
    const admin = await AdminUser.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }

    // Attach admin details to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminAuthMiddleware;

