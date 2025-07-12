import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddInternship.css";

const AddInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    stipend: "",
    duration: "",
    applicationLink: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/internships/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Include token in headers
          },
        }
      );

      alert("Internship added successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        stipend: "",
        duration: "",
        applicationLink: "",
      });

      // navigate("/internships"); // Redirect to internships page
    } catch (error) {
      console.error("Error adding internship:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Failed to add internship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-internship-container">
      <h2>Add Internship</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="stipend"
          placeholder="Stipend"
          value={formData.stipend}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="applicationLink"
          placeholder="Application Link"
          value={formData.applicationLink}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Internship"}
        </button>
      </form>
    </div>
  );
};

export default AddInternship;