import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import "./AlumniFund.css"; // Import the CSS file 
 
const AlumniFund = () => { 
    const [requests, setRequests] = useState([]); 
    const [contribution, setContribution] = useState({ paymentScreenshot: null }); 
    const [amounts, setAmounts] = useState({}); 
    const [pastContributions, setPastContributions] = useState([]);  
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(""); 
 
    const alumniId = localStorage.getItem("userId"); 
 
    useEffect(() => { 
        axios.get("http://localhost:5000/api/fundrequests/approved") 
            .then(res => setRequests(res.data)) 
            .catch(err => console.error(err)); 
    }, []); 
 
    useEffect(() => { 
        if (!alumniId) { 
            setError("User ID not found."); 
            setLoading(false); 
            return; 
        } 
 
        axios.get(`http://localhost:5000/api/past-contributions/${alumniId}`) 
            .then((res) => { 
                setPastContributions(res.data); 
                setLoading(false); 
            }) 
            .catch((err) => { 
                console.error("Error fetching past contributions:", err); 
                if (err.response?.status === 404) { 
                    setPastContributions([]);  
                } else { 
                    setError("Failed to load past contributions."); 
                } 
                setLoading(false); 
            }); 
    }, [alumniId]); 
 
    const handleFileChange = (e) => { 
        setContribution({ ...contribution, paymentScreenshot: e.target.files[0] }); 
    }; 
 
    const handleAmountChange = (requestId, value) => { 
        setAmounts((prev) => ({ ...prev, [requestId]: value })); 
    }; 
 
    const handleContribute = async (requestId) => { 
        if (!alumniId) { 
            alert("User not found. Please log in again."); 
            return; 
        } 
 
        const selectedAmount = amounts[requestId]; 
        if (!selectedAmount || selectedAmount.trim() === "") { 
            alert("Please enter an amount."); 
            return; 
        } 
 
        if (!contribution.paymentScreenshot) { 
            alert("Please upload a payment screenshot."); 
            return; 
        } 
 
        const formData = new FormData(); 
        formData.append("requestId", requestId); 
        formData.append("alumniId", alumniId); 
        formData.append("amount", selectedAmount); 
        formData.append("paymentScreenshot", contribution.paymentScreenshot); 
 
        try { 
            const response = await axios.post("http://localhost:5000/api/contributions", formData, { 
                headers: { "Content-Type": "multipart/form-data" } 
            }); 
 
            alert("Contribution successful!"); 
        } catch (err) { 
            console.error("Contribution Error:", err.response?.data || err.message); 
            alert("Error contributing."); 
        } 
    }; 
 
    return ( 
        <div className="alumni-fund-container"> 
            <h2>Contribute to Fund Requests</h2> 
            {requests.map((req) => ( 
                <div key={req._id} className="fund-card"> 
                    <p className="fund-title">{req.purpose} - ₹{req.amount}</p> 
                    <p>{req.description}</p> 
                    <p><strong>Remaining:</strong> ₹{req.remainingAmount}</p> 
                    <p><strong>UPI ID:</strong> {req.upiId ? req.upiId : "Not available yet"}</p> 
 
                    {/* Contribution Form */} 
                    <div className="contribution-form"> 
                        <input  
                            type="number"  
                            placeholder="Enter amount"  
                            value={amounts[req._id] || ""}  
                            onChange={(e) => handleAmountChange(req._id, e.target.value)} 
                        /> 
                         <label htmlFor={`payment-screenshot-${req._id}`} className="file-upload-label"> 
                            Upload Payment Screenshot 
                        </label> 
                        <input  
                            id={`payment-screenshot-${req._id}`}  
                            type="file"  
                            accept="image/*"  
                            onChange={handleFileChange}  
                            required  
                        /> 
                        <button className="contribute-btn" onClick={() => handleContribute(req._id)}> 
                               Contribute 
                        </button> 
                    </div> 
                </div> 
            ))} 
 
            <hr /> 
 
            {/* Past Contributions Section */} 
            <div className="past-contributions"> 
                <h2>Past Contributions</h2> 
                {loading ? ( 
                    <h3>Loading past contributions...</h3> 
                ) : error ? ( 
                    <h3 style={{ color: "red" }}>{error}</h3> 
                ) : pastContributions.length === 0 ? ( 
                    <p>No past contributions found.</p> 
                ) : ( 
                    <ul> 
                        {pastContributions.map((con) => ( 
                            <li key={con._id}> 
                                Contributed ₹{con.amount} for <strong>{con.requestId?.purpose || "Unknown Request"}</strong> 
                                <br /> 
                                <a className="payment-link" 
href={`http://localhost:5000/${con.paymentScreenshot}`} target="_blank" rel="noopener 
noreferrer"> 
                                    View Payment Screenshot 
                                </a> 
                            </li> 
                        ))} 
                    </ul> 
                )} 
            </div> 
        </div> 
    ); 
}; 
 
export default AlumniFund; 
 
 
