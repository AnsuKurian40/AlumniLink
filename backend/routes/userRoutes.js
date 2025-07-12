const express = require("express");
const { getAlumniProfile, updateAlumniProfile } = require("../controllers/AlumniController");

const router = express.Router();

router.get("/profile", getAlumniProfile);
router.put("/updateProfile", updateAlumniProfile);

module.exports = router;
