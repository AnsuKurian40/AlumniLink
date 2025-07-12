const express = require("express"); 
const Project = require("../models/Project"); 
const Application = require("../models/Application"); 
const { sendNotificationEmail } = require("../utils/email"); 
const router = express.Router(); 
const ActivityLog = require("../models/ActivityLog"); 
 
//   Alumni Post a Project 
router.post("/projects", async (req, res) => { 
  console.log("Received POST request to /api/projects"); 
  console.log("Received Data:", req.body) 
 
  const { userId, title, description, requiredSkills, expectedContribution, collaborationMode, status } 
= req.body; 
 
  if (!userId || !title || !description || !requiredSkills || !expectedContribution || 
!collaborationMode || !status) { 
    return res.status(400).json({ error: "All fields including alumniId are required." }); 
  } 
 
  try { 
    const newProject = new Project({ ...req.body, userId }); 
    await newProject.save(); 
 
    await ActivityLog.create({ 
      user: userId,  // Store only the ObjectId, not a string 
      action: `Alumni posted a new project: ${title}`, 
      createdAt: new Date(), 
    }); 
     
 
    res.status(201).json(newProject); 
  } catch (error) { 
    console.error("Error posting project:", error); 
    console.log("Failed to post project. Check the console for details."); 
 
  } 
}); 
 
