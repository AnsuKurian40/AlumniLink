const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://localhost:27017/alumnilink", { useNewUrlParser: true, useUnifiedTopology: true });

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new Admin({ email: "admin@alumnilink.com", password: hashedPassword });

  await admin.save();
  console.log("Admin Created");
  mongoose.connection.close();
};

createAdmin();







