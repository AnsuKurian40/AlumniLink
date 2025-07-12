import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Import bookmark icons
import "./ViewWorkshops.css";

const ViewWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    duration: "",
  });
  const [bookmarks, setBookmarks] = useState([]); // State for bookmarks

  useEffect(() => {
    fetchWorkshops();
    fetchBookmarks(); // Fetch bookmarks when the component loads
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workshops/all");
      setWorkshops(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError("Failed to fetch workshops. Please try again.");
      setLoading(false);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookmarks/my-bookmarks");
      setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  // Check if a workshop is bookmarked
  const isBookmarked = (id) => {
    return bookmarks.some((bookmark) => bookmark.workshop?._id === id);
  };

  // Handle bookmark/unbookmark
  const handleBookmark = async (id) => {
    try {
      const endpoint = isBookmarked(id) ? `/api/bookmarks/remove/${id}` : "/api/bookmarks/add";
      const response = await axios.post(endpoint, { workshopId: id });

      if (response.data.message === "Bookmark added successfully") {
        setBookmarks([...bookmarks, response.data.bookmark]);
      } else if (response.data.message === "Bookmark removed successfully") {
        setBookmarks(bookmarks.filter((bookmark) => bookmark.workshop?._id !== id));
      }
    } catch (err) {
      console.error("Error bookmarking workshop:", err);
    }
  };

  const currentDate = new Date();

  // Filter workshops based on search query and filters
  const filteredWorkshops = workshops
    .filter((workshop) => new Date(workshop.date) >= currentDate) // Exclude past workshops
    .filter((workshop) => {
      const matchesSearchQuery =
        workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workshop.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters =
        (!filters.date || new Date(workshop.date) >= new Date(filters.date)) &&
        (!filters.duration || workshop.duration === filters.duration);

      return matchesSearchQuery && matchesFilters;
    });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (loading) {
    return <p>Loading workshops...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="workshops-container">
      <h2>Available Workshops</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search workshops..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      {/* Filters */}
      {/* <div className="filters">
        <input
          type="date"
          placeholder="Date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Duration"
          name="duration"
          value={filters.duration}
          onChange={handleFilterChange}
        />
      </div> */}
      {filteredWorkshops.length === 0 ? (
        <p>No workshops found.</p>
      ) : (
        <ul className="workshops-list">
          {filteredWorkshops.map((workshop) => (
            <li key={workshop._id} className="workshop-item">
              <h3>{workshop.title}</h3>
              <p><strong>Description:</strong> {workshop.description}</p>
              <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {workshop.duration}</p>
              <p><strong>Location:</strong> {workshop.location}</p>
              <p><strong>Organizer:</strong> {workshop.organizer}</p>
              <p><strong>Application Link:</strong> <a href={workshop.applicationLink} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
              <p><strong>Posted By:</strong> {workshop.postedBy?.name}</p>
              {/* Bookmark Icon */}
              {/* <button
                className="bookmark-button"
                onClick={() => handleBookmark(workshop._id)}
              >
                {isBookmarked(workshop._id) ? <FaBookmark /> : <FaRegBookmark />}
              </button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewWorkshops;

