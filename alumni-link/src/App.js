import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import FrontPage from "./FrontPage"; 
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Resources from "./Resources";
import AlumniReview from "./AlumniReview";
import StudentReview from "./StudentReview";
import "./App.css";

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

function AppWrapper() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/" || location.pathname === "/register";
    const [userType, setUserType] = useState(localStorage.getItem("userType") ?? "student");

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType") ?? "student";
        console.log("Stored userType in localStorage:", storedUserType);
        setUserType(storedUserType);
    }, []);

    console.log("Current userType:", userType);

    return (
        <div className={isAuthPage ? "auth-background" : "dashboard-background"}>
            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resources" element={<Resources />} />

                {/* ✅ Separate paths instead of conditional rendering */}
                <Route path="/AlumniReview" element={<AlumniReview />} />
                <Route path="/StudentReview" element={<StudentReview />} />
            </Routes>
        </div>
    );
}

export default App;
