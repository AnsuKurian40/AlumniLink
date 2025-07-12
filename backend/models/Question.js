const mongoose = require("mongoose"); 
 
const QuestionSchema = new mongoose.Schema({ 
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  studentName: { type: String, required: true }, 
  question: { type: String, required: true }, 
  answers: [ 
    { 
      alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
      alumniName: { type: String }, 
      answer: { type: String, required: true }, 
      answeredAt: { type: Date, default: Date.now } 
    } 
  ], 
  ignoredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Alumni who ignored 
  createdAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model("Question", QuestionSchema);