const express = require("express"); 
const router = express.Router(); 
const Question = require("../models/Question"); 
const verifyToken = require("../middleware/auth"); 
const User = require("../models/User"); 
 
//   Student: Ask a Question 
router.post("/ask", verifyToken, async (req, res) => { 
  try { 
    console.log("    Received request:", req.body); 
    console.log("    User from token:", req.user); 
 
    const { question } = req.body; 
 
    if (!question) { 
      return res.status(400).json({ message: "Question is required" }); 
    } 
 
    if (!req.user || !req.user.id || !req.user.name) { 
      return res.status(401).json({ message: "Unauthorized. User details missing." }); 
    } 
 
    const newQuestion = new Question({ 
      studentId: req.user.id, 
      studentName: req.user.name, 
      question, 
    }); 
 
    await newQuestion.save(); 
    console.log("   Question saved:", newQuestion); 
 
    res.status(201).json({ message: "Question posted successfully!", question: newQuestion }); 
  } catch (error) { 
    console.error("  Error in /ask route:", error); 
    res.status(500).json({ message: "Internal Server Error", error: error.message }); 
  } 
}); 
 
//   Alumni: Get All Unanswered Questions (Updated) 
router.get("/questions", verifyToken, async (req, res) => { 
  try { 
    if (req.user.role !== "Alumni") { 
      return res.status(403).json({ message: "Access Denied" }); 
    } 
 
    const questions = await Question.find({ 
      "answers.alumniId": { $ne: req.user.id }, // Exclude if alumni already answered 
      ignoredBy: { $ne: req.user.id } // Exclude if alumni ignored 
    }) 
    .select("studentName question answers") 
    .lean(); 
 
    res.json(questions); 
  } catch (error) { 
    console.error("  Error fetching questions:", error); 
    res.status(500).json({ message: "Server Error", error: error.message }); 
  } 
}); 
 
//   Alumni: Reply to a Question (Updated) 
router.post("/reply/:id", verifyToken, async (req, res) => { 
  try { 
    if (req.user.role !== "Alumni") { 
      return res.status(403).json({ message: "Access Denied" }); 
    } 
 
    const { id } = req.params; 
    const { answer } = req.body; 
 
    const alumni = await User.findById(req.user.id).select("name"); 
    if (!alumni) { 
      return res.status(404).json({ message: "Alumni not found" }); 
    } 
 
    const question = await Question.findById(id); 
    if (!question) return res.status(404).json({ message: "Question not found" }); 
 
    // Append new answer instead of replacing 
    question.answers.push({ 
      alumniId: req.user.id, 
      alumniName: alumni.name, 
      answer 
    }); 
 
    await question.save(); 
 
    res.json({ 
      message: "Reply sent successfully!", 
      question 
    }); 
  } catch (error) { 
    console.error("  Error in /reply route:", error); 
    res.status(500).json({ message: "Server Error", error: error.message }); 
  } 
}); 
 
//      Alumni: Ignore a Question 
router.post("/ignore/:id", verifyToken, async (req, res) => { 
  try { 
    if (req.user.role !== "Alumni") { 
      return res.status(403).json({ message: "Access Denied" }); 
    } 
 
    const question = await Question.findByIdAndUpdate( 
      req.params.id, 
      { $addToSet: { ignoredBy: req.user.id } }, // Add to ignoredBy array 
      { new: true } 
    ); 
 
    if (!question) { 
      return res.status(404).json({ message: "Question not found" }); 
    } 
 
    res.json({  
      message: "Question ignored successfully", 
      questionId: question._id 
    }); 
  } catch (error) { 
    console.error("  Error in /ignore route:", error); 
    res.status(500).json({ message: "Server Error", error: error.message }); 
  } 
}); 
 
//   Student: Get Their Own Questions and Answers 
router.get("/my-questions", verifyToken, async (req, res) => { 
  try { 
    const questions = await Question.find({ studentId: req.user.id }) 
      .select("studentName question answers createdAt") 
      .sort({ createdAt: -1 }); 
 
    res.json(questions); 
  } catch (error) { 
    console.error("  Error in /my-questions route:", error); 
    res.status(500).json({ message: "Server Error", error: error.message }); 
  } 
}); 
 
module.exports = router;