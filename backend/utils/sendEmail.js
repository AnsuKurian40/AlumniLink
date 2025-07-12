const express = require("express");
const router = express.Router();
const ReferralRequest = require("../models/ReferralRequest");
const sendEmail = require("../utils/sendEmail");
const auth = require("../middleware/auth");

// Send Referral Request
router.post("/request", auth, async (req, res) => {
  try {
    const { internshipId, description, alumniId } = req.body;

    const newRequest = new ReferralRequest({
      student: req.user.id,
      alumni: alumniId,
      internship: internshipId,
      description,
    });

    await newRequest.save();

    // Send email to alumni
    await sendEmail(alumniId, "New Referral Request", `A student has requested a referral for an internship. Description: ${description}`);

    res.status(201).json({ message: "Referral request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get requests for Alumni
router.get("/alumni-requests", auth, async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ alumni: req.user.id }).populate("student internship");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Accept or Reject Referral Request
router.put("/update/:requestId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ReferralRequest.findById(req.params.requestId);

    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = status;
    await request.save();

    res.json({ message: `Referral request ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Student Requests
router.get("/student-requests", auth, async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ student: req.user.id }).populate("internship");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
