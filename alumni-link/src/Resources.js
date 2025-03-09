import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Resources.css"; // Add styles if needed

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // ✅ Added description state
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Added missing state 

    // Fetch existing resources from backend
    useEffect(() => {
        axios.get("http://localhost:5000/api/resources")
            .then(response => {
                console.log("Fetched resources:", response.data); // ✅ Debugging log
                setResources(response.data); // ✅ Update state with fetched data
            })
            .catch(error => console.error("Error fetching resources:", error));
    }, []);

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle resource upload
    const handleUpload = async () => {
        if (!file || !title || !description) {  
            alert("Please provide a title, description, and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("📤 Server Response:", response.data); // ✅ Debugging log

            if (response.data.success) {   
                alert("Resource uploaded successfully!");

                // ✅ Update resources state without reload
                const newResource = {
                     title,
                     description,
                     fileUrl: response.data.fileUrl, // ✅ Ensure backend sends this in response
                };

                setResources([...resources, newResource]); // ✅ Update state dynamically
                setTitle("");
                setDescription("");
                setFile(null);
            } else {
                alert("Failed to upload resource.");
            }
        } catch (error) {
            console.error("Error uploading resource:", error);
            alert("Failed to upload resource.");
        }
    };

    // ✅ Fixed: Correct download function
    const handleDownload = async (fileUrl, title) => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: "blob", // Ensures the file is treated as binary data
            });

            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = title || "downloaded_file"; // Use title for filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file.");
        }
    };

    // ✅ Debug: Log resources and search term
    console.log("🔎 Search Term:", searchTerm);
    console.log("📂 Resources:", resources);

    // ✅ Fix: Ensure `resource.title` exists before filtering
    const filteredResources = resources.filter((resource) =>
        resource.title && searchTerm
            ? resource.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true
    );

    return (
        <div className="resources-container">
            <h2>Resources</h2>

            {/* Upload Section (Visible to Alumni) */}
            <div className="upload-section">
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>

            {/* ✅ Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Resource List (Visible to Everyone) */}
            <div className="resource-list">
                <h3>Available Resources</h3>
                <ul>
                    {filteredResources.length > 0 ? (
                        filteredResources.map((resource, index) => (
                            <li key={index}>
                                <strong>{resource.title}</strong> - {resource.description}
                                {/* ✅ Fixed Download Button */}
                                {/* <a href={resource.fileUrl} download={resource.title}> */}
                                <a href={`http://localhost:5000/uploads/${resource.fileUrl}`} download={resource.title}>
                                  <button>Download</button>
                              </a>

                            </li>
                        ))
                    ) : (
                        <p>❌ No matching resources found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Resources;
