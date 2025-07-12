const express = require("express"); 
const multer = require("multer"); 
const mongoose = require("mongoose"); // Added missing import 
const FundRequest = require("../models/FundRequest"); 
const ActivityLog = require("../models/ActivityLog"); 
 
const router = express.Router(); 
 
// Multer storage for file uploads (approved form & payment proof) 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, "uploads/"); // Ensure this folder exists 
    }, 
    filename: (req, file, cb) => { 
        cb(null, Date.now() + "-" + file.originalname); 
    }, 
}); 
const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => { 
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']; 
        if (!allowedTypes.includes(file.mimetype)) { 
            return cb(new Error('Only image files are allowed'), false); 
        } 
        cb(null, true); 
    }, 
}); 
 
/** 
 * @route POST /api/fundrequests 
 * @desc Submit a new fund request (Students) 
 */ 
router.post("/", upload.single("approvedRequestForm"), async (req, res) => { 
    try { 
        const { studentId, purpose, amount } = req.body; 
        const approvedRequestForm = req.file ? req.file.path : null; 
        const amountNumber = Number(amount); 
 
        // Fixed validation condition 
        if (!studentId || !purpose || isNaN(amountNumber) || amountNumber <= 0) { 
            return res.status(400).json({ message: "Invalid request data" }); 
        } 
 
        const studentObjectId = new mongoose.Types.ObjectId(studentId); 
 
        const newRequest = new FundRequest({ 
            studentId: studentObjectId, 
            purpose, 
            amount: amountNumber, 
            remainingAmount: amountNumber, // Initially, the remaining amount is the full requested 

            approvedRequestForm, 
            status: "Pending", 
            contributions: [], 
        }); 
 
        await newRequest.save(); 
 
        await ActivityLog.create({ 
            user: `Student ID: ${studentId}`, 
            action: `Submitted a fund request for ${purpose} - Amount: ${amountNumber}`, 
            createdAt: new Date(), 
        }); 
 
         
        res.status(201).json({ message: "Fund request submitted successfully", fundRequest: 
newRequest }); 
    } catch (error) { 
        res.status(500).json({ message: "Error submitting fund request", details: error.message }); 
    } 
}); 
 
/** 
 * @route GET /api/fundrequests/student/:studentId 
 * @desc Get all fund requests made by a specific student 
 */ 
router.get("/student/:studentId", async (req, res) => { 
    try { 
        const studentId = req.params.studentId; 
        const requests = await FundRequest.find({ studentId }); 
 
        res.json(requests); 
    } catch (error) { 
        res.status(500).json({ message: "Error fetching student fund requests", details: error.message 
}); 
    } 
}); 
 
/** 
 * @route GET /api/fundrequests 
 * @desc Get all fund requests (For alumni to contribute) 
 */ 
router.get("/", async (req, res) => { 
    try { 
        const requests = await FundRequest.find(); 
        res.json(requests); 
    } catch (error) { 
        res.status(500).json({ message: "Error fetching fund requests", details: error.message }); 
    } 
}); 
 
/** 
 * @route POST /api/fundrequests/contribute/:requestId 
 * @desc Alumni contribute to a fund request 
 */ 
router.post("/contribute/:requestId", upload.single("paymentProof"), async (req, res) => { 
    try { 
        const requestId = req.params.requestId; 
        let { alumniId, alumniName, amount } = req.body; 
        const paymentProof = req.file ? req.file.path : null; 
        amount = Number(amount); 
 
        if (!alumniId || !alumniName || isNaN(amount) || amount <= 0) { 
            return res.status(400).json({ message: "Invalid contribution data" }); 
        } 
 
        const request = await FundRequest.findById(requestId); 
        if (!request) { 
            return res.status(404).json({ message: "Fund request not found" }); 
        } 
 
        // Prevent over-contribution 
        if (amount > request.remainingAmount) { 
            return res.status(400).json({ message: `Cannot contribute more than the remaining amount 
(${request.remainingAmount})` }); 
        } 
 
        // Update remaining amount 
        request.remainingAmount -= amount; 
 
        // Add alumni contribution 
        request.contributions.push({ alumniId, alumniName, amount, paymentProof }); 
        await request.save(); 
 
        res.json({ message: "Contribution added successfully", request }); 
    } catch (error) { 
        res.status(500).json({ message: "Error processing contribution", details: error.message }); 
    } 
}); 
 
/** 
 * @route GET /api/fundrequests/:requestId 
 * @desc Get a specific fund request 
 */ 
router.get("/:requestId", async (req, res) => { 
    try { 
        const requestId = req.params.requestId; 
        const request = await FundRequest.findById(requestId); 
        if (!request) { 
            return res.status(404).json({ message: "Fund request not found" }); 
        } 
        res.json(request); 
    } catch (error) { 
        res.status(500).json({ message: "Error fetching fund request", details: error.message }); 
    } 
}); 
 
module.exports = router;