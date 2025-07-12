import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import "./ViewInternships.css";
import { useNavigate } from "react-router-dom";

const ViewInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ stipend: "", duration: "" });
  const [bookmarks, setBookmarks] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchInternships();
        await fetchBookmarks();
        await fetchMyReferrals();
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/internships/all");
      setInternships(response.data);
    } catch (err) {
      console.error("Error fetching internships:", err);
      throw err;
    }
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/bookmarks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      // Continue even if bookmarks fail
    }
  };

  const fetchMyReferrals = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      const response = await axios.get(
        `http://localhost:5000/api/referrals/student/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyReferrals(response.data);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      // Continue even if referrals fail
    }
  };

  const isBookmarked = (id) => {
    return bookmarks.some((bookmark) => bookmark.internship?._id === id);
  };

  const getReferralStatus = (internshipId) => {
    const referral = myReferrals.find(r => r.internship?._id === internshipId);
    return referral ? referral.status : null;
  };

  const handleBookmark = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to bookmark internships.");
        return;
      }
  
      if (isBookmarked(id)) {
        await axios.delete(
          `http://localhost:5000/api/bookmarks/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarks(bookmarks.filter((bookmark) => bookmark.internship?._id !== id));
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/bookmarks",
          { internshipId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarks([...bookmarks, response.data]);
      }
    } catch (err) {
      console.error("Error bookmarking internship:", err);
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearchQuery =
      internship.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.stipend || internship.stipend >= filters.stipend) &&
      (!filters.duration || internship.duration === filters.duration);

    return matchesSearchQuery && matchesFilters;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (loading) {
    return <div className="loading-state">Loading internships...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="internships-container">
      <h2>Available Internships</h2>
      <div className="search-bar-container">

      <input
        type="text"
        placeholder="Search internships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      </div>
      {filteredInternships.length === 0 ? (
        <p>No internships found.</p>
      ) : (
        <ul className="internships-list">
          {filteredInternships.map((internship) => {
            const referralStatus = getReferralStatus(internship._id);
            
            return (
              <li key={internship._id} className="internship-item">
                <h3>{internship.title}</h3>
                <p><strong>Company:</strong> {internship.company}</p>
                <p><strong>Location:</strong> {internship.location}</p>
                <p><strong>Description:</strong> {internship.description}</p>
                <p><strong>Stipend:</strong> {internship.stipend}</p>
                <p><strong>Duration:</strong> {internship.duration}</p>
                <p><strong>Application Link:</strong> <a href={internship.applicationLink} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
                <p><strong>Posted By:</strong> {internship.postedBy?.name}</p>
                
                <div className="internship-actions">
                  {/* <button
                    className="bookmark-button"
                    onClick={() => handleBookmark(internship._id)}
                  >
                    {isBookmarked(internship._id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button> */}

                  {referralStatus ? (
                    <div className="referral-status-container">
                      <span className={`referral-status ${referralStatus.toLowerCase()}`}>
                        Referral {referralStatus}
                      </span>
                      {referralStatus === "Pending" && (
                        <button 
                          onClick={() => navigate('/student/referrals')}
                          className="view-request-btn"
                        >
                          View Request
                        </button>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/request-referral/${internship._id}`)}
                      className="request-referral-btn"
                    >
                      Request Referral
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewInternships;