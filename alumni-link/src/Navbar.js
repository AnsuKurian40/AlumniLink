import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Ensure this file exists

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>AlumniLink</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
      
        
        
         <Link to="/contact">Contact</Link>
         <Link to="/about">About</Link>
        
        <Link to="/services">Services</Link>
        </div>
    </nav>
  );
};

export default Navbar;
