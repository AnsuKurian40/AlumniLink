import React from "react"; 
import  Navbar  from "./Navbar";  
import "./About.css";  // Import separate CSS 
 
export const About = () => ( 
  <div> 
    <Navbar /> 
    <div className="about-container"> 
      <h2>About AlumniLink</h2> 
      <p>AlumniLink is an innovative platform designed to strengthen the bond between students and 
alumni.</p> 
      <h3>Our Mission</h3> 
      <p>To build a strong and dynamic community where students and alumni can connect, learn, and 
grow together.</p> 
      <h3>Why Choose AlumniLink?</h3> 
      <ul> 
        <li>A user-friendly platform for engagement.</li> 
        <li>Access to a diverse network of professionals.</li> 
        <li>Career guidance, project support, and funding opportunities.</li> 
        <li>A bridge between academia and industry.</li> 
      </ul> 
    </div> 
  </div> 
);