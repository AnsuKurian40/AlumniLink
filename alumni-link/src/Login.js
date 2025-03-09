import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import heroImage from "./hero-image2.jpg";
//import loginImage from "./hero-image.png";
const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "Student", // Default role
    });

    const [error, setError] = useState(""); // State to store error message
    const navigate = useNavigate();

    const handleLogin = (userType) => {
        console.log("Storing userType:", userType); // Debugging
        localStorage.setItem("userType", userType);  // Save the user type
        navigate("/dashboard");
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error message

        console.log("Sending request:", formData); // Debugging log

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful! User role:", data.role); // ✅ Debugging log
                alert("Login successful!");

                localStorage.setItem("userType", data.role); // ✅ Store role in localStorage

                navigate("/dashboard"); // Redirect to dashboard after login
            } else {
                setError(data.message); // Show error message (Invalid credentials)
            }

        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again."); // Handle unexpected errors
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
                </ul>
            </nav>


             {/* Login Page Wrapper */}
            {/* <div className="login-wrapper"> */}
                {/* Left Side Image */}
                <div className="login-image"></div>
             
                <div className="auth-section">
                <div className="auth-image">
                   <img src={heroImage} alt="Handshake" />
                </div>



            {/* Login Form */}

            <div className="auth-container">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>} {/* Show error message */}
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                    {/* Role Selection Dropdown */}
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="Student">Student</option>
                        <option value="Alumni">Alumni</option>
                    </select>

                    {/* Forgot Password Link */}
                    <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </p>
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register Here</a></p>
            </div>
        </div>
    </div>
    );
};

export default Login;
