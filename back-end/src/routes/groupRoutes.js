const express = require("express");
const router = express.Router();
const { getAllGroups, assignProjectToGroup } = require("../controllers/groupController");

// Get all groups
router.get("/", getAllGroups);

// Assign a project to a group
router.post("/assign-project", assignProjectToGroup);

module.exports = router;
