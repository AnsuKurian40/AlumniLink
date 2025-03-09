import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import "./style.css";
import heroImage from "./hero-image2.jpg";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Student", // Default role
    });

    const [message, setMessage] = useState(""); // Store success/error messages

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/register", formData);

            setMessage(response.data.message); // Show success message
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed!");
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">ALUMNILINK</div>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </nav>


              {/* Register Section with Image */}
            <div className="auth-section">
                <div className="auth-image">
                <img src={heroImage} alt="Handshake" />

                </div>



            {/* Register Form */}
            <div className="auth-container">
                <h2>Register</h2>
                {message && <p className="message">{message}</p>} {/* Display messages */}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

                    {/* Role Selection Dropdown */}
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="Student">Student</option>
                        <option value="Alumni">Alumni</option>
                    </select>

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>
    );
};

export default Register;
