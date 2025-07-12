const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUserModel");

// Route to fetch all admin users
router.get("/users", async (req, res) => {
    try {
        const users = await AdminUser.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Route to add a new admin user
router.post("/add-user", async (req, res) => {
    try {
        const { admissionNumber, name, email, role } = req.body;

        // Check if the user already exists
        const existingUser = await AdminUser.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new AdminUser({ admissionNumber, name, email, role });
        await newUser.save();

        res.status(201).json({ message: "User added successfully", newUser });
    } catch (error) {
        res.status(500).json({ message: "Error adding user" });
    }
});


// Route to update an admin user
router.put("/edit-user/:id", async (req, res) => {
    try {
        const { name, email, role } = req.body; // Include role
        const updatedUser = await AdminUser.findByIdAndUpdate(
            req.params.id,
            { name, email, role }, // Ensure role is updated
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});


// Route to delete an admin user
router.delete("/delete-user/:id", async (req, res) => {
    try {
        const deletedUser = await AdminUser.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});


module.exports = router;
