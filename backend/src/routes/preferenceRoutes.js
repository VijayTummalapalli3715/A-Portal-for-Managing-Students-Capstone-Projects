const express = require("express");
const { addPreference, getStudentPreferences, rankPreferences, removePreference } = require("../controllers/preferenceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Logging middleware for debugging
router.use((req, res, next) => {
  console.log('Preference Route Request:', {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Student adds a project as preference
router.post("/", protect, addPreference);

// Student views his/her own preferences
router.get("/student", protect, getStudentPreferences);

// Student ranks their preferred projects
router.post("/rank", protect, rankPreferences);

// Student removes a project from preferences
router.delete("/", protect, removePreference);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Preference Route Error:', {
    method: req.method,
    path: req.path,
    error: err
  });
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

module.exports = router;