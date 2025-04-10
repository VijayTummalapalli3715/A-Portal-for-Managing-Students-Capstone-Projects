const express = require("express");
const {
  getAllProjects,
  addProject,
  getClientProjects,
  getRecommendedProjects,
  getProjectById,
  updateProject
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/recommended", getRecommendedProjects);

// Protected routes
router.get("/client", protect, getClientProjects);
router.post("/", protect, addProject);
router.get("/:id", protect, getProjectById);     // must come after /client
router.put("/:id", protect, updateProject);

module.exports = router;
