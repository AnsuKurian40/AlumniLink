const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2NhYzIzY2ZiMWZjOTYxZTViN2FhOTgiLCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc0MTM3MDY2NywiZXhwIjoxNzQxMzc0MjY3fQ.kc2kA88sQXU1FmeNreKwp3wdpx--H19RrAu_yEmKw8Q"; // 🔹 Replace with your actual token from localStorage
const secret = process.env.JWT_SECRET; // 🔹 Ensure this matches your .env JWT_SECRET

try {
    const decoded = jwt.verify(token, secret);
    console.log("✅ Token is valid. Decoded Token:", decoded);
} catch (error) {
    console.error("❌ Invalid Token:", error.message);
}
