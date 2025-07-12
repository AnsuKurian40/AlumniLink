const express = require("express"); 
const multer = require("multer"); 
const FundRequest = require("../models/FundRequest"); 
const Contribution = require("../models/Contribution"); 
const mongoose = require("mongoose"); 
const ActivityLog = require("../models/ActivityLog"); 
 
const router = express.Router(); 
 
//   Setup Multer for File Uploads 
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        cb(null, "uploads/"); 
    }, 
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "-" + file.originalname); 
    } 
}); 
const upload = multer({ storage }); 
 
//    1. Student submits a fund request 
router.post("/fundrequests", async (req, res) => { 
    console.log("     Fund Request API Hit!"); 
    console.log("  Request Body:", req.body); 
 
    try { 
        const { studentId, purpose, amount, description } = req.body; 
 
        // Debug: Ensure required fields are received 
        if (!studentId || !purpose || !amount || !description) { 
            console.log("  Missing required fields:", { studentId, purpose, amount, description }); 
            return res.status(400).json({ error: "All fields are required" }); 
        } 
 
        // Debug: Check if studentId is a valid ObjectId 
        if (!mongoose.Types.ObjectId.isValid(studentId)) { 
            console.log("  Invalid ObjectId format:", studentId); 
            return res.status(400).json({ error: "Invalid student ID format" }); 
        } 
 
        const studentObjectId = new mongoose.Types.ObjectId(studentId); 
        console.log("   Converted studentId to ObjectId:", studentObjectId); 
 
        const fundRequest = new FundRequest({ 
            studentId: studentObjectId, 
            purpose, 
            amount, 
            description, 
            remainingAmount: amount, 
        }); 
 
        await fundRequest.save(); 
        await ActivityLog.create({ 
            user: new mongoose.Types.ObjectId(studentId), //    Correct: Storing as ObjectId 
            action: `Submitted a fund request for ${purpose} - Amount: ${amount}`, 
            createdAt: new Date(), 
        }); 
         
        console.log("   Fund Request Saved Successfully:", fundRequest); 
 
        res.status(201).json({ message: "Fund request submitted", fundRequest }); 
    } catch (error) { 
        console.error("  Error submitting request:", error); 
        res.status(500).json({ error: "Error submitting request", details: error.message }); 
    } 
}); 
 
//    2. Get student's fund requests 
router.get("/fundrequests/student/:studentId", async (req, res) => { 
    console.log("     Fund Requests API Called for Student:", req.params.studentId); 
 
    try { 
        // Debugging: Print raw studentId 
        console.log("    Received Student ID:", req.params.studentId); 
 
        // Ensure valid ObjectId 
        const studentObjectId = new mongoose.Types.ObjectId(req.params.studentId); 
        console.log("   Converted to ObjectId:", studentObjectId); 
 
        // Fetch requests 
        const requests = await FundRequest.find({ studentId: studentObjectId }); 
 
        console.log("  Found Requests:", requests); 
 
        res.status(200).json(requests); 
    } catch (error) { 
        console.error("  Error fetching fund requests:", error); 
        res.status(500).json({ error: "Error fetching requests", details: error.message }); 
    } 
}); 
 
//    3. Get all pending fund requests (for admin) 
router.get("/fundrequests", async (req, res) => { 
    try { 
        const requests = await FundRequest.find(); // Get all fund requests 
        res.status(200).json(requests); 
    } catch (error) { 
        console.error("Error fetching all fund requests:", error); 
        res.status(500).json({ error: "Error fetching requests" }); 
    } 
}); 
 
//    4. Admin approves or rejects requests 
//    4. Admin approves or rejects requests + Adds UPI ID 
router.put("/fundrequests/:id", async (req, res) => { 
    try { 
        const { status, upiId } = req.body; 
        let updateData = { status }; 
 
        if (status === "Approved" && upiId) { 
            updateData.upiId = upiId; // Store UPI ID only if approved 
        } 
 
        const updatedRequest = await FundRequest.findByIdAndUpdate( 
            req.params.id, 
            updateData, 
            { new: true } 
        ); 
 
        if (!updatedRequest) { 
            return res.status(404).json({ error: "Fund request not found" }); 
        } 
 
        res.status(200).json(updatedRequest); 
    } catch (error) { 
        console.error("  Error updating status:", error); 
        res.status(500).json({ error: "Error updating status" }); 
    } 
}); 
 
