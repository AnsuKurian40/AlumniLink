import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./AlumniPage.css";
const AlumniPage = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    expectedContribution: "",
    collaborationMode: "Online",
    deadline: "",
    status: "Open",
  });

  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole"); // Corrected to get userType
  
      if (!userId || !role) {
        console.error("User ID or Role not found. Please log in.");
        return;
      }
  
      let apiUrl = `http://localhost:5000/api/projects`;
      if (role.toLowerCase() === "alumni") {
        apiUrl += `?userId=${userId}&role=alumni`; // Filter projects only for alumni
      }
  
      const response = await axios.get(apiUrl);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error.response?.data || error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId") || ""; // Retrieve userId
  
    if (!userId) {
      alert("User ID not found! Please log in again.");
      return;
    }
  
    const projectData = {
      ...formData,
      requiredSkills: formData.requiredSkills
        ? formData.requiredSkills.split(",").map(skill => skill.trim())
        : [],
      userId, 
    };
  
    try {
      await axios.post("http://localhost:5000/api/projects", projectData);
      alert("Project posted successfully! 🎉");
      fetchProjects();
      setFormData({
        title: "",
        description: "",
        requiredSkills: "",
        expectedContribution: "",
        collaborationMode: "Online",
        deadline: "",
        status: "Open",
      });
    } catch (error) {
      console.error("Error posting project:", error.response?.data || error);
    }
  };

  
  return (
    <div className="alumni-page">
      <h2>Alumni Project Posting</h2>

      <div className="page-container">
        {/* Left Section (Form) */}
        <div className="form-container">
          <h3>Post a Project</h3>
          <form onSubmit={handleSubmit} className="project-form">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Required Skills (comma-separated)"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Expected Contribution"
              value={formData.expectedContribution}
              onChange={(e) => setFormData({ ...formData, expectedContribution: e.target.value })}
              required
            />
            <select
              value={formData.collaborationMode}
              onChange={(e) => setFormData({ ...formData, collaborationMode: e.target.value })}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <button type="submit">Post Project</button>
          </form>
        </div>

        {/* Right Section (Posted Projects) */}
        <div className="projects-container">
  <h3 className="projects-heading">Posted Projects</h3>
  {projects.length === 0 ? (
    <p>No projects posted yet.</p>
  ) : (
    <div className="projects-grid">
      {projects.map((project) => (
        <div key={project._id} className="project-card">
          <h4>{project.title}</h4>
          <p><strong>Applications:</strong> {project.applicationCount || 0}</p>
          <button onClick={() => navigate(`/alumni-page/project/${project._id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
  )}
</div>


      </div>
    </div>
  );
};

export default AlumniPage;


