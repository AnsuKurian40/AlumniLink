import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [isAlumni, setIsAlumni] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser] = useState(localStorage.getItem('userId') === userId);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Check if user is Alumni or Student
                const typeResponse = await axios.get(`http://localhost:5000/api/profile/user-type/${userId}`);
                const isAlumniUser = typeResponse.data.isAlumni;
                setIsAlumni(isAlumniUser);
                
                // Fetch profile data
                const endpoint = isAlumniUser 
                    ? `http://localhost:5000/api/profile/alumni/${userId}`
                    : `http://localhost:5000/api/profile/student/${userId}`;
                
                const response = await axios.get(endpoint);
                setProfileData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!profileData) return <div>Profile not found</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture-upload">
                    <div className="image-preview">
                        {profileData.profilePicture ? (
                            <img 
                                src={`http://localhost:5000/${profileData.profilePicture}`} 
                                alt="Profile" 
                                className="preview-image"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = '';
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="placeholder">
                                {profileData.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="profile-info">
                    <h1>{profileData.name}</h1>
                    <p className="email">{profileData.email}</p>
                    <p className="gender">Gender: {profileData.gender}</p>
                    <p className="dob">DOB: {new Date(profileData.dob).toLocaleDateString()}</p>
                    
                    {currentUser && (
                        <Link to={`/edit-profile/${userId}`} className="edit-profile-btn">
                            Edit Profile
                        </Link>
                    )}
                </div>
            </div>
            
            {isAlumni ? (
                <div className="profile-details">
                    <h2>Professional Information</h2>
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Admission Number</span>
                            <span className="detail-value">{profileData.admissionNumber}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Graduation Year</span>
                            <span className="detail-value">{profileData.graduationYear}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Current Job Title</span>
                            <span className="detail-value">{profileData.currentJobTitle}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Industry</span>
                            <span className="detail-value">{profileData.industry}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Years of Experience</span>
                            <span className="detail-value">{profileData.yearsOfExperience} years</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">LinkedIn</span>
                            <a 
                                href={profileData.linkedInProfile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="detail-value link"
                            >
                                {profileData.linkedInProfile ? 'View Profile' : 'Not Provided'}
                            </a>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Proof</span>
                            {profileData.idProof ? (
                                <a 
                                    href={`http://localhost:5000/${profileData.idProof}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="detail-value link"
                                >
                                    View ID Proof
                                </a>
                            ) : (
                                <span className="detail-value">Not Uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="profile-details">
                    <h2>Academic Information</h2>
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Admission Number</span>
                            <span className="detail-value">{profileData.admissionNumber}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Department</span>
                            <span className="detail-value">{profileData.department}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Current Year</span>
                            <span className="detail-value">{profileData.currentYear}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Roll Number</span>
                            <span className="detail-value">{profileData.rollNumber}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">KTU ID</span>
                            <span className="detail-value">{profileData.ktuId}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Graduation Year</span>
                            <span className="detail-value">{profileData.graduationYear}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Card</span>
                            {profileData.idCard ? (
                                <a 
                                    href={`http://localhost:5000/${profileData.idCard}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="detail-value link"
                                >
                                    View ID Card
                                </a>
                            ) : (
                                <span className="detail-value">Not Uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;