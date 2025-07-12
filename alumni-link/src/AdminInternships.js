import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InternshipPage.css";

const InternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [referralRequests, setReferralRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/internships");
                setInternships(response.data);
            } catch (error) {
                console.error("Error fetching internships:", error);
            }
        };

        fetchInternships();
    }, []);

    const groupByAlumni = () => {
        return internships.reduce((acc, internship) => {
            const alumniName = internship.postedBy.name;
            if (!acc[alumniName]) {
                acc[alumniName] = {
                    internships: [],
                    count: internship.internshipCountByAlumni,  // Store count from backend
                };
            }
            acc[alumniName].internships.push(internship);
            return acc;
        }, {});
    };

    const fetchReferralRequests = async (internshipId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/referrals/${internshipId}`);
            console.log("Referral Requests Response:", response.data);
            setReferralRequests(response.data);
            setSelectedInternship(internshipId);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching referral requests:", error);
        }
    };

    const groupedInternships = groupByAlumni();

    return (
        <div className="internships-page">
            <h2>Internships Posted by Alumni</h2>
            {Object.keys(groupedInternships).map((alumniName) => (
                <div key={alumniName} className="internships-by-alumni">
                     <h3>{alumniName} (posted {groupedInternships[alumniName].count} {groupedInternships[alumniName].count === 1 ? "internship" : "internships"})</h3>
                    <ul>
                    {groupedInternships[alumniName].internships.map((internship) => (

                            <li key={internship._id}>
                                <h4>{internship.title}</h4>
                                <p>{internship.company} - {internship.location}</p>
                                <p>{internship.description}</p>
                                <p><strong>Referral Requests:</strong> {internship.referralCount || 0}</p>
                                <p><strong>Accepted Requests:</strong> {internship.acceptedReferralCount || 0}</p>
                                <button onClick={() => fetchReferralRequests(internship._id)}>View List</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

{isModalOpen && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-content">
                        <h3>Referral Requests</h3>
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                        <ul>
                            {referralRequests.length > 0 ? (
                                referralRequests.map((req) => (
                                    <li key={req._id}>
                                        {req.studentName} - <strong>{req.status}</strong>
                                    </li>
                                ))
                            ) : (
                                <p>No referral requests found.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        )}
    </div>
)};

export default InternshipsPage;
