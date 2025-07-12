const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs"); 
 
const userSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true, trim: true }, 
    password: { type: String, required: true, minlength: 6 }, 
    role: { type: String, enum: ["Student", "Alumni"], required: true } 
}, { timestamps: true }); 
 
// Hash password before saving (This is already correct) 
userSchema.pre("save", async function (next) { 
    next(); 
}); 
 
const User = mongoose.model("User", userSchema); 
module.exports = User; 