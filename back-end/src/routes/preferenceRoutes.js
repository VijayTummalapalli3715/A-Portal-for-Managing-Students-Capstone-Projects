const express = require("express");
const { addPreference, getPreferences } = require("../controllers/preferenceController");
const { protect } = require("../middleware/authMiddleware"); // Ensure authentication

const router = express.Router();

// Route for students to add their preferred projects (POST request)
router.post("/", protect, addPreference);

// Route to get all preferences (GET request)
router.get("/", protect, getPreferences);

module.exports = router;
