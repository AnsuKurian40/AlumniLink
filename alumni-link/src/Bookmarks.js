import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Bookmarks.css"; // Ensure you have styles for the modal

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // To store selected internship/workshop

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(response.data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, []);

  // Function to handle opening modal
  const openModal = (item) => {
    setSelectedItem(item);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="bookmarks-container">
      <h2>My Bookmarks</h2>

      {/* Internships Section */}
      <div className="bookmarks-section">
        <h3>Bookmarked Internships</h3>
        {bookmarks.filter((b) => b.internship).length === 0 ? (
          <p>No internships bookmarked.</p>
        ) : (
          <div className="bookmarks-list">
            {bookmarks
              .filter((b) => b.internship)
              .map((bookmark) => (
                <div key={bookmark._id} className="bookmark-item">
                  <div className="internship-card">
                    <h3>{bookmark.internship.title}</h3>
                    <p><strong>Company:</strong> {bookmark.internship.company}</p>
                    <Link 
                      to="#" 
                      className="view-details-link" 
                      onClick={(e) => {
                        e.preventDefault();
                        openModal(bookmark.internship);
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Workshops Section */}
      <div className="bookmarks-section">
        <h3>Bookmarked Workshops</h3>
        {bookmarks.filter((b) => b.workshop).length === 0 ? (
          <p>No workshops bookmarked.</p>
        ) : (
          <div className="bookmarks-list">
            {bookmarks
              .filter((b) => b.workshop)
              .map((bookmark) => (
                <div key={bookmark._id} className="bookmark-item">
                  <div className="workshop-card">
                    <h3>{bookmark.workshop.title}</h3>
                    <p><strong>Organizer:</strong> {bookmark.workshop.organizer}</p>
                    <Link 
                      to="#" 
                      className="view-details-link" 
                      onClick={(e) => {
                        e.preventDefault();
                        openModal(bookmark.workshop);
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal for Internship/Workshop Details */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedItem.title}</h2>
            {selectedItem.company && <p><strong>Company:</strong> {selectedItem.company}</p>}
            {selectedItem.organizer && <p><strong>Organizer:</strong> {selectedItem.organizer}</p>}
            <p><strong>Location:</strong> {selectedItem.location || "N/A"}</p>
            <p><strong>Description:</strong> {selectedItem.description}</p>
            {selectedItem.stipend && <p><strong>Stipend:</strong> {selectedItem.stipend}</p>}
            {selectedItem.duration && <p><strong>Duration:</strong> {selectedItem.duration}</p>}
            <button className="close-modal" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;


