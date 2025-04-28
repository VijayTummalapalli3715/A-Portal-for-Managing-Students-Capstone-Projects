const express = require("express");
const { addPreference, getStudentPreferences } = require("../controllers/preferenceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Student adds a project as preference
router.post("/", protect, addPreference);

// Student views his/her own preferences
router.get("/student", protect, getStudentPreferences);

module.exports = router;