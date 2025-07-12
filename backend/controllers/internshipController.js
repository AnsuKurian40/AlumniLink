const Internship = require("../models/Internship");

// ✅ Alumni - Add Internship
const addInternship = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User ID from token:", req.user?.id);

    const { title, company, location, description, stipend, duration, category } = req.body;

    if (!title || !company || !location || !description || !duration || !category) {
      return res.status(400).json({ error: "All fields are required except stipend." });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    const newInternship = new Internship({
      title,
      company,
      location,
      description,
      stipend,
      duration,
      category,
      postedBy: req.user.id,
    });

    console.log("New Internship Object:", newInternship);

    await newInternship.save();
    console.log("Internship saved successfully.");
    res.status(201).json({ message: "Internship added successfully" });
  } catch (err) {
    console.error("Error adding internship:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Students - Get All Internships
const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find().populate("postedBy", "name company");
    res.status(200).json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Internship Details by ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate("postedBy", "name");
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch internship details" });
  }
};

module.exports = { addInternship, getAllInternships, getInternshipById };
