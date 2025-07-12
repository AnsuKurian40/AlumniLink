import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaTrash } from "react-icons/fa";
import "./Resources.css";

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null); // Initially null

    useEffect(() => {
        const userId = localStorage.getItem("userId"); // Adjust based on your auth setup
        setLoggedInUser(userId);
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/resources");
            setResources(response.data);
        } catch (error) {
            console.error("❌ Error fetching resources:", error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !title || !description) {
            alert("Please provide a title, description, and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);
        formData.append("uploadedBy", loggedInUser);

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                alert("✅ Resource uploaded successfully!");
                const newResource = {
                    _id: response.data._id,
                    title,
                    description,
                    fileUrl: response.data.fileUrl,
                    uploadedBy: loggedInUser
                };
                setResources([...resources, newResource]);
                setTitle("");
                setDescription("");
                setFile(null);
            } else {
                alert("❌ Failed to upload resource.");
            }
        } catch (error) {
            console.error("❌ Error uploading resource:", error);
            alert("❌ Failed to upload resource.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/resources/${id}`);
            setResources(resources.filter(resource => resource._id !== id));
            alert("✅ Resource deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting resource:", error);
            alert("❌ Failed to delete resource.");
        }
    };

    const filteredResources = resources.filter((resource) =>
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="resources-container">
            <h2>Resources</h2>
            <div className="upload-section">
                <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="resource-list">
                <h3>Available Resources</h3>
                {filteredResources.length === 0 ? (
                    <p>❌ No resources found.</p>
                ) : (
                    <table className="resource-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Download</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResources.map((resource) => {
                                const fileUrl = `http://localhost:5000${resource.fileUrl.replace(/^\/uploads\//, "/uploads/")}`;

                                console.log(`🔍 Checking resource:`, {
                                    resourceId: resource._id,
                                    uploadedBy: resource.uploadedBy,
                                    loggedInUser: loggedInUser
                                });

                                return (
                                    <tr key={resource._id}>
                                        <td>{resource.title}</td>
                                        <td>{resource.description}</td>
                                        <td>
                                            <a href={fileUrl} download>
                                                <FaDownload className="action-icon download-icon" />
                                            </a>
                                        </td>
                                        <td>
                                            {resource.uploadedBy === loggedInUser && (
                                                <FaTrash className="action-icon delete-icon" onClick={() => handleDelete(resource._id)} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Resources;



