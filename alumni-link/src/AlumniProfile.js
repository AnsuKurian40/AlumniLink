import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Profile.css";

const AlumniProfile = () => {
    const [alumni, setAlumni] = useState({});

    useEffect(() => {
        const fetchAlumniProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/alumni/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlumni(res.data);
            } catch (error) {
                console.error("Error fetching alumni profile", error);
            }
        };

        fetchAlumniProfile();
    }, []);

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <p><strong>Full Name:</strong> {alumni.name}</p>
            <p><strong>Email:</strong> {alumni.email}</p>
            <p><strong>Phone:</strong> {alumni.phone}</p>
            <p><strong>Gender:</strong> {alumni.gender}</p>
            <p><strong>Date of Birth:</strong> {alumni.dob}</p>
            <p><strong>Current Job Title:</strong> {alumni.jobRole}</p>
            <p><strong>Company Name:</strong> {alumni.company}</p>
            <p><strong>Years of Experience:</strong> {alumni.experience}</p>
            <p><strong>Industry:</strong> {alumni.industry}</p>
            <p><strong>Skills:</strong> {alumni.skills}</p>

            {/* Button to navigate to edit profile page */}
            <Link to="/edit-profile">
                <button>Edit Profile</button>
            </Link>
        </div>
    );
};

export default AlumniProfile;
