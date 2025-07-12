import React, { useState } from "react";
import "./AlumnilinkReview.css";
function AlumniReview() {
    const [company, setCompany] = useState("");
    const [designation, setDesignation] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Save to localStorage (or send to backend later)
        const newReview = { company, designation, description };
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push(newReview);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        // ✅ Clear fields after submission
        setCompany("");
        setDesignation("");
        setDescription("");

        alert("Review submitted successfully!");
    };

    return (
        <div className="alumni-review-container">
            <h2>Post a Review</h2>
            <form onSubmit={handleSubmit}>
                <label>Company Name:</label>
                <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    required 
                />

                <label>Designation:</label>
                <input 
                    type="text" 
                    value={designation} 
                    onChange={(e) => setDesignation(e.target.value)} 
                    required 
                />

                <label>Description:</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />

                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default AlumniReview
