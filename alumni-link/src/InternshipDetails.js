import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./InternshipDetails.css";

const InternshipDetails = () => {
  const { id } = useParams(); // Get the internship ID from the URL
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/internships/${id}`);
      if (response.data) {
        setInternship(response.data);
      } else {
        setError("Internship not found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching internship details:", err);
      setError("Failed to fetch internship details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading internship details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="internship-details-container">
      <h2>{internship.title}</h2>
      <p><strong>Company:</strong> {internship.company}</p>
      <p><strong>Location:</strong> {internship.location}</p>
      <p><strong>Description:</strong> {internship.description}</p>
      <p><strong>Stipend:</strong> {internship.stipend}</p>
      <p><strong>Duration:</strong> {internship.duration}</p>
      <p><strong>Skills Required:</strong> {internship.skillsRequired.join(", ")}</p>
      <p><strong>Application Deadline:</strong> {new Date(internship.applicationDeadline).toLocaleDateString()}</p>
      <p><strong>Contact Email:</strong> {internship.contactEmail}</p>
      <p><strong>Apply Link:</strong> <a href={internship.applyLink} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
      {internship.document && (
        <p>
          <strong>Download Document:</strong>{" "}
          <a href={`http://localhost:5000/${internship.document}`} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </p>
      )}
      <button onClick={() => navigate("/view-internships")}>Back to Internships</button>
    </div>
  );
};

export default InternshipDetails;

