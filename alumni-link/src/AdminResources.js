import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaDownload } from "react-icons/fa";
import "./Resources.css";

const AdminResources = () => {
    const [resources, setResources] = useState([]);

    // ✅ Fetch all resources
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/resources");
            setResources(response.data);
        } catch (error) {
            console.error("❌ Error fetching resources:", error);
        }
    };

    // ✅ Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
        try {
            await axios.delete(`http://localhost:5000/api/admin/resources/${id}`);
    
            // ✅ Update state after deletion
            setResources((prevResources) => prevResources.filter(resource => resource._id !== id));
    
            // ✅ Show success message
            alert("✅ Resource deleted successfully!");
    
        } catch (error) {
            console.error("❌ Error deleting resource:", error);
            alert("❌ Failed to delete resource. Please try again.");
        }
    };
    

    return (
        <div className="resources-container">
            <h2>Admin Resources</h2>
            {resources.length === 0 ? (
                <p>❌ No resources found.</p>
            ) : (
                <table className="resource-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>View</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((resource) => {
                            const fileUrl = `http://localhost:5000${resource.fileUrl.replace(/^\/uploads\//, "/uploads/")}`;


                        

                            return (
                                <tr key={resource._id}>
                                    <td>{resource.title}</td>
                                    <td>{resource.description}</td>

                                    {/* ✅ View Resource */}
                                    <td>
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <FaEye className="action-icon view-icon" />
                                        </a>
                                    </td>

                                    {/* ✅ Download Resource */}
                                    <td>
                                        <a href={fileUrl} download>
                                            <FaDownload className="action-icon download-icon" />
                                        </a>
                                    </td>

                                    {/* ✅ Delete Resource */}
                                    <td>
                                        <button onClick={() => handleDelete(resource._id)} className="delete-btn">
                                            <FaTrash className="action-icon delete-icon" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminResources;

