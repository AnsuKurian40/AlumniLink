import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WorkshopDetails = () => {
  const { id } = useParams(); // Get the workshop ID from the URL
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchWorkshop = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/workshops/${id}`);
      if (response.data) {
        setWorkshop(response.data);
      } else {
        setError("Workshop not found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching workshop details:", err);
      setError("Failed to fetch workshop details. Please try again.");
      setLoading(false);
    }
  }, [id]); // Dependency array includes id

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);

  if (loading) {
    return <p>Loading workshop details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="workshop-details-container">
      <h2>{workshop.title}</h2>
      <p><strong>Organizer:</strong> {workshop.organizer}</p>
      <p><strong>Description:</strong> {workshop.description}</p>
      <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> {workshop.duration}</p>
      <p><strong>Location:</strong> {workshop.location}</p>
      <p><strong>Skills Covered:</strong> {workshop.skillsCovered.join(", ")}</p>
      <p><strong>Registration Deadline:</strong> {new Date(workshop.registrationDeadline).toLocaleDateString()}</p>
      <p><strong>Contact Email:</strong> {workshop.contactEmail}</p>
      <p><strong>Registration Link:</strong> <a href={workshop.registrationLink} target="_blank" rel="noopener noreferrer">Register Here</a></p>
      {workshop.document && (
        <p>
          <strong>Download Document:</strong>{" "}
          <a href={`http://localhost:5000/${workshop.document}`} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </p>
      )}
      <button onClick={() => navigate("/view-workshops")}>Back to Workshops</button>
    </div>
  );
};

export default WorkshopDetails;
