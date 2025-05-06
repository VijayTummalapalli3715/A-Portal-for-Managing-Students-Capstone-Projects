const express = require("express");
const { previewGroups, createGroups, getPreferenceStatistics } = require("../controllers/groupFormationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Only instructors can access these routes
const instructorOnly = (req, res, next) => {
  if (req.user.db.role !== "Instructor") {
    return res.status(403).json({ error: "Access denied. Only instructors can perform this action." });
  }
  next();
};

// Get a preview of how groups would be formed with a specific group size
router.get("/preview", protect, instructorOnly, previewGroups);

// Create groups automatically and save them to the database
router.post("/create", protect, instructorOnly, createGroups);

// Get statistics about student preferences
router.get("/statistics", protect, instructorOnly, getPreferenceStatistics);

module.exports = router;
