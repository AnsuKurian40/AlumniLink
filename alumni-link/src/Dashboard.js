import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import welcomeImage from "./emoji.png";
import internshipIcon from "./internshipsq.png";
import workshopIcon from "./internshipsq.png";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  // Get user data from localStorage
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole")?.trim().toLowerCase();
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        // First check user type
        const typeResponse = await axios.get(`http://localhost:5000/api/profile/user-type/${userId}`);
        const isAlumni = typeResponse.data.isAlumni;
        
        // Then fetch profile data
        const endpoint = isAlumni 
          ? `http://localhost:5000/api/profile/alumni/${userId}`
          : `http://localhost:5000/api/profile/student/${userId}`;
        
        const response = await axios.get(endpoint);
        
        if (response.data.profilePicture) {
          setProfilePicture(`http://localhost:5000/${response.data.profilePicture}`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);


  useEffect(() => {
    axios.get("http://localhost:5000/api/internships/all")
      .then(response => setInternships(response.data.slice(0, 8)))
      .catch(error => console.error("Error fetching internships:", error));

    axios.get("http://localhost:5000/api/workshops/all")
      .then(response => setWorkshops(response.data.slice(0, 8)))
      .catch(error => console.error("Error fetching workshops:", error));
  }, []);






  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="top-section">
        {/* <input type="text" placeholder="Search..." className="search-bar" /> */}
        <div className="profile-section">
          <div className="profile-pic-container" onClick={handleProfileClick}>
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="profile-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "default-profile.png";
                }}
              />
            ) : (
              <div className="profile-pic placeholder">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="student-details">
            <h3>{userName}</h3>
            <p>{userRole === "student" ? "Student" : "Alumni"}</p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Sidebar with navigation */}
        <nav className="sidebar">
          <h2>ALUMNILINK</h2>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {/* Show "Add Internship" only for alumni */}
            {userRole === "alumni" && (
              <li>
                <Link to="/add-internship">Add Internship</Link>
              </li>
            )}
            {/* Show "View Internships" only for students */}
            {userRole === "student" && (
              <li>
                <Link to="/view-internship">View Internships</Link>
              </li>
            )}

            {/* Add Referral Request links */}
            {userRole === "student" && (
              <li>
                <Link to="/student/referrals">My Referral Requests</Link>
              </li>
            )}
            {userRole === "alumni" && (
              <li>
                <Link to="/alumni/referrals">Referral Requests</Link>
              </li>
            )}

            {/* Show "Add Workshop" only for alumni */}
            {userRole === "alumni" && (
              <li>
                <Link to="/add-workshop">Add Workshop</Link>
              </li>
            )}
            {/* Show "View Workshops" only for students */}
            {userRole === "student" && (
              <li>
                <Link to="/view-workshops">View Workshops</Link>
              </li>
            )}
            
            {/* Mentorship Section */}
            {userRole === "student" && <li><Link to="/post-questions">Mentorship</Link></li>}
            {userRole === "alumni" && <li><Link to="/view-questions">Mentorship</Link></li>}

            <li><Link to="/resources">Resources</Link></li>
            <li><Link to={userRole === "alumni" ? "/alumni" : "/student"}>Fund Details</Link></li>
            <li><Link to={userRole === "alumni" ? "/alumni-page" : "/student-page"}>Projects</Link></li>

            {/* <li><Link to="/bookmarks">Bookmarks</Link></li> */}
            <li><Link to={userRole === "alumni" ? "/AlumniReview" : "/StudentReview"}>Reviews</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li>
              <Link to={userId ? `/profile/${userId}` : "/profile"}>Profile</Link>
            </li>
            <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome back, {userName}!</h1>
              <p>
                {userRole === "alumni"
                  ? "Manage your posted internships and workshops, and connect with students."
                  : "Discover new opportunities and grow with AlumniLink."}
              </p>
            </div>
            <div className="welcome-img-container">
              {/* <img src={welcomeImage} alt="Welcome" className="welcome-img" /> */}
            </div>
          </div>

          {/* Internships Section */}
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

          {/* Workshops Section */}
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