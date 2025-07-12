import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddWorkshop.css";

const AddWorkshop = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [error, setError] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postedBy = localStorage.getItem("userId"); // Get the logged-in alumni's ID
    if (!title || !description || !date || !duration || !location || !organizer || !applicationLink) {
      setError("All fields are required.");
      // setSuccessMessage("");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/workshops/add", {
        title,
        description,
        date,
        duration,
        location,
        organizer,
        applicationLink,
        postedBy,
      });
      console.log("Workshop added:", response.data);
      navigate("/dashboard"); // Redirect to dashboard after adding
    } catch (err) {
      console.error("Error adding workshop:", err);
      setError("Failed to add workshop. Please try again.");
    }
  };

  return (
    <div className="add-workshop-container">
      <h2>Add Workshop</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
       <label className="date-label">Last date for reg:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Organizer"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          required
        />
         <input
            type="url"
            placeholder="Application Link"
            value={applicationLink}
  onChange={(e) => setApplicationLink(e.target.value)}
  required
/>


        <button type="submit">Add Workshop</button>
      </form>
    </div>
  );
};

export default AddWorkshop



