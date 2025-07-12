import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios"; // Use axios for API calls 
import "./style.css"; 
import heroImage from "./hero-image2.jpg"; 
 
const Login = () => { 
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    role: "Student", // Default role 
  }); 
 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 
 
  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  }; 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError(""); 
 
    console.log("Sending login request:", formData); 
 
    try { 
      const response = await axios.post("http://localhost:5000/api/login", formData); 
      console.log("Full API Response:", response.data); 
      const { token, role, name, userId } = response.data; // Assuming the backend sends the user's name 
      console.log("Extracted userId:", userId);

      console.log("Login successful! Token:", token); // Debugging: Log the token 
      console.log("userId type:", typeof userId);
      // Store token, role, and name in localStorage 
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("userRole", role); 
      localStorage.setItem("userName", name); // Store the user's name 
 
      alert("Login successful!"); 
      console.log("Stored in localStorage:");
      console.log("Token:", localStorage.getItem("token"));
      console.log("User ID:", localStorage.getItem("userId"));
      console.log("User Role:", localStorage.getItem("userRole"));
      console.log("User Name:", localStorage.getItem("userName"));

 
      // Redirect based on role 
      if (role === "Alumni") { 
        navigate("/dashboard"); // Redirect to alumni dashboard 
      } else if (role === "Student") { 
        navigate("/dashboard"); // Redirect to student dashboard 
      } else { 
        navigate("/dashboard"); // Fallback for unknown roles 
      } 
    } catch (error) { 
      console.error("Login error:", error.response?.data?.message || error.message); 
      setError(error.response?.data?.message || "Something went wrong. Please try again."); 
    } 
  }; 
 
  return ( 
    <div> 
      {/* Navbar  */}
      <nav className="navbar"> 
        <div className="logo">ALUMNILINK</div> 
        <ul> 
          <li><Link to="/">Home</Link></li> 
          <li><Link to="/services">Services</Link></li> 
          <li><Link to="/contact">Contact</Link></li> 
          <li><Link to="/about">About</Link></li> 
        </ul> 
      </nav> 
      <div className="login-image"></div> 
              
                <div className="auth-section"> 
                <div className="auth-image"> 
                   <img src={heroImage} alt="Handshake" /> 
                </div> 
 
      {/* Login Container */} 
      <div className="login-container"> 
        <h2>Login</h2> 
        {error && <p className="error-message">{error}</p>} 
 
        <form onSubmit={handleSubmit}> 
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          /> 
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          /> 
 
          {/* Role Selection */} 
          <select name="role" value={formData.role} onChange={handleChange} required> 
            <option value="Student">Student</option> 
            <option value="Alumni">Alumni</option> 
          </select> 
 
           {/* Updated Forgot Password Link */}
           <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

          <button type="submit">Login</button> 
        </form> 
 
        <p>Don't have an account? <Link to="/register">Register Here</Link></p> 
      </div> 
    </div> 
    </div> 
  ); 
}; 
 
export default Login;





