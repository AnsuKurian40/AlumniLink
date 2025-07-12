const mongoose = require("mongoose"); 
 
const projectSchema = new mongoose.Schema({ 
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Referencing either student or alumni 
        required: true, 
      }, 
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  requiredSkills: { type: [String], required: true }, 
  expectedContribution: { type: String, required: true }, 
  collaborationMode: { type: String, enum: ["Online", "Offline"], required: true }, 
  deadline: { type: Date }, 
  status: { type: String, enum: ["Open", "Closed"], default: "Open" }, 
}, { timestamps: true }); 
 
module.exports = mongoose.model("Project", projectSchema);