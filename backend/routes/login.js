const express = require("express"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const User = require("../models/User"); // Import User model 
const router = express.Router(); 
require("dotenv").config(); // Load environment variables 
 
// Login Route 
//const bcrypt = require("bcryptjs"); // Ensure bcrypt is imported 
 
router.post("/login", async (req, res) => { 
  try { 
    const { email, password, role} = req.body; 
 
    console.log("Login Attempt for Email:", email); 
    console.log("Entered Password:", password); 
 
    const user = await User.findOne({ email }); 
    if (!user) { 
      console.log("  User Not Found"); 
      return res.status(400).json({ message: "Invalid email or password" }); 
    } 
 
    console.log("   User Found in DB:", user); 
    console.log("     Stored Hashed Password:", user.password); 

    if (user.role !== role) { 
      console.log("  Role Mismatch! User role:", user.role, "Selected role:", role);
      return res.status(400).json({ message: `Incorrect role selected. You are registered as ${user.role}` }); 
    }
 
    // Check if bcrypt.compare() is working correctly 
    bcrypt.compare(password, user.password, (err, isMatch) => { 
      if (err) { 
        console.error("  bcrypt.compare() Error:", err); 
        return res.status(500).json({ message: "Server error" }); 
      } 
      console.log("     bcrypt.compare() Result:", isMatch); 
 
      if (!isMatch) { 
        console.log("  Password Mismatch!"); 
        return res.status(400).json({ message: "Invalid email or password" }); 
      } 
 
      console.log("   Password Matched!"); 

      // const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
         

      const token = jwt.sign(
        {
          userId: user._id.toString(), // Convert ObjectId to string
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expiration (optional)
      );
  



      console.log("🆔 Sending Response: userId =", user._id, "role =", user.role, "name =", user.name);
      console.log("🔹 Generated Token:", token);

      res.status(200).json({ 
          message: "Login successful",
          token, 
          role: user.role, 
          name: user.name,
          userId: user._id // Include userId in response
      });
      

    }); 
    
 
  } catch (error) { 
    console.error("  Login Error:", error); 
    res.status(500).json({ message: "Server error" }); 
  } 
}); 
 
module.exports = router;