//    5. Get all approved requests for alumni 
//    5. Get all approved requests for alumni 
//    5. Get all approved requests for alumni (Now includes UPI ID) 
router.get("/fundrequests/approved", async (req, res) => { 
    try { 
        const approvedRequests = await FundRequest.find({ status: "Approved" }) 
            .select("studentId purpose amount remainingAmount upiId"); 
 
        res.status(200).json(approvedRequests); 
    } catch (error) { 
        res.status(500).json({ error: "Error fetching approved requests" }); 
    } 
}); 
 
//    6. Alumni contribute to fund requests 
//    6. Alumni contribute to fund requests (Now prevents over-contribution) 
router.post("/contributions", upload.single("paymentScreenshot"), async (req, res) => { 
    try { 
        console.log("     Contribution API Hit!"); 
        console.log("  Request Body:", req.body); 
        console.log("  File Received:", req.file); 
 
        const { requestId, alumniId, amount } = req.body; 
        const paymentScreenshot = req.file ? req.file.path : null; 
 
        if (!requestId || !alumniId || !amount) { 
            return res.status(400).json({ error: "All fields are required" }); 
        } 
 
        if (!mongoose.Types.ObjectId.isValid(requestId) || 
!mongoose.Types.ObjectId.isValid(alumniId)) { 
            return res.status(400).json({ error: "Invalid request ID or alumni ID" }); 
        } 
 
        const fundRequest = await FundRequest.findById(requestId); 
        if (!fundRequest) { 
            return res.status(404).json({ error: "Fund request not found" }); 
        } 
 
        //    Prevent Over-Contribution 
        if (amount > fundRequest.remainingAmount) { 
            return res.status(400).json({ error: "Contribution exceeds the required amount" }); 
        } 
 
        const contribution = new Contribution({ requestId, alumniId, amount, paymentScreenshot }); 
        await contribution.save(); 
 
        fundRequest.remainingAmount -= amount; 
        await fundRequest.save(); 
 
        await ActivityLog.create({ 
            user: new mongoose.Types.ObjectId(alumniId), 
            action: `Contributed ${amount} to fund request (${fundRequest.purpose})`, 
            createdAt: new Date(), 
        }); 
 
        console.log("   Contribution Saved Successfully:", contribution); 
        res.status(201).json({ message: "Contribution recorded", contribution }); 
 
    } catch (error) { 
        console.error("  Error saving contribution:", error); 
        res.status(500).json({ error: "Error saving contribution" }); 
    } 
}); 
 
//    7. Get all contributions (for admin) 
router.get("/contributions", async (req, res) => { 
    try { 
        const contributions = await Contribution.find() 
            .populate("alumniId", "name")  // Get alumni name 
            .populate("requestId", "purpose amount remainingAmount"); // Get fund request details 
 
        res.json(contributions); 
    } catch (error) { 
        console.error("Error fetching contributions:", error); 
        res.status(500).json({ message: "Server error" }); 
    } 
}); 
 
// Get past contributions by a specific alumni 
router.get("/past-contributions/:alumniId", async (req, res) => { 
    try { 
        const { alumniId } = req.params; 
 
        // Convert alumniId to ObjectId 
        const objectId = new mongoose.Types.ObjectId(alumniId); // Convert to ObjectId 
        const contributions = await Contribution.find({ alumniId: objectId }).populate("requestId"); 
 
        if (!contributions.length) { 
            return res.status(404).json({ message: "No past contributions found." }); 
        } 
 
        res.json(contributions); 
    } catch (error) { 
        console.error("Error fetching past contributions:", error); 
        res.status(500).json({ message: "Internal server error." }); 
    } 
}); 
 
 
 
router.post("/submit-fund-request", async (req, res) => { 
    try { 
        const { studentName, purpose, amount } = req.body; 
 
        const newRequest = new FundRequest({ studentName, purpose, amount, status: "Pending" }); 
        await newRequest.save(); 
 
        // Log the action in ActivityLog 
        await ActivityLog.create({ 
            user: studentName, 
            action: `Submitted a fund request for ${purpose} (${amount} USD)` 
        }); 
 
        res.status(201).json({ message: "Fund request submitted successfully" }); 
    } catch (error) { 
        res.status(500).json({ message: "Server error", error: error.message }); 
    } 
}); 
 
module.exports = router; 
 
 
 
 
 
