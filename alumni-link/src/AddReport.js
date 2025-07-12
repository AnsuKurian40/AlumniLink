import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddReport.css";

const AddReport = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [document, setDocument] = useState(null);

    const [reports, setReports] = useState([]);

    // Handle File Selection
    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        setDocument(file);
    };
    

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("year", year);
        formData.append("month", month);
        if (document) {
            formData.append("document", document);
        }

        
            const token = localStorage.getItem("adminToken");
           // const token = localStorage.getItem("adminToken");
            console.log("Token being sent in request:", token); // Log token
            try {
            await axios.post("http://localhost:5000/api/reports/add-report", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Report added successfully!");
            fetchReports();
        } catch (error) {
            alert("Failed to add report");
        }
    };

    // Fetch Reports
    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get("http://localhost:5000/api/reports/get-reports", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="reports-container">
            {/* Add Report Section */}
            <div className="add-report-section">
                <h2>Add Report</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select Category</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Alumni Meetups">Alumni Meetups</option>
                        <option value="Cultural Events">Cultural Events</option>
                        <option value="Others">Others</option>
                    </select>
                    <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                    <input type="number" placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} required />
                    <input type="file" onChange={handleDocumentChange} accept="application/pdf" />
                    <button type="submit">Add Report</button>
                </form>
            </div>

            {/* Reports List Section */}
            <div className="reports-list-section">
                <h2>Reports List</h2>
                <ul className="reports-list">
                    {reports.map((report) => (
                        <li key={report._id} className="report-card">
                            <div className="report-content">
                                <h3 className="report-title">{report.title}</h3>
                                <p className="report-description">{report.description}</p>
                                {report.document && (
                                    <a href={`http://localhost:5000${report.document}`} target="_blank" rel="noopener noreferrer">
                                        View Document
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default AddReport;

