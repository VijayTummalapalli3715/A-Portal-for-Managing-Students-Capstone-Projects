const express = require("express");
const router = express.Router();
const { getAllProjects, addProject, getClientProjects } = require("../controllers/projectController");
const { getRecommendedProjects } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Public route: Get all projects
router.get("/", getAllProjects);

// ✅ Public route: Get latest 3 projects for dashboard
router.get("/recommended", getRecommendedProjects);

// ✅ Public route: Get projects for a specific client
router.get("/client/:clientId", getClientProjects);

// ✅ Protected route: Add project (only for authenticated users)
router.post("/", protect, addProject);

module.exports = router;
