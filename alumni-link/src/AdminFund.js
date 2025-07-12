import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import "./AdminFund.css"; // Import the CSS file 
 
const AdminFund = () => { 
    const [requests, setRequests] = useState([]); 
    const [contributions, setContributions] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(""); 
    const [search, setSearch] = useState(""); //   Search state added 
    const [contributionSearch, setContributionSearch] = useState("");  
 
    useEffect(() => { 
        const fetchData = async () => { 
            try { 
                const [requestsRes, contributionsRes] = await Promise.all([ 
                    axios.get("http://localhost:5000/api/fundrequests"), 
                    axios.get("http://localhost:5000/api/contributions"), 
                ]); 
 
                const sortedRequests = requestsRes.data.sort((a, b) =>  
                    a.status === "Pending" ? -1 : b.status === "Pending" ? 1 : 0 
                ); 
         
 
                setRequests(sortedRequests); 
                setContributions(contributionsRes.data); 
                setLoading(false); 
            } catch (err) { 
                console.error("Error fetching data:", err); 
                setError("Failed to load data. Check backend connection."); 
                setLoading(false); 
            } 
        }; 
 
        fetchData(); 
    }, []); 
 
    const handleAction = async (id, status) => { 
        let upiId = null; 
     
        if (status === "Approved") { 
            upiId = prompt("Enter UPI ID for payment:"); 
            if (!upiId || upiId.trim() === "") { 
                alert("UPI ID is required to approve this request."); 
                return; 
            } 
        } 
     
        try { 
            await axios.put(`http://localhost:5000/api/fundrequests/${id}`, { status, upiId }); 
     
            // Update state after approval/rejection 
            setRequests((prevRequests) => 
                prevRequests.map((req) => 
                    req._id === id ? { ...req, status, upiId: status === "Approved" ? upiId : null } : req 
                ) 
            ); 
        } catch (err) { 
            console.error("Error updating request status:", err); 
            setError("Failed to update request."); 
        } 
    }; 
     
 
    if (loading) return <h2>Loading...</h2>; 
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>; 
 
    return ( 
        <div className="admin-fund-container"> 
            <h2>Manage Fund Requests</h2> 
             
            {/*     Search Box */} 
            <input 
                type="text" 
                className="search-box" 
                placeholder="Search by Purpose..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            /> 
 
            {requests.length === 0 ? ( 
                <p>No fund requests found.</p> 
            ) : ( 
                requests 
    .filter((req) => 
        req.purpose.toLowerCase().includes(search.toLowerCase()) 
    ) 
    .map((req) => ( 
        <div key={req._id} className="fund-card"> 
            <p className="fund-title">{req.purpose} - ₹{req.amount}</p> 
            <p><strong>Description:</strong> {req.description}</p> 
            <p> 
                <strong>Status:</strong> 
                <span className={`status-${req.status.toLowerCase()}`}> 
                    {req.status} 
                </span> 
            </p> 
            <p><strong>Remaining:</strong> ₹{req.remainingAmount || req.amount}</p> 
 
            {/*    Show UPI ID if approved */} 
            {req.status === "Approved" && ( 
                <p><strong>UPI ID:</strong> {req.upiId}</p> 
            )} 
 
            {req.status === "Pending" && ( 
                <div className="button-group"> 
                    <button onClick={() => handleAction(req._id, "Approved")} className="approve-btn"> 
                           Approve 
                    </button> 
                    <button onClick={() => handleAction(req._id, "Rejected")} className="reject-btn"> 
                          Reject 
                    </button> 
                </div> 
            )} 
        </div> 
    )) 
)} 
 
            <h2>Contributions</h2> 
            <input 
                type="text" 
                className="search-box" 
                placeholder="Search contributions by Purpose..." 
                value={contributionSearch} 
                onChange={(e) => setContributionSearch(e.target.value)} 
            /> 
            {contributions.length === 0 ? ( 
                <p>No contributions yet.</p> 
            ) : ( 
                contributions 
                .filter((con) => 
                    con.requestId?.purpose?.toLowerCase().includes(contributionSearch.toLowerCase()) 
                ) 
                .map((con) => ( 
                    <div key={con._id} className="fund-card"> 
                        <p><strong>Alumni:</strong> {con.alumniId?.name || con.alumniId}</p> 
                        <p><strong>Amount:</strong> ₹{con.amount}</p> 
                        <p><strong>Purpose:</strong> {con.requestId?.purpose || "N/A"}</p> {/*    Added 
Purpose */} 
                        <a href={`http://localhost:5000/${con.paymentScreenshot}`} target="_blank" 
rel="noopener noreferrer"> 
                            View Screenshot 
                        </a> 
                    </div> 
                )) 
            )} 
        </div> 
    ); 
}; 
 
export default AdminFund; 
 
