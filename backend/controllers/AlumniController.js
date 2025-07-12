const Alumni = require("../models/AlumniModel");
const Student = require("../models/StudentModel"); // Import the Student model

// 🟢 Fetch Alumni Profile
const getAlumniProfile = async (req, res) => {
    try {
        // Find alumni by userId (assuming req.user.id is correct)
        const alumni = await Alumni.findById(req.user.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni profile not found" });
        }

        res.json(alumni);  // Send the alumni profile as JSON
    } catch (error) {
        console.error("Error fetching alumni profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🟢 Update Alumni Profile
const updateAlumniProfile = async (req, res) => {
    try {
        // Find alumni by userId (assuming req.user.id is correct)
        const alumni = await Alumni.findById(req.user.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni profile not found" });
        }

        // Update the alumni profile with the new data
        Object.assign(alumni, req.body);

        // Save the updated alumni profile to the database
        await alumni.save();

        res.json({ message: "Profile updated successfully", alumni });
    } catch (error) {
        console.error("Error updating alumni profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🟢 Fetch Student Profile
const getStudentProfile = async (req, res) => {
    try {
        // Find student by userId (assuming req.user.id is correct)
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        res.json(student);  // Send the student profile as JSON
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🟢 Update Student Profile
const updateStudentProfile = async (req, res) => {
    try {
        // Find student by userId (assuming req.user.id is correct)
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        // Update the student profile with the new data
        Object.assign(student, req.body);

        // Save the updated student profile to the database
        await student.save();

        res.json({ message: "Profile updated successfully", student });
    } catch (error) {
        console.error("Error updating student profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAlumniProfile,
    updateAlumniProfile,
    getStudentProfile,  // Export the new function for getting student profile
    updateStudentProfile // Export the new function for updating student profile
};

