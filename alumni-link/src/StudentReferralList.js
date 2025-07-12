import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentReferralList.css";

const StudentReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const getStudentReferrals = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/referrals/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const studentId = localStorage.getItem("userId");
        console.log("Student ID from localStorage:", studentId);

        if (!studentId) throw new Error("User ID not found");

        const referrals = await getStudentReferrals(studentId);
        setReferrals(referrals);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setShouldRefresh(false);
      }
    };

    fetchReferrals();

    const comingFromSubmission = sessionStorage.getItem("referralSubmitted");
    if (comingFromSubmission) {
      sessionStorage.removeItem("referralSubmitted");
      setShouldRefresh(true);
    }
  }, [shouldRefresh]);

  const handleManualRefresh = () => {
    setLoading(true);
    setShouldRefresh(true);
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="referrals-container">
      <div className="referrals-header">
        <h2 className="referrals-title">Your Referral Requests</h2>
        <button
          onClick={handleManualRefresh}
          className="refresh-btn"
        >
          Refresh List
        </button>
      </div>

      {referrals.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">You haven't made any referral requests yet</p>
          <p className="empty-hint">
            If you just submitted a request, try refreshing the list.
          </p>
        </div>
      ) : (
        <div className="referrals-grid">
          {referrals.map((referral) => (
            <div key={referral._id} className="referral-card">
              {/* <h3 className="card-title">
                {referral.internship.position} at {referral.internship.company}
              </h3> */}
              <div>
                <p className="card-detail">
                  <span className="card-label">To:</span> {referral.alumni.name}
                </p>
                <p className="card-detail">
                  <span className="card-label">Your Message:</span> {referral.message}
                </p>
                <p className="card-detail">
                  <span className="card-label">Status:</span>{" "}
                  <span className={
                    referral.status === "Accepted" ? "status-accepted" :
                    referral.status === "Rejected" ? "status-rejected" : "status-pending"
                  }>
                    {referral.status}
                  </span>
                </p>
                {referral.status === "Rejected" && referral.rejectReason && (
                  <div className="rejection-reason">
                    <p className="rejection-reason-title">Reason:</p>
                    <p>{referral.rejectReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentReferralList;