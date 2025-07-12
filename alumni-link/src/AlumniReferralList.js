import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AlumniReferralList.css";

const AlumniReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getAlumniReferrals = async (alumniId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/referrals/alumni/${alumniId}`,
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

  const viewResume = (filename) => {
    window.open(
      `http://localhost:5000/api/referrals/resume/${filename}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const alumniId = localStorage.getItem("userId");
        console.log("Alumni ID from localStorage:", alumniId);

        if (!alumniId) throw new Error("User ID not found");

        const referrals = await getAlumniReferrals(alumniId);
        console.log("Referrals data:", referrals); // Debugging log
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

    // Check for new referrals periodically (every 30 seconds)
    const interval = setInterval(fetchReferrals, 30000);
    return () => clearInterval(interval);
  }, [shouldRefresh]);

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    try {
      if (status === "Rejected") {
        let reason = rejectReason.trim() ? rejectReason : window.prompt("Please enter the reason for rejection:");

        if (!reason || !reason.trim()) {
          alert("Rejection reason is required");
          setIsUpdating(false);
          return;
        }

        await axios.put(
          `http://localhost:5000/api/referrals/${selectedReferral?._id}/status`,
          { status, rejectReason: reason },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setReferrals((prevReferrals) =>
          prevReferrals.map((ref) =>
            ref._id === selectedReferral?._id ? { ...ref, status, rejectReason: reason } : ref
          )
        );
      } else {
        await axios.put(
          `http://localhost:5000/api/referrals/${selectedReferral?._id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setReferrals((prevReferrals) =>
          prevReferrals.map((ref) =>
            ref._id === selectedReferral?._id ? { ...ref, status } : ref
          )
        );
      }

      setSelectedReferral(null);
      setRejectReason("");
      setShouldRefresh(true);
    } catch (error) {
      console.error("Failed to update status:", error);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    setShouldRefresh(true);
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="referrals-container">
      <div className="referrals-header">
        <h2 className="referrals-title">Referral Requests</h2>
        <button onClick={handleManualRefresh} className="refresh-btn" disabled={loading}>
          {loading ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      {referrals?.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No referral requests found</p>
        </div>
      ) : (
        <div className="referrals-grid">
          {referrals &&
            referrals.map((referral) =>
              referral?.student ? (
                <div key={referral._id} className="referral-card">
                  <div className="space-y-2">
                    <p className="card-detail">
                      <span className="card-label">From:</span> {referral.student.name}
                    </p>
                    <p className="card-detail">
                      <span className="card-label">Message:</span> {referral.message}
                    </p>
                    <p className="card-detail">
                      <span className="card-label">Status:</span>{" "}
                      <span
                        className={
                          referral.status === "Accepted"
                            ? "status-accepted"
                            : referral.status === "Rejected"
                            ? "status-rejected"
                            : "status-pending"
                        }
                      >
                        {referral.status}
                      </span>
                    </p>
                    {referral.status === "Rejected" && referral.rejectReason && (
                      <p className="card-detail">
                        <span className="card-label">Reason:</span> {referral.rejectReason}
                      </p>
                    )}
                  </div>

                  {referral.status === "Pending" && (
                    <div className="card-actions">
                      <button onClick={() => setSelectedReferral(referral)} className="action-btn action-btn-primary">
                        Take Action
                      </button>
                      <button
                        onClick={() => viewResume(referral.resumeUrl?.split("/").pop())}
                        className="action-btn action-btn-secondary"
                      >
                        View Resume
                      </button>
                    </div>
                  )}
                </div>
              ) : null
            )}
        </div>
      )}

      {selectedReferral && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Update Referral Status</h3>
            <p>Request from {selectedReferral?.student?.name || "Unknown Student"}</p>

            <div className="modal-actions">
              <button
                onClick={() => handleStatusUpdate("Accepted")}
                className="modal-btn modal-btn-accept"
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Accept"}
              </button>

              <button
                onClick={() => handleStatusUpdate("Rejected")}
                className="modal-btn modal-btn-reject"
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Reject"}
              </button>

              <button
                onClick={() => {
                  setSelectedReferral(null);
                  setRejectReason("");
                }}
                className="modal-btn modal-btn-cancel"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniReferralList;
