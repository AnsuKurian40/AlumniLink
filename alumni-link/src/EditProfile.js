import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import './EditProfile.css';

const EditProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        dob: '',
        department: '',
        graduationYear: '',
        company: '',
        currentJobTitle: '',
        industry: '',
        yearsOfExperience: '',
        linkedInProfile: '',
        admissionNumber: '',
        currentYear: '',
        rollNumber: '',
        ktuId: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isAlumni, setIsAlumni] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Check user type
                const typeResponse = await axios.get(`http://localhost:5000/api/profile/user-type/${userId}`);
                setIsAlumni(typeResponse.data.isAlumni);
                
                // Fetch existing profile data
                const endpoint = typeResponse.data.isAlumni 
                    ? `http://localhost:5000/api/profile/alumni/${userId}`
                    : `http://localhost:5000/api/profile/student/${userId}`;
                
                const response = await axios.get(endpoint);
                setFormData(response.data);
                
                // Set preview image if profile picture exists
                if (response.data.profilePicture) {
                    setPreviewImage(`http://localhost:5000/${response.data.profilePicture}`);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Append all form data
            for (const key in formData) {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            }
            
            // Append profile picture if selected
            if (profilePicture) {
                formDataToSend.append('profilePicture', profilePicture);
            }

            const endpoint = isAlumni 
                ? `http://localhost:5000/api/profile/alumni/${userId}`
                : `http://localhost:5000/api/profile/student/${userId}`;
            
            await axios.put(endpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            navigate(`/profile/${userId}`);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div className="loading">Loading profile data...</div>;

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Profile Picture Upload Section */}
                <div className="form-group profile-picture-upload">
                    <label>Profile Picture</label>
                    <div className="image-preview-container">
                        <div className="image-preview">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile Preview" className="preview-image" />
                            ) : (
                                <div className="placeholder">
                                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                        </div>
                        <div className="camera-icon" onClick={triggerFileInput}>
                            <FaCamera />
                        </div>
                        <input 
                            id="profilePictureInput"
                            type="file" 
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>
                </div>

                {/* Common fields for all users */}
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Date of Birth</label>
                    <input 
                        type="date" 
                        name="dob" 
                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Department</label>
                    <input 
                        type="text" 
                        name="department" 
                        value={formData.department} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Admission Number</label>
                    <input 
                        type="text" 
                        name="admissionNumber" 
                        value={formData.admissionNumber || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {isAlumni ? (
                    <>
                        {/* Alumni-specific fields */}
                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input 
                                type="text" 
                                name="graduationYear" 
                                value={formData.graduationYear || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <input 
                                type="text" 
                                name="company" 
                                value={formData.company || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Job Title</label>
                            <input 
                                type="text" 
                                name="currentJobTitle" 
                                value={formData.currentJobTitle || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Industry</label>
                            <input 
                                type="text" 
                                name="industry" 
                                value={formData.industry || ''} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input 
                                type="number" 
                                name="yearsOfExperience" 
                                value={formData.yearsOfExperience || ''} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn Profile</label>
                            <input 
                                type="url" 
                                name="linkedInProfile" 
                                value={formData.linkedInProfile || ''} 
                                onChange={handleChange} 
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Student-specific fields */}
                        <div className="form-group">
                            <label>Current Year</label>
                            <input 
                                type="text" 
                                name="currentYear" 
                                value={formData.currentYear || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Roll Number</label>
                            <input 
                                type="text" 
                                name="rollNumber" 
                                value={formData.rollNumber || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>KTU ID</label>
                            <input 
                                type="text" 
                                name="ktuId" 
                                value={formData.ktuId || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input 
                                type="text" 
                                name="graduationYear" 
                                value={formData.graduationYear || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="save-button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;