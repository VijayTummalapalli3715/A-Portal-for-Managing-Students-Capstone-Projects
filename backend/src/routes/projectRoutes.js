// backend/src/routes/projectRoutes.js
const express = require("express");
const {
  getAllProjects,
  addProject,
  getClientProjects,
  getRecommendedProjects
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (optional)
router.get("/", getAllProjects);
router.get("/recommended", getRecommendedProjects);

// 🔒 Secure client-specific routes with protect middleware
router.get("/client", protect, getClientProjects); // removed :clientId
router.post("/", protect, addProject);             // add project needs auth

module.exports = router;
