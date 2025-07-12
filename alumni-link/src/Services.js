import React from "react"; 
import Navbar  from "./Navbar";  
import "./Services.css";  // Import separate CSS 
 
export const Services = () => ( 
  <div> 
    <Navbar /> 
    <div className="services-container"> 
      <h2>Our Services</h2> 
      <p>AlumniLink offers a wide range of services to foster meaningful connections between students 
and alumni.</p> 
      <ul> 
        <li><strong>Networking Opportunities:</strong> Connect with experienced alumni.</li> 
        <li><strong>Mentorship Programs:</strong> Get career guidance.</li> 
        <li><strong>Project Collaborations:</strong> Work on innovative projects.</li> 
        <li><strong>Referral Requests:</strong> Secure job and internship referrals.</li> 
      </ul> 
    </div> 
  </div> 
); 
 
