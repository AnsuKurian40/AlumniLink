import React from "react"; 
import  Navbar  from "./Navbar";  
import "./Contact.css";  // Import separate CSS 
 
export const Contact = () => ( 
  <div> 
    <Navbar /> 
    <div className="contact-container"> 
      <h2>Contact Us</h2> 
      <p>We would love to hear from you! Whether you have inquiries, feedback, or require support, 
feel free to reach out to us.</p> 
      <div className="contact-details"> 
        <p><strong>Email:</strong> alumnilinkproject@gmail.com</p> 
        <p><strong>Phone:</strong> +1 (234) 567-890</p> 
        <p><strong>Address:</strong> 123 ABC Street, University City</p> 
        <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p> 
      </div> 
    </div> 
  </div> 
);