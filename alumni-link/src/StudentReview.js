import React, { useState, useEffect } from "react";
import "./StudentReview.css";

function StudentReview() {
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // ✅ Load reviews from localStorage
        const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        setReviews(storedReviews);
    }, []);

    return (
        <div className="student-review-container">
            <h2>Company Reviews</h2>

            {/* ✅ Search Bar */}
            <input 
                type="text" 
                placeholder="Search by Company Name" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />

            {/* ✅ Filtered Reviews */}
            <div className="review-list">
                {reviews
                    .filter(review => review.company.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((review, index) => (
                        <div key={index} className="review-card">
                            <h3>{review.company}</h3>
                            <p><strong>Designation:</strong> {review.designation}</p>
                            <p>{review.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default StudentReview;