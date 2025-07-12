import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentPage.css";

const StudentPage = ({ studentId }) => {
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState(new Set());
  const [applications, setApplications] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [applicationData, setApplicationData] = useState({
    introduction: "",
    interestReason: "",
    skills: "",
    portfolioLink: "",
    studentId: studentId || localStorage.getItem("userId"),
    projectId: "",
  });

  const userId = studentId || localStorage.getItem("userId");

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        console.log("Fetched Projects:", response.data);
        if (Array.isArray(response.data)) {
          const currentDate = new Date();
          const filteredProjects = response.data.filter(
            (project) => !project.deadline || new Date(project.deadline) >= currentDate
          );
          setProjects(filteredProjects);
        } else {
          console.error("Error: API response is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchStudentApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student-applications/${userId}`);
        setApplications(response.data);
        setAppliedProjects(new Set(response.data.map(app => app.projectId))); // Track applied projects
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchProjects();
    fetchStudentApplications();
  }, [userId]);

  const openPopup = (project) => {
    setSelectedProject(project);
    setApplicationData((prevData) => ({ ...prevData, projectId: project._id }));
    setShowPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedProject(null);
  };

  // Handle student applying for a project
  const handleApply = async () => {
    try {
      await axios.post("http://localhost:5000/api/applications", applicationData);
      alert("Application submitted successfully!");
      closePopup();
      setApplicationData({ introduction: "", interestReason: "", skills: "", portfolioLink: "", studentId, projectId: "" });
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div className="student-page">
      <h2>Available Projects</h2>
      <div className="projects-container">
        {/* Available Projects Section */}
        <div className="projects-list">
          <h3>Available Projects</h3>
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <p><b>Skills Required:</b> {project.requiredSkills.join(", ")}</p>
              <p><b>Mode:</b> {project.collaborationMode}</p>
              <p><b>Deadline:</b> {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No Deadline"}</p>

              <p><b>Status:</b> {project.status}</p>
              <button 
                onClick={() => openPopup(project)} 
                disabled={appliedProjects.has(project._id)}
                className={`apply-button ${appliedProjects.has(project._id) ? "disabled" : ""}`}
              >
                {appliedProjects.has(project._id) ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>

        {/* Applied Projects Section */}
        <div className="projects-list applied-projects">
          <h3>Your Applied Projects</h3>
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="project-card">
                <h4>{app.projectTitle}</h4>
                <p><b>Status:</b> {app.status}</p>
                {app.status === "Rejected" && (
                  <p><b>Reason:</b> {app.rejectReason ? app.rejectReason : "No reason provided"}</p>
                )}
              </div>
            ))
          ) : (
            <p>No applications submitted yet.</p>
          )}
        </div>
      </div>

      {/* Application Popup Modal */}
      {showPopup && selectedProject && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <h2>Apply for {selectedProject.title}</h2>
            <textarea placeholder="Your Introduction" value={applicationData.introduction}
              onChange={(e) => setApplicationData({ ...applicationData, introduction: e.target.value })} />
            <textarea placeholder="Why are you interested?" value={applicationData.interestReason}
              onChange={(e) => setApplicationData({ ...applicationData, interestReason: e.target.value })} />
            <input type="text" placeholder="Your Skills" value={applicationData.skills}
              onChange={(e) => setApplicationData({ ...applicationData, skills: e.target.value })} />
            <input type="text" placeholder="Portfolio Link (optional)" value={applicationData.portfolioLink}
              onChange={(e) => setApplicationData({ ...applicationData, portfolioLink: e.target.value })} />
            <br />
            <button onClick={handleApply}>Submit Application</button>
            <button onClick={closePopup} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
