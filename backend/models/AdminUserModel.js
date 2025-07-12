const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },// Check if email is included
  role: { type: String, enum: ["Alumni", "Student"], required: true }

});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
module.exports = AdminUser;



