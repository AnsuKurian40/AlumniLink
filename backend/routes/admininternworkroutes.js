const express = require("express"); 
const router = express.Router(); 
const Internship = require("../models/Internship"); 
const Workshop = require("../models/Workshop"); 
const Referral = require("../models/Referral"); 
 
// GET all internships 
router.get("/internships", async (req, res) => { 
    try { 
        // Fetch all internships with the "postedBy" field populated (alumni name) 
        const internships = await Internship.find().populate("postedBy", "name"); 
 
        const internshipCountByAlumni = {}; 
 
        internships.forEach((internship) => { 
            const alumniName = internship.postedBy.name; 
            if (!internshipCountByAlumni[alumniName]) { 
                internshipCountByAlumni[alumniName] = 0; 
            } 
            internshipCountByAlumni[alumniName] += 1; 
        }); 
 
        // Fetch referral request counts for each internship 
        const internshipsWithCounts = await Promise.all(internships.map(async (internship) => { 
            const referralCount = await Referral.countDocuments({ internship: internship._id }); 
            const acceptedReferralCount = await Referral.countDocuments({ internship: internship._id, 
status: "Accepted" }); 
            return { ...internship.toObject(), referralCount, acceptedReferralCount, 
internshipCountByAlumni: internshipCountByAlumni[internship.postedBy.name], }; 
        })); 
 
        res.json(internshipsWithCounts); 
    } catch (error) { 
        console.error("Error fetching internships:", error); 
        res.status(500).json({ message: "Error fetching internships" }); 
    } 
}); 
router.get("/referrals/:internshipId", async (req, res) => { 
    try { 
        const { internshipId } = req.params; 
        const referrals = await Referral.find({ internship: internshipId }) 
            .populate("student", "name email") // Populate student name 
            .select("student status") 
 
        // Format response to include student names and request status 
        const formattedReferrals = referrals.map((referral) => ({ 
            _id: referral._id, 
            studentName: referral.student.name, 
            status: referral.status, // e.g., "Pending", "Accepted", "Rejected" 
        })); 
 
        res.json(formattedReferrals); 
    } catch (error) { 
        console.error("Error fetching referral requests:", error); 
        res.status(500).json({ message: "Error fetching referral requests" }); 
    } 
}); 
 
// GET all workshops 
 
router.get("/workshops", async (req, res) => { 
    try { 
        // Fetch all workshops with "postedBy" populated 
        const workshops = await Workshop.find().populate("postedBy", "name"); 
 
        // Count workshops per alumni 
        const workshopCountByAlumni = {}; 
        workshops.forEach((workshop) => { 
            const alumniName = workshop.postedBy.name; 
            if (!workshopCountByAlumni[alumniName]) { 
                workshopCountByAlumni[alumniName] = 0; 
            } 
            workshopCountByAlumni[alumniName] += 1; 
        }); 
 
        // Append workshop count to response 
        const workshopsWithCounts = workshops.map((workshop) => ({ 
            ...workshop.toObject(), 
            workshopCountByAlumni: workshopCountByAlumni[workshop.postedBy.name], 
        })); 
 
        res.json(workshopsWithCounts); 
    } catch (error) { 
        console.error("Error fetching workshops:", error); 
        res.status(500).json({ message: "Error fetching workshops" }); 
    } 
});
 
// Export the router to use in the main app file 
module.exports = router;