const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String // Either "Student" or "Alumni"
});

const User = mongoose.model("User", userSchema);
module.exports = User;
