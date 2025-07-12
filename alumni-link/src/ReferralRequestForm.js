import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./ReferralRequestForm.css";

const ReferralRequestForm = () => {
  const { internshipId } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [alumniId, setAlumniId] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/internships/${internshipId}`);
        const fetchedAlumniId = response.data.alumniId || 
                              response.data.postedBy?._id || 
                              response.data.postedBy;
        
        if (!fetchedAlumniId) {
          throw new Error('No alumni associated with this internship');
        }
        
        setAlumniId(fetchedAlumniId);
        setFetching(false);
      } catch (err) {
        console.error('Error fetching internship:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load internship details');
        setFetching(false);
        navigate('/internships');
      }
    };

    fetchInternshipDetails();
  }, [internshipId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      if (!resume) {
        throw new Error('Resume required');
      }

      if (!alumniId) {
        throw new Error('No valid alumni recipient found');
      }

      const formData = new FormData();
      formData.append('studentId', userId);
      formData.append('alumniId', alumniId);
      formData.append('internshipId', internshipId);
      formData.append('message', message);
      formData.append('resume', resume);

      const response = await axios.post('http://localhost:5000/api/referrals', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      sessionStorage.setItem("referralSubmitted", "true");
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/referrals', { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response?.data?.error === "You have already requested a referral for this internship") {
        setError(`You've already requested a referral for this internship (Status: ${err.response.data.existingStatus})`);
        setTimeout(() => {
          navigate('/student/referrals');
        }, 3000);
      } else {
        setError(err.response?.data?.error || err.message || 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Only PDF/DOC/DOCX files allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be smaller than 5MB');
      return;
    }

    setResume(file);
    setError('');
  };

  if (fetching) return <div className="loading-state">Loading internship details...</div>;
  if (error && !error.includes("already requested")) return <div className="error-message">{error}</div>;

  return (
    <div className="referral-form-container">
      <h2 className="referral-form-title">Request Referral</h2>
      
      {success ? (
        <div className="success-message">
          <p>Request sent successfully!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="referral-form">
          {error && (
            <div className={`error-message ${error.includes("already requested") ? "warning-message" : ""}`}>
              {error}
              {error.includes("already requested") && (
                <p>Redirecting to your referrals page...</p>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Why should you be referred?</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
              rows="5"
              required
              placeholder="Explain why you're a good fit for this opportunity..."
              disabled={error.includes("already requested")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Resume</label>
            <div className="file-input-container">
              <label className="file-input-label">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept=".pdf,.doc,.docx"
                  required
                  disabled={error.includes("already requested")}
                />
                <div className="file-input-text">
                  <span className="file-input-icon">📄</span>
                  <span>{resume ? 'Change file' : 'Click to upload'}</span>
                  <span className="file-hint">PDF, DOC, or DOCX (Max 5MB)</span>
                </div>
              </label>
              {resume && (
                <p className="file-selected">Selected: {resume.name}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim() || !resume || !alumniId || error.includes("already requested")}
            className="submit-btn"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReferralRequestForm;