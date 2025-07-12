import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import "./AdminDashboard.css"; 
 
const AdminDashboard = () => { 
    const navigate = useNavigate(); 
 
    // State to store fetched data 
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        activeFundRequests: 0, 
        totalReports: 0, 
        totalProjects: 0 
    }); 
 
    const [recentActivities, setRecentActivities] = useState([]); 
 
    // Fetch data from backend 
    useEffect(() => { 
        const fetchData = async () => { 
            try { 
                const response = await axios.get("http://localhost:5000/api/admin-dashboard"); 
     
                // Directly assign the response to `setStats` 
                setStats({ 
                    totalUsers: response.data.totalUsers, 
                    activeFundRequests: response.data.pendingFunds, // Adjust as needed 
                    totalReports: response.data.totalReports, 
                    totalProjects: response.data.totalProjects  // API does not provide totalProjects, set default 
                }); 
     
                // If recentActivities is not included in the API response, set an empty array 
                setRecentActivities(response.data.recentActivities || []); 
            } catch (error) { 
                console.error("Error fetching dashboard data:", error); 
            } 
        }; 
     
        fetchData(); 
    }, []); 
     
    const handleLogout = (e) => { 
        e.preventDefault();  // Prevent default link behavior 
        localStorage.removeItem("token");  // Clear authentication data 
        navigate("/login");  // Redirect to login page 
    }; 
 
    return ( 
        <div className="dashboard-container"> 
            {/* Top Section */} 
            <div className="top-section"> 
                {/* <input type="text" className="search-bar" placeholder="Search..." />  */}
                <div className="profile-section"> 
                    <div className="student-details"> 
                        <h3>Admin</h3> 
                        <p>System Administrator</p> 
                    </div> 
                </div> 
            </div> 
 
            {/* Sidebar & Main Content */} 
            <div className="content-wrapper"> 
                <aside className="sidebar"> 
                    <h2>ALUMNILINK</h2> 
                    <ul> 
                        <li><a href="/dashboard">Dashboard</a></li> 
                        <li><a href="/add-user">Manage Users</a></li> 
                        <li><a href="/add-report">Reports</a></li> 
                        <li><a href="/admin-fund">Funds</a></li> 
                        <li><a href="/projects">Projects</a></li> 
                        <li><a href="/internships">Internships</a></li>  {/* New Entry */} 
                        <li><a href="/workshops">Workshops</a></li>      {/* New Entry */} 
                        {/* <li><a href="/reviews">Reviews</a></li>   */}
                        <li><a href="/mentorship">Mentorship</a></li>   
                        <li><a href="/admin/resources">Resources</a></li> 
                        <li className="logout-link" onClick={handleLogout}> 
                            <a href="#">Logout</a> 
                        </li> 
                        </ul> 
                     
                </aside> 
 
                {/* Main Content */} 
                <main className="main-content"> 
                    <div className="welcome-section"> 
                        <div className="welcome-text"> 
                            <h1>Welcome back, Admin!</h1> 
                            <p>Manage the AlumniLink platform efficiently.</p> 
                        </div> 
                    </div> 
 
                    {/* Admin Overview Section */} 
                    <div className="admin-overview"> 
                        <div className="overview-cards"> 
                            <div className="card"> 
                                <h3>Total Users</h3> 
                                <p>{stats.totalUsers}</p> 
                            </div> 
                            <div className="card"> 
                                <h3>Active Fund Requests</h3> 
                                <p>{stats.activeFundRequests}</p> 
                            </div> 
                            <div className="card"> 
                                <h3>Reports Submitted</h3> 
                                <p>{stats.totalReports}</p> 
                            </div> 
                            <div className="card"> 
                                <h3>Projects Posted</h3> 
                                <p>{stats.totalProjects}</p> 
                            </div> 
                        </div> 
 
                        {/* Recent Activities */} 
                        <div className="recent-activities"> 
                            <h3>Recent Activities</h3> 
                            <table> 
                                <thead> 
                                    <tr> 
                                        <th>User</th> 
                                        <th>Action</th> 
                                        <th>Date</th> 
                                    </tr> 
                                </thead> 
                                <tbody> 
                                    {recentActivities.length > 0 ? ( 
                                        recentActivities.map((activity, index) => ( 
                                            <tr key={index}> 
                                                <td>{activity.user?.name || "Unknown User"}</td>  
 
                                                <td>{activity.action}</td> 
                                                <td>{new Date(activity.createdAt).toLocaleDateString()}</td> 
                                            </tr> 
                                        )) 
                                    ) : ( 
                                        <tr> 
                                            <td colSpan="3">No recent activities</td> 
                                        </tr> 
                                    )} 
                                </tbody> 
                            </table> 
                        </div> 
 
                        {/* Quick Actions */} 
                        <div className="quick-actions"> 
                            <h3>Quick Actions</h3> 
                            <button onClick={() => navigate("/add-user")}>Add User</button> 
                            <button onClick={() => navigate("/admin-fund")}>Review Fund Requests</button> 
                            <button onClick={() => navigate("/add-report")}>View Reports</button> 
                        </div> 
                    </div> 
                </main> 
            </div> 
        </div> 
    ); 
}; 
 
export default AdminDashboard; 
 
