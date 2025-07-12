import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import EditStudentProfile from "./EditStudentProfile";

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No authentication token found. Please log in.");
            return;
        }

        axios.get("http://localhost:5000/api/student/profile", {
            headers: { Authorization: `Bearer ${token}` }, // Correct token format
            withCredentials: true,
        })
        .then(response => {
            console.log("Student Data:", response.data);  // Debugging
            setStudent(response.data);
        })
        .catch(error => {
            console.error("Error fetching student profile:", error);
            setError("Error fetching student data.");
        });
    }, []);

    if (error) return <p>{error}</p>;
    if (!student) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h2 className="profile-header">Student Profile</h2>
            <p className="profile-info"><strong>Name:</strong> {student.name}</p>
            <p className="profile-info"><strong>Email:</strong> {student.email}</p>
            <p className="profile-info"><strong>Department:</strong> {student.department}</p>
            <p className="profile-info"><strong>Year:</strong> {student.year}</p>

            <button onClick={() => setIsEditing(true)} className="edit-button">Edit Profile</button>

            {isEditing && <EditStudentProfile student={student} onUpdate={setStudent} onClose={() => setIsEditing(false)} />}
        </div>
    );
};

export default StudentProfile;
