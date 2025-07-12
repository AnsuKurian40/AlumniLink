const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    companyName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Review", reviewSchema);
