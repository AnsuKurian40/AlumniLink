const express = require("express"); 
const router = express.Router(); 
const Project = require("../models/Project"); 
const Question = require("../models/Question"); 
const User = require("../models/User"); 
 
// Fetch all projects grouped by alumni name 
router.get("/projects", async (req, res) => { 
    try { 
        const projects = await Project.find().populate("userId", "name"); 
 
        const groupedProjects = projects.reduce((acc, project) => { 
            const alumniName = project.userId.name; 
            if (!acc[alumniName]) { 
                acc[alumniName] = []; 
            } 
            acc[alumniName].push(project); 
            return acc; 
        }, {}); 
 
        res.json(groupedProjects); 
    } catch (error) { 
        res.status(500).json({ error: "Error fetching projects" }); 
    } 
}); 
 
// Fetch all mentorship questions grouped by student name 
router.get("/mentorship", async (req, res) => { 
    try { 
        const questions = await Question.find(); 
 
        const groupedQuestions = questions.reduce((acc, question) => { 
            const studentName = question.studentName; 
            if (!acc[studentName]) { 
                acc[studentName] = []; 
            } 
 
            //    Ensure 'answers' is always an array (even if there's only one answer) 
            const formattedAnswers = Array.isArray(question.answers) ? question.answers : []; 
 
            acc[studentName].push({ 
                _id: question._id, 
                question: question.question, 
                answers: formattedAnswers.length > 0 ? formattedAnswers : [] // Ensure proper structure 
            }); 
 
            return acc; 
        }, {}); 
 
        res.json(groupedQuestions); 
    } catch (error) { 
        console.error("  Error fetching mentorship questions:", error); 
        res.status(500).json({ error: "Error fetching mentorship questions" }); 
    } 
}); 
 
// DELETE a mentorship question by ID 
router.delete("/mentorship/:id", async (req, res) => { 
    try { 
        const { id } = req.params; 
 
        // Find and delete question 
        const deletedQuestion = await Question.findByIdAndDelete(id); 
 
        if (!deletedQuestion) { 
            return res.status(404).json({ message: "  Question not found" }); 
        } 
 
        res.status(200).json({ message: "   Question deleted successfully" }); 
    } catch (error) { 
        console.error("  Error deleting question:", error); 
        res.status(500).json({ message: "  Server error" }); 
    } 
}); 
 
module.exports = router;