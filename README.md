# 🎓 AlumniLink

**AlumniLink** is a full-stack MERN platform that connects college students with alumni for mentorship, internship referrals, and placement support. It includes dedicated dashboards for students, alumni, and admins.

---

## 🚀 Features

### 👨‍🎓 Student & Alumni Portal
- 📝 **Add/View Internship**
- 🤝 **Referral Requests** — Students can request referrals; alumni can accept/reject.
- 💬 **Mentorship Q&A** — Public, Quora-like forum where students post doubts and alumni answer.
- 🏢 **Company Reviews** — Alumni share insights about their workplaces.
- 📤 **Resource Uploading** — Share notes, PDFs, and helpful content.

### 🛠️ Admin Dashboard
- 📌 **Add Internship / Workshop**
- 📄 **Upload Reports**
- 👥 **Add New Users** (Students or Alumni)
- 💰 **Manage Funds / Dashboard Insights**

### 🔐 Authentication
- 📧 **Email OTP-based login/signup** using **Nodemailer**
- 🔁 **Password Reset** with OTP verification 
- 🔐 Secure routes using JWT

---

## 🧱 Tech Stack

| Layer       | Technology              |
|------------|--------------------------|
| Frontend   | React.js, HTML5, CSS3    |
| Backend    | Node.js, Express.js      |
| Database   | **MongoDB** (Mongoose)   |
| Auth       | Nodemailer, JWT          |
| Dev Tools  | Git, GitHub, Postman     |

---

## 📁 Folder Structure

AlumniLink/
├── frontend/ # React app (student, alumni dashboards)
├── backend/ # Node.js API with Express and MongoDB
├── README.md



---

## ⚙️ Setup Instructions

### 📍 Prerequisites
- Node.js + npm
- MongoDB (local or cloud like MongoDB Atlas)
- Nodemailer email credentials (for OTP)

### 🔧 Installation

1. **Clone the repository**
   git clone https://github.com/AnsuKurian40/AlumniLink.git
   cd AlumniLink
Install frontend dependencies


cd frontend
npm install
Install backend dependencies


cd ../backend
npm install
Configure environment variables

Create a .env file in /backend with:


MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Run the project


# Terminal 1 (backend)
cd backend
npm start

# Terminal 2 (frontend)
cd frontend
npm start
