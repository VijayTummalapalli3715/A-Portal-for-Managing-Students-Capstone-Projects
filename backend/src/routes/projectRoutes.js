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
const db = require("../db");

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/recommended", getRecommendedProjects);

// Protected routes
router.get("/client", protect, getClientProjects);
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.db.id;
    const userRole = req.user.db.role;
    const {
      title,
      description,
      requirements,
      main_category,
      sub_category,
      skills_required,
      resources,
      max_team_size,
      deadline
    } = req.body;

    // For client projects, set initial status as pending
    const status = userRole === 'Client' ? 'pending' : 'approved';

    const [result] = await db.execute(
      `INSERT INTO projects (
        title, description, requirements, main_category, sub_category,
        skills_required, resources, max_team_size, deadline, client_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, requirements, main_category, sub_category,
        skills_required, resources, max_team_size, deadline, userId, status
      ]
    );

    // If project is created by client, create notification for instructors
    if (userRole === 'Client') {
      const [instructors] = await db.execute(
        "SELECT id FROM users WHERE role = 'Instructor'"
      );

      // Create notifications for each instructor
      for (const instructor of instructors) {
        await db.execute(
          `INSERT INTO notifications (
            user_id, type, content, project_id, created_at
          ) VALUES (?, 'project_approval', ?, ?, NOW())`,
          [instructor.id, `New project "${title}" needs approval`, result.insertId]
        );
      }
    }

    res.status(201).json({
      message: "Project created successfully",
      projectId: result.insertId
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", protect, getProjectById);     // must come after /client
router.put("/:id", protect, updateProject);

// Update project approval status (instructors only)
router.put("/:projectId/approval", protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.db.id;

    // Verify user is an instructor
    if (req.user.db.role !== 'Instructor') {
      return res.status(403).json({ message: "Only instructors can approve/reject projects" });
    }

    // Update project status
    await db.execute(
      "UPDATE projects SET status = ?, feedback = ? WHERE id = ?",
      [status, feedback, projectId]
    );

    // Get project and client details
    const [project] = await db.execute(
      `SELECT p.*, u.id as client_id, u.name as client_name 
       FROM projects p 
       JOIN users u ON p.client_id = u.id 
       WHERE p.id = ?`,
      [projectId]
    );

    // Create notification for the client
    if (project[0]) {
      await db.execute(
        `INSERT INTO notifications (
          user_id, type, content, project_id, created_at
        ) VALUES (?, 'project_status', ?, ?, NOW())`,
        [
          project[0].client_id,
          `Your project "${project[0].title}" has been ${status}`,
          projectId
        ]
      );
    }

    res.json({ message: `Project ${status} successfully` });
  } catch (error) {
    console.error("Error updating project approval:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get project notifications
router.get("/notifications", protect, async (req, res) => {
  try {
    const userId = req.user.db.id;

    const [notifications] = await db.execute(
      `SELECT n.*, p.title as project_title
       FROM notifications n
       LEFT JOIN projects p ON n.project_id = p.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
