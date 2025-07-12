import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchYear, setSearchYear] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports");
      setReports(response.data);
      setFilteredReports(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map((report) => report.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Handle category filter
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterReports(event.target.value, searchYear);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchYear(event.target.value);
    filterReports(selectedCategory, event.target.value);
  };

  // Filtering function
  const filterReports = (category, year) => {
    let filtered = reports;

    if (category !== "All") {
      filtered = filtered.filter((report) => report.category === category);
    }

    if (year.trim() !== "") {
      filtered = filtered.filter((report) => new Date(report.date).getFullYear().toString() === year);
    }

    setFilteredReports(filtered);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="reports-container">
      <h1 className="title">📜 Reports</h1>

      <div className="filters">
        <select className="filter-dropdown" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        <input
          type="text"
          className="search-bar"
          placeholder="Search by Year (e.g. 2023)"
          value={searchYear}
          onChange={handleSearchChange}
        />
      </div>

      <div className="reports-grid">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report._id}
              className={`report-card ${expandedId === report._id ? "expanded" : ""}`}
              onClick={() => toggleExpand(report._id)}
            >
              <h2 className="report-title">{report.title}</h2>
              {expandedId === report._id && (
                <div className="report-details">
                  {report.document && (
                    <a href={`http://localhost:5000${report.document}`} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  )}
                  <p className="report-description">{report.description}</p>
                  <p className="report-category">📂 {report.category}</p>
                  <p className="report-date">📅 {new Date(report.date).toDateString()}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-reports">No reports found 😕</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
