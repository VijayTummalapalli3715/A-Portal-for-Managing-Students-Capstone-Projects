const express = require("express");
const router = express.Router();
const { getAllProjects, addProject, getClientProjects } = require("../controllers/projectController");

// Get all projects
router.get("/", getAllProjects);

// Get projects assigned to a specific client
router.get("/client/:clientId", getClientProjects);

// Add a new project
router.post("/", addProject);

module.exports = router;
