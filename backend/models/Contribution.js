const mongoose = require("mongoose"); 
const contributionSchema = new mongoose.Schema({ 
requestId: { type: mongoose.Schema.Types.ObjectId, ref: "FundRequest", required: true }, 
alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
amount: { type: Number, required: true }, 
paymentScreenshot: { type: String, required: true }, 
}, { timestamps: true }); 
const Contribution = mongoose.model("Contribution", contributionSchema); 
module.exports = Contribution;