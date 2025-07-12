const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Resource = require("../models/Resource");
const FundRequest = require("../models/FundRequest"); // Import FundRequest model

const router = express.Router();

//const fs = require("fs"); 
const uploadDir = path.join(__dirname, "../uploads"); 
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir, { recursive: true }); 
    console.log("   Created 'uploads' folder"); 
} 


// Set storage engine 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        const uploadPath = path.join(__dirname, "../uploads"); // Ensure correct folder 
        console.log("Upload Path:", uploadPath); // Debugging log 
        cb(null, uploadPath); 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); 
    } 
}); 
 
const upload = multer({ storage }); 
 
//    Basic Upload Route 
router.post("/", upload.single("file"), async (req, res) => { 
    try { 
        console.log("Received file:", req.file); 
        console.log("Received body:", req.body); 
 
        if (!req.file) { 
            console.log("  No file uploaded"); 
            return res.status(400).json({ message: "No file uploaded" }); 
        } 
 
        //    File path for local storage 
        // const fileUrl = http://localhost:5000/uploads/${req.file.filename}; 
        // const fileUrl = http://localhost:5000/uploads/${req.file.filename}; 
        const fileUrl = `/uploads/${req.file.filename}`;

        //    Check if metadata exists 
        const { title, description, uploadedBy } = req.body; 
        if (!title || !description) { 
            console.log("  Missing title or description"); 
            return res.status(400).json({ message: "Title and description are required" }); 
        } 
 
        //    Ensure uploadedBy is a string (or default to "Unknown") 
        const newResource = new Resource({ 
            title, 
            description, 
            fileUrl, 
            uploadedBy: uploadedBy || "Unknown" 
        }); 
 
        console.log("Saving to DB:", newResource); //    Debugging 
 
        await newResource.save(); //    This must execute 
        console.log("   Resource saved successfully!"); 
 
        res.status(201).json({ 
            success: true, 
            message: "Resource uploaded and saved successfully!", 
             fileUrl //    Full URL 
        }); 
 
    } catch (error) { 
        console.error("  Upload Error:", error); 
        res.status(500).json({ message: "Error uploading resource", error }); 
    } 
}); 
 
//    Fetch all resources 
router.get("/", async (req, res) => { 
    try { 
        const resources = await Resource.find(); 
        console.log("Fetched resources:", resources); //     Debugging log 
        res.json(resources); 
    } catch (error) { 
        console.error("  Error fetching resources:", error); 
        res.status(500).json({ message: "Error fetching resources" }); 
    } 
}); 



// // Ensure 'uploads/fund_requests' folder exists for storing fund request forms
// const fundRequestDir = path.join(__dirname, "../uploads/fund_requests");
// if (!fs.existsSync(fundRequestDir)) {
//     fs.mkdirSync(fundRequestDir, { recursive: true });
//     console.log("Created 'uploads/fund_requests' folder");
// }

// // Multer storage configuration for fund request uploads (only PDFs allowed)
// const fundRequestStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, fundRequestDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, "fund_request_" + Date.now() + path.extname(file.originalname));
//     }
// });

// // File filter to allow only PDFs
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "application/pdf") {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF files are allowed"), false);
//     }
// };

// const uploadFundRequest = multer({ storage: fundRequestStorage, fileFilter });

// // Route for uploading fund request forms
// router.post("/fund-request", uploadFundRequest.single("file"), async (req, res) => {
//     try {
//         console.log("Received fund request file:", req.file);

//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const { studentName, purpose, amount } = req.body;
//         if (!studentName || !purpose || !amount) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // Save the fund request with file path
//         const newFundRequest = new FundRequest({
//             studentName,
//             purpose,
//             amount,
//             approvedRequestForm: `/uploads/fund_requests/${req.file.filename}` // Store file path
//         });

//         await newFundRequest.save();

//         res.status(201).json({
//             success: true,
//             message: "Fund request submitted successfully!",
//             fileUrl: `/uploads/fund_requests/${req.file.filename}`
//         });

//     } catch (error) {
//         console.error("Upload Error:", error);
//         res.status(500).json({ message: "Error uploading fund request", error });
//     }
// });

module.exports = router;

