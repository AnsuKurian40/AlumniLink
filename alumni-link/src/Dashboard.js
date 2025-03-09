import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Link } from "react-router-dom"; 
import "./Dashboard.css"; 
import welcomeImage from "./emoji.png";
import profilePic from "./pfpic.png";
import internshipIcon from "./internshipsq.png";
import workshopIcon from "./internshipsq.png"; 

const internships = [
    { title: "Software Development", company: "Zoho" },
    { title: "Machine Learning", company: "TCS" },
    { title: "Cybersecurity", company: "IBM" },
    { title: "Data Science", company: "Microsoft" },
    { title: "Cloud Computing", company: "Amazon" },
    { title: "Artificial Intelligence", company: "Google" },
    { title: "Blockchain", company: "Accenture" },
    { title: "UI/UX Design", company: "Adobe" },
];

const workshops = [
    { title: "Software Development", company: "Zoho" },
    { title: "Machine Learning", company: "TCS" },
    { title: "Cybersecurity", company: "IBM" },
    { title: "Data Science", company: "Microsoft" },
    { title: "Cloud Computing", company: "Amazon" },
    { title: "Artificial Intelligence", company: "Google" },
    { title: "Blockchain", company: "Accenture" },
    { title: "UI/UX Design", company: "Adobe" },
];

const Dashboard = () => {
    const navigate = useNavigate(); // ✅ Keep navigation function
    // const userType = localStorage.getItem("userType");
    const userType = localStorage.getItem("userType")?.trim().toLowerCase(); 

    const reviewPath = userType === "alumni" ? "/AlumniReview" : "/StudentReview"; 

    // ✅ Function to handle "Reviews" redirection based on userType
    const handleReviewClick = () => {
       
        if (userType === "Alumni") {
            navigate("/AlumniReview");
        } else if (userType === "Student") {
            navigate("/StudentReview");
        } else {
            alert("Access Denied: Only Alumni and Admin can access Reviews.");
        }
    };





 // ✅ Logout function
 const handleLogout = () => {
    localStorage.clear();  // ✅ Clear all stored user data
    navigate("/login");  // ✅ Redirect to Login Page
};



    return (
        <div className="dashboard-container">
            <div className="top-section">
                <input type="text" placeholder="Search..." className="search-bar" />
                <div className="profile-section">
                    <img src={profilePic} alt="Profile" className="profile-pic" />
                    <div className="student-details">
                        <h3>Riya</h3>
                        <p>3rd Year, CSE</p>
                    </div>
                </div>
            </div> 

            <div className="content-wrapper">
                {/* ✅ Sidebar with working navigation */}
                <nav className="sidebar">
                    <h2>ALUMNILINK</h2>
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/internships">Internships</Link></li>
                        <li><Link to="/workshops">Workshops</Link></li>
                        <li><Link to="/mentorship">Mentorship</Link></li>
                        <li><Link to="/resources">Resources</Link></li>
                        <li><Link to="/messages">Message</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/bookmarks">Bookmarks</Link></li>
                        {/* <li><button className="nav-button" onClick={handleReviewClick}>Reviews</button></li> ✅ Fixed Review navigation */}
                        <li><Link to={reviewPath}>Reviews</Link></li>  {/* ✅ Styled like other links */}
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li> 
                        {/* <li><Link to="/logout">Logout</Link></li> */}
                    </ul>
                </nav>

                <main className="main-content">
                    <div className="welcome-section">
                        <div className="welcome-text">
                            <h1>Welcome back!!!</h1>
                            <p>Discover new opportunities and grow with AlumniLink</p>
                        </div>
                        <div className="welcome-img-container">
                            <img src={welcomeImage} alt="Welcome" className="welcome-img" />
                        </div>
                    </div>

                    <div className="internships">
                        <h3>INTERNSHIPS</h3>
                        <div className="internship-cards">
                            {internships.map((internship, index) => (
                                <div key={index} className="internship-card">
                                    <img src={internshipIcon} alt="Internship" className="internship-img" />
                                    <h4>{internship.title}</h4>
                                    <p>{internship.company}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="workshops">
                        <h3>WORKSHOPS</h3>
                        <div className="workshop-cards">
                            {workshops.map((workshop, index) => (
                                <div key={index} className="workshop-card">
                                    <img src={workshopIcon} alt="Workshop" className="workshop-img" />
                                    <h4>{workshop.title}</h4>
                                    <p>{workshop.company}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
