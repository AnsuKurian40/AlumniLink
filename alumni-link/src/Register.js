import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [step, setStep] = useState(1);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    admissionNumber: "",
    name: "",
    email: "",
    department: "",
    role: "Student",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [additionalData, setAdditionalData] = useState({});
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState({
    profilePicture: null,
    idCard: null,
    idProof: null,
  });
  const navigate = useNavigate();

  // Styles object
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "2rem",
      fontSize: "2rem",
      borderBottom: "2px solid #3498db",
      paddingBottom: "0.5rem",
      display: "inline-block",
    },
    errorMessage: {
      color: "#e74c3c",
      backgroundColor: "#fde8e8",
      padding: "0.8rem",
      borderRadius: "4px",
      marginBottom: "1rem",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    input: {
      padding: "0.8rem",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "1rem",
      width: "100%",
      boxSizing: "border-box",
    },
    select: {
      padding: "0.8rem",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "1rem",
      backgroundColor: "white",
      width: "100%",
    },
    button: {
      padding: "0.8rem",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#3498db",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      width: "100%",
      marginTop: "1rem",
    },
    buttonHover: {
      backgroundColor: "#2980b9",
    },
    passwordStrength: {
      color: "#27ae60",
      margin: "-0.5rem 0 1rem 0",
      fontSize: "0.9rem",
    },
    fileInput: {
      padding: "0.5rem 0",
      width: "100%",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      width: "100%",
    },
    label: {
      fontWeight: "500",
      color: "#2c3e50",
      fontSize: "0.9rem",
    },
    passwordError: {
      color: "#e74c3c",
      fontSize: "0.9rem",
      margin: "-0.5rem 0 1rem 0",
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (e) => {
    setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        admissionNumber: formData.admissionNumber,
        name: formData.name,
        email: formData.email,
      });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Error sending OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email: formData.email,
        otp,
      });
      if (response.data.success) {
        setOtpVerified(true);
        setStep(3);
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed.");
    }
  };

  const validatePasswordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (minLength && hasUpper && hasLower && hasNumber) {
      setPasswordStrength("Strong");
      setPasswordError("");
    } else {
      setPasswordStrength("Weak");
      setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, and a number.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, confirmPassword: value });

    if (value !== formData.password) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpVerified) {
      setError("OTP not verified. Please verify before registration.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formDataWithFiles = new FormData();
    for (const key in formData) {
      formDataWithFiles.append(key, formData[key]);
    }
    for (const key in additionalData) {
      formDataWithFiles.append(key, additionalData[key]);
    }
    if (files.idCard) formDataWithFiles.append("idCard", files.idCard);
    if (files.profilePicture) formDataWithFiles.append("profilePicture", files.profilePicture);
    if (files.idProof) formDataWithFiles.append("idProof", files.idProof);

    try {
      await axios.post("http://localhost:5000/api/register", formDataWithFiles);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      {error && <p style={styles.errorMessage}>{error}</p>}

      {step === 1 && (
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="admissionNumber"
              placeholder="Admission Number"
              required
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="text"
              name="department"
              placeholder="Department"
              required
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); verifyOtp(); }}>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Verify OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              required
              onChange={handlePasswordChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleConfirmPasswordChange}
              style={styles.input}
            />
          </div>

          {passwordError && <p style={styles.passwordError}>{passwordError}</p>}
          {passwordStrength && <p style={styles.passwordStrength}>Password Strength: {passwordStrength}</p>}
          
          <div style={styles.formGroup}>
  <select
    name="gender"
    required
    onChange={handleAdditionalChange}
    style={styles.input}
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>

          
          <div style={styles.formGroup}>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              required
              onChange={handleAdditionalChange}
              style={styles.input}
            />
          </div>

          {formData.role === "Alumni" && (
            <>
              <div style={styles.formGroup}>
                <input
                  type="text"
                  name="currentJobTitle"
                  placeholder="Current Job Title"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="text"
                  name="industry"
                  placeholder="Industry"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="number"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="number"
                  name="graduationYear"
                  placeholder="Graduation Year"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>ID Proof:</label>
                <input
                  type="file"
                  name="idProof"
                  onChange={handleFileChange}
                  required
                  style={styles.fileInput}
                />
              </div>
            </>
          )}

          {formData.role === "Student" && (
            <>
              <div style={styles.formGroup}>
                <input
                  type="text"
                  name="ktuId"
                  placeholder="KTU ID"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="number"
                  name="yearOfAdmission"
                  placeholder="Year of Admission"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="number"
                  name="currentYear"
                  placeholder="Current Year of Study"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <input
                  type="number"
                  name="graduationYear"
                  placeholder="Graduation Year"
                  required
                  onChange={handleAdditionalChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>ID Card:</label>
                <input
                  type="file"
                  name="idCard"
                  onChange={handleFileChange}
                  required
                  style={styles.fileInput}
                />
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              required
              style={styles.fileInput}
            />
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Complete Registration
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;