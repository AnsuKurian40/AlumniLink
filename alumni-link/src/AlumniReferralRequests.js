import React, { useEffect, useState } from "react";
import axios from "axios";

const AlumniReferralRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(`/api/referrals/alumni/${localStorage.getItem("userId")}`).then((res) => setRequests(res.data));
  }, []);

  const handleUpdate = (id, status) => {
    axios.put(`/api/referrals/update-status/${id}`, { status }).then(() => setRequests(requests.map((req) => (req._id === id ? { ...req, status } : req))));
  };

  return (
    <div>
      <h2>Referral Requests</h2>
      {requests.map((request) => (
        <div key={request._id}>
          <p>{request.studentName} requested for {request.internshipName}</p>
          <button onClick={() => handleUpdate(request._id, "Accepted")}>Accept</button>
          <button onClick={() => handleUpdate(request._id, "Rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AlumniReferralRequests;
