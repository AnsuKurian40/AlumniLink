import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditAlumniProfile.css"; 

const EditAlumniProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        jobRole: "",
        company: "",
        experience: "",
        industry: "",
        skills: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/alumni/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData(res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                "http://localhost:5000/api/alumni/update-profile", 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 200) {
                alert("Profile updated successfully!");
                navigate("/profile"); // Redirect to profile page
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Full Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />

                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                <label>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Date of Birth:</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

                <label>Current Job Title:</label>
                <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} />

                <label>Company Name:</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} />

                <label>Years of Experience:</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} />

                <label>Industry:</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleChange} />

                <label>Skills:</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} />

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate("/profile")}>Cancel</button>
            </form>
        </div>
    );
};

export default EditAlumniProfile;
