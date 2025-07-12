 
const Question = require('../models/Question'); // Import the Question model 
 
exports.postQuestion = async (req, res) => { 
    try { 
        const { question, userId } = req.body; 
 
        // Ensure question and userId are provided 
        if (!question || !userId) { 
            return res.status(400).json({ error: "Question and userId are required" }); 
        } 
 
        // Create and save the question 
        const newQuestion = new Question({ question, userId }); 
        await newQuestion.save(); 
 
        res.status(201).json({ message: "Question posted successfully!", question: newQuestion }); 
    } catch (error) { 
        console.error("Error posting question:", error); 
        res.status(500).json({ error: "Internal Server Error" }); 
    } 
}; 
