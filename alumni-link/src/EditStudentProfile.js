import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

const EditStudentProfile = ({ student, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({ ...student });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put("http://localhost:5000/api/student/profile", formData, { withCredentials: true })
            .then(response => {
                onUpdate(response.data);
                onClose();
            })
            .catch(error => console.error("Error updating profile:", error));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Student Profile</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Department:</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required />

                    <label>Year:</label>
                    <input type="text" name="year" value={formData.year} onChange={handleChange} required />

                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditStudentProfile;
