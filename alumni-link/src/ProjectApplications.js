 
import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import { useParams } from "react-router-dom"; 
 
const ProjectApplications = () => { 
  const { projectId } = useParams(); 
  console.log("Received projectId:", projectId); 
  const [applications, setApplications] = useState([]); 
  const [selectedApplication, setSelectedApplication] = useState(null); 
  const [showRejectReason, setShowRejectReason] = useState(false); 
  const [rejectReason, setRejectReason] = useState(""); 
 
  useEffect(() => { 
    fetchApplications(); 
  }, []); 
 
  const handleViewDetails = (application) => { 
    console.log("Application Details:", application); // Debugging log 
    setSelectedApplication(application); //    Opens the modal with details 
    setShowRejectReason(false); //    Reset rejection UI when opening modal 
    setRejectReason(""); //    Reset the reason input 
  }; 
 
   
  const fetchApplications = async () => { 
    const alumniId = localStorage.getItem("userId"); //    Ensure correct ID is used 
   
    if (!alumniId) { 
      console.error("Alumni ID not found in localStorage!"); 
      return; 
    } 
   
    try { 
      const response = await axios.get(`http://localhost:5000/api/applications/${alumniId}`); 
       
      console.log("Applications Response:", response.data); //    Debugging log 
   
      if (response.data.message) { 
        console.warn(response.data.message); //    Show if no applications found 
      } else { 
        const filteredApplications = response.data.filter(app => app.projectId?._id === projectId); //    Filter by projectId 
        setApplications(filteredApplications); 
      } 
    } catch (error) { 
      console.error("Error fetching applications:", error.response?.data || error); 
    } 
  }; 
   
  const handleStatusUpdate = async (status) => { 
    if (status === "Rejected" && !rejectReason) { 
      alert("Please provide a reason for rejection."); 
      return; 
    } 
 
    try { 
      await axios.put(`http://localhost:5000/api/applications/${selectedApplication._id}`, { 
        status, 
        rejectReason: status === "Rejected" ? rejectReason : "", // Send reason only for rejection 
      }); 
 
      alert(`Application ${status} successfully.`); 
      setSelectedApplication(null); 
      setShowRejectReason(false); 
      setRejectReason(""); // Reset the reason input 
      fetchApplications(); // Refresh the application list 
    } catch (error) { 
      console.error("Error updating status:", error); 
      alert("Failed to update application status."); 
    } 
  }; 
   
 
  return ( 
    <div className="project-applications-container"> 
      <h2>Student Applications</h2> 
      {applications.length === 0 ? ( 
        <p>No applications yet.</p> 
      ) : ( 
        <table> 
          <thead> 
            <tr> 
              <th>Student Name</th> 
              <th>Status</th> 
              <th>View Details</th> 
            </tr> 
          </thead> 
          <tbody> 
            {applications.map((app, index) => ( 
              <tr key={index}> 
                <td>{app.studentId?.name || "No Name"}</td> 
                <td>{app.status}</td> 
                <td> 
                  <button onClick={() => handleViewDetails(app)}>View</button> 
                </td> 
              </tr> 
            ))} 
          </tbody> 
        </table> 
      )} 
 
      {/* Popup Modal for Application Details */} 
      {selectedApplication && ( 
        <div className="modal"> 
          <h3>Application Details</h3> 
          <p><strong>Name:</strong> {selectedApplication.studentId?.name || "N/A"}</p> 
          <p><strong>Introduction:</strong> {selectedApplication.introduction}</p> 
          <p><strong>Skills:</strong> {selectedApplication.skills}</p> 
          <p><strong>Portfolio:</strong> {selectedApplication.portfolioLink || "N/A"}</p> 
          <p><strong>Status:</strong> {selectedApplication.status}</p> 
 
          {selectedApplication.status === "Pending" && ( 
            <> 
              <button onClick={() => handleStatusUpdate("Accepted")}>Accept</button> 
              <button className="reject" onClick={() => setShowRejectReason(true)}>Reject</button> 
            </> 
          )} 
 
          {showRejectReason && ( 
            <div> 
              <textarea 
                placeholder="Enter rejection reason..." 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)} 
              /> 
              <button className="reject" onClick={() => handleStatusUpdate("Rejected")}>Submit 
Rejection</button> 
            </div> 
          )} 
 
          <button className="close-button" onClick={() => { 
            setSelectedApplication(null); 
            setShowRejectReason(false); 
            setRejectReason(""); // Reset the reason input 
          }}>Close</button> 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default ProjectApplications; 