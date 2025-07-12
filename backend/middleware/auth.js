const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path

const verifyToken = async (req, res, next) => {
    console.log("🟢 Incoming Auth Header:", req.headers.authorization); // Debugging

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No token provided!");
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", decoded);

        // Fetch user details from DB if `name` is missing
        let userData = { id: decoded.userId, name: decoded.name, role: decoded.role };
        if (!decoded.name) {
            console.log("🔍 Fetching user details from DB...");
            const user = await User.findById(decoded.userId).select("name role");

            if (!user) {
                console.log("❌ User not found in DB");
                return res.status(404).json({ error: "User not found" });
            }

            userData.name = user.name; // Update name from DB
            userData.role = user.role; // Ensure role is correct
        }

        req.user = userData; // Attach user data to `req.user`
        console.log("✅ User attached to request:", req.user);

        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;