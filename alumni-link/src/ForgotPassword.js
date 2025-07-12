import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, { email });
      setStep(2);
      setSuccess(response.data.message || "OTP sent to your email");
    } catch (error) {
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to send OTP. Please try again later."
      );
      console.error("OTP send error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-otp`, { email, otp });
      setStep(3);
      setSuccess(response.data.message || "OTP verified successfully");
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid OTP. Please check and try again."
      );
      console.error("OTP verification error:", {
        error: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/reset-password`, {
        email,
        otp,
        newPassword
      });
      setSuccess(response.data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
      console.error("Password reset error:", {
        error: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                autoComplete="email"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
              aria-label="Send OTP"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span> Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="form-input"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <p className="hint-text">Check your email for the 6-digit code</p>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
              aria-label="Verify OTP"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="form-input"
                autoComplete="new-password"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
              aria-label="Reset Password"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;