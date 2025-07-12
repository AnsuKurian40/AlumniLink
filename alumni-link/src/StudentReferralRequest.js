import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentReferralRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get('/api/referral/student/currentStudentId')
            .then(response => setRequests(response.data));
    }, []);

    return (
        <div>
            <h2>Your Referral Requests</h2>
            {requests.map(request => (
                <div key={request._id}>
                    <p>{request.internshipName} - {request.status}</p>
                </div>
            ))}
        </div>
    );
};

export default StudentReferralRequests;
