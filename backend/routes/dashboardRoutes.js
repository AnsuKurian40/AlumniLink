const express = require("express"); 
const router = express.Router(); 
const Internship = require("../models/Internship"); // Internship model 
const Workshop = require("../models/Workshop"); // Workshop model 
 
// Route to get all internships 
router.get("/api/internships/all", async (req, res) => { 
    try { 
        const internships = await Internship.find(); // Fetch all internships from DB 
        res.json(internships); 
    } catch (error) { 
        console.error("Error fetching internships:", error); 
        res.status(500).json({ message: "Server Error" }); 
    } 
}); 
 
// Route to get all workshops 
router.get("/api/workshops/all", async (req, res) => { 
    try { 
        const workshops = await Workshop.find(); // Fetch all workshops from DB 
        res.json(workshops); 
    } catch (error) { 
        console.error("Error fetching workshops:", error); 
        res.status(500).json({ message: "Server Error" }); 
    } 
}); 
 
module.exports = router; 
 
 
 
 
