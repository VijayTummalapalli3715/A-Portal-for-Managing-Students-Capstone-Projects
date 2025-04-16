const express = require("express");
const { getAssignedProject } = require("../controllers/assignedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/assigned", protect, getAssignedProject);

module.exports = router;
