const express = require("express");
const { getAssignedProject } = require("../controllers/assignedController");
const { protect } = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

// Get student's assigned project
router.get("/assigned-project", protect, getAssignedProject);

// Get student's preferences
router.get("/preferences", protect, async (req, res) => {
  try {
    const studentId = req.user.db.id;
    console.log("Fetching preferences for student ID:", studentId);

    // Get the student's preferences
    const [preferences] = await db.execute(`
      SELECT 
        sp.id,
        sp.student_id,
        sp.project_id,
        sp.preference_order,
        sp.assigned_project_id,
        p.title as project_title
      FROM student_preferences sp
      JOIN projects p ON sp.project_id = p.id
      WHERE sp.student_id = ?
      ORDER BY sp.preference_order
    `, [studentId]);

    console.log("Student preferences found:", preferences);

    // Check if any preferences have an assigned project
    const assignedProjectId = preferences.find(p => p.assigned_project_id)?.assigned_project_id;
    console.log("Assigned project ID:", assignedProjectId);

    // If there's an assigned project, get its details
    let assignedProject = null;
    if (assignedProjectId) {
      const [projectDetails] = await db.execute(`
        SELECT 
          p.*,
          u.name as client_name
        FROM projects p
        JOIN users u ON p.client_id = u.id
        WHERE p.id = ?
      `, [assignedProjectId]);

      if (projectDetails && projectDetails.length > 0) {
        assignedProject = projectDetails[0];
        console.log("Assigned project details:", assignedProject);
      }
    }

    res.json({
      success: true,
      preferences,
      assignedProject
    });

  } catch (error) {
    console.error("Error fetching student preferences:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student preferences",
      error: error.message
    });
  }
});

module.exports = router;