router.post("/applications", async (req, res) => { 
  try { 
    const { studentId, projectId, introduction, interestReason, skills, portfolioLink } = req.body; 
 
    // Find the project to get the alumniId 
    const project = await Project.findById(projectId); 
    if (!project) { 
      return res.status(404).json({ error: "Project not found" }); 
    } 
 
    const alumniId = project.userId; // userId in Project schema refers to the alumni who posted it 
 
    const existingApplication = await Application.findOne({ studentId, projectId }); 
    if (existingApplication) { 
      return res.status(400).json({ error: "You have already applied to this project." }); 
    } 
 
    // Create a new application with alumniId included 
    const newApplication = new Application({ 
      studentId, 
      projectId, 
      alumniId,  // Store the alumni's ID for future reference 
      introduction, 
      interestReason, 
      skills, 
      portfolioLink, 
      status: "Pending", // Default status 
    }); 
 
    await newApplication.save(); 
 
    try { 
      await ActivityLog.create({ 
         user: studentId, 
         action: `Applied for project: ${project.title}`, 
         createdAt: new Date(), 
      }); 
   } catch (logError) { 
      console.error("Error saving activity log:", logError); 
   } 
    
 
 
    res.status(201).json({ message: "Application submitted successfully", newApplication }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}); 
 
//   Alumni View Applications for Their Projects 
//    GET route to fetch projects (All for students, specific for alumni) 
router.get("/projects", async (req, res) => { 
  try { 
    const { userId, role } = req.query; 
 
    let query = {}; 
    if (role === "alumni") { 
      query.userId = userId; // Alumni see only their projects 
    } 
    // Students will see all projects (no filtering applied) 
 
    const projects = await Project.find(query).lean(); 
 
    // Fetch application counts for each project 
    const projectIds = projects.map((project) => project._id); 
    const applications = await Application.find({ projectId: { $in: projectIds } }); 
 
    const projectWithCounts = projects.map((project) => { 
      const applicationCount = applications.filter((app) => app.projectId.equals(project._id)).length; 
      return { ...project, applicationCount }; 
    }); 
 
    res.json(projectWithCounts); 
  } catch (error) { 
    console.error("Error fetching projects:", error); 
    res.status(500).json({ error: "Failed to fetch projects" }); 
  } 
}); 
 
router.get("/projects/:userId", async (req, res) => { 
  const { userId } = req.params; // Get userId from URL 
 
  try { 
    const projects = await Project.find({ userId }); // Fetch only projects posted by this user 
    res.status(200).json(projects); 
  } catch (error) { 
    console.error("Error fetching projects:", error); 
    res.status(500).json({ error: "Failed to fetch projects" }); 
  } 
}); 
 
router.get("/applications/:alumniId", async (req, res) => { 
  try { 
    const { alumniId } = req.params; 
    console.log("Fetching applications for alumniId:", alumniId); 
 
    // Fetch applications and populate student details from User collection 
    const applications = await Application.find({ alumniId }) 
      .populate({ 
        path: "studentId", 
        select: "userId name email", //    Ensure userId is referenced correctly 
      }) 
      .populate("projectId", "title"); //    Populate project title 
 
    console.log("Applications Found:", applications); 
 
    if (!applications || applications.length === 0) { 
      return res.json({ message: "No applications found for this alumni." }); 
    } 
 
    res.json(applications); 
  } catch (error) { 
    console.error("Error fetching applications:", error); 
    res.status(500).json({ error: error.message }); 
  } 
}); 
 
//   Alumni Accept/Reject Applications 
//   Alumni Accept/Reject Applications 
router.put("/applications/:applicationId", async (req, res) => { 
  try { 
    const { applicationId } = req.params; 
    const { status, rejectReason } = req.body; 
 
    if (!["Accepted", "Rejected"].includes(status)) { 
      return res.status(400).json({ error: "Invalid status" }); 
    } 
 
    const updateFields = { status }; 
    if (status === "Rejected") { 
      updateFields.rejectReason = rejectReason || "No reason provided"; 
    } 
 
    const updatedApplication = await Application.findByIdAndUpdate( 
      applicationId, 
      updateFields, 
      { new: true } 
    ).populate("studentId", "email name") //    Fetch student's email and name 
    .populate("projectId", "title"); //    Fetch project title 
 
    if (!updatedApplication) { 
      return res.status(404).json({ error: "Application not found" }); 
    } 
 
    //    Fetch student details for email notification 
    const studentEmail = updatedApplication.studentId.email; 
    const studentName = updatedApplication.studentId.name; 
    const projectTitle = updatedApplication.projectId.title; 
 
    //    Prepare Email Subject & Message 
    const subject = `Your Application for ${projectTitle} has been ${status}`; 
    let message = `Dear ${studentName},\n\n`; 
    message += `Your application for the project **"${projectTitle}"** has been **${status}**.\n`; 
 
    if (status === "Accepted") { 
      message += `              Congratulations! You have been accepted for this project.\n\n`; 
    } else { 
      message += `  Unfortunately, your application has been rejected.\n`; 
      message += `Reason: ${updateFields.rejectReason}\n\n`; 
    } 
 
    message += `Best regards,\nAlumniLink Team`; 
 
    //    Send Email Notification 
    await sendNotificationEmail(studentEmail, subject, message); 
 
    await ActivityLog.create({ 
      user: `Alumni ID: ${updatedApplication.alumniId}`, 
      action: `${status} application for project: ${projectTitle}`, 
      createdAt: new Date(), 
    }); 
 
 
    res.json({ message: "Application updated successfully and email sent", updatedApplication }); 
  } catch (error) { 
    console.error("Error updating application and sending email:", error); 
    res.status(500).json({ error: "Failed to update application and send email" }); 
  } 
}); 
 
     
//    Get all applications of a specific student 
router.get("/student-applications/:studentId", async (req, res) => { 
  try { 
    const { studentId } = req.params; 
    const applications = await Application.find({ studentId }).populate("projectId", "title"); 
 
    if (!applications.length) { 
      return res.json([]); 
    } 
 
    // Format response with project title and status 
    const formattedApplications = applications.map((app) => ({ 
      _id: app._id, 
      projectId: app.projectId._id, 
      projectTitle: app.projectId.title, 
      status: app.status, 
      rejectReason: app.rejectReason || "", // Show reason only if rejected 
    })); 
 
    res.json(formattedApplications); 
  } catch (error) { 
    console.error("Error fetching student applications:", error); 
    res.status(500).json({ error: "Failed to fetch applications" }); 
  } 
}); 
 
router.post("/post-project", async (req, res) => { 
  try { 
      const { alumniName, title } = req.body; 
 
      const newProject = new Project({ alumniName, title }); 
      await newProject.save(); 
 
      // Log the action in ActivityLog 
      await ActivityLog.create({ 
          user: alumniName, 
          action: `Posted a new project: ${title}` 
      }); 
 
      res.status(201).json({ message: "Project posted successfully" }); 
  } catch (error) { 
      res.status(500).json({ message: "Server error", error: error.message }); 
  } 
}); 
 
module.exports = router;