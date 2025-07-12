const express = require("express"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const Admin = require("../models/Admin"); 
const FundRequest = require("../models/FundRequest"); // Assuming you have this model 
const Report = require("../models/Report"); 
const User = require("../models/User");  // Adjust path if needed 
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware"); 
const Project = require("../models/Project"); 
const ActivityLog = require("../models/ActivityLog"); 
//const User = require("../models/User");  // Add this line 
 
const router = express.Router(); 
 
// Admin Login 
router.post("/admin-login", async (req, res) => { 
  const { email, password } = req.body; 
 
  try { 
    const admin = await Admin.findOne({ email }); 
    if (!admin) { 
 
        console.log("Admin not found in database"); 
        return res.status(400).json({ message: "Admin not found" }); 
    } 
 
    console.log("Admin found:", admin); 
 
    const isMatch = await bcrypt.compare(password, admin.password); 
    console.log("Password match result:", isMatch); 
 
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" }); 
 
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
 
    res.json({ token }); 
  } catch (error) { 
    console.error("Error during login:", error); 
    res.status(500).json({ message: "Server error" }); 
  } 
}); 
 
router.get("/admin-dashboard", async (req, res) => { 
  try { 
      const totalUsers = await User.countDocuments(); 
      const totalReports = await Report.countDocuments(); 
      const totalFundRequests = await FundRequest.countDocuments(); 
      const pendingFunds = await FundRequest.countDocuments({ status: "Pending" }); 
      const approvedFunds = await FundRequest.countDocuments({ status: "Approved" }); 
      const totalProjects = await Project.countDocuments(); 
 
      //    Fetch latest 5 recent activities 
      const recentActivities = await ActivityLog.find() 
          .sort({ createdAt: -1 })  // Sort by newest first 
          .limit(5) // Limit to 5 records 
          .populate("user", "name"); 
 
      res.json({ 
          totalUsers, 
          totalReports, 
          totalFundRequests, 
          pendingFunds, 
          approvedFunds, 
          totalProjects, 
          recentActivities  //    Now included in response 
      }); 
  } catch (error) { 
      console.error("Error fetching admin dashboard data:", error); 
      res.status(500).json({ message: "Server Error" }); 
  } 
}); 
 
 
 
module.exports = router; 