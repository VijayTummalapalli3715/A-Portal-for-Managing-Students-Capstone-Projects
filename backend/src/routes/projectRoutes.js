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
router.get("/public/:id", async (req, res) => {
  const projectId = req.params.id;
  console.log(`Fetching project (public) with ID: ${projectId}`);
  
  try {
    const [rows] = await db.execute("SELECT * FROM projects WHERE id = ?", [projectId]);
    
    if (rows.length === 0) {
      console.log(`No project found with ID ${projectId}`);
      return res.status(404).json({ message: "Project not found" });
    }
    
    console.log(`Returning project: ${JSON.stringify(rows[0])}`);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Error fetching project" });
  }
});

// Protected routes with specific paths first
router.get("/client", protect, getClientProjects);
router.get("/recommended", protect, getRecommendedProjects);

// Then more general routes with parameters
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);

// Post routes
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.db.id;
    const userRole = req.user.db.role;
    // Accept both old and new field sets
    const {
      title,
      description,
      requirements,
      main_category,
      sub_category,
      sub_categories,
      skills_required,
      resources,
      max_team_size,
      team_size,
      deadline,
      end_date,
      selected_instructors
    } = req.body;

    // For client projects, set initial status as pending
    const status = userRole === 'Client' ? 'pending' : 'approved';

    // Ensure all required fields are present and handle undefined values
    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    // Use fallback for fields if not provided
    const finalRequirements = requirements || req.body.expected_outcomes || null;
    const finalSubCategory = sub_category || sub_categories || null;
    const finalMaxTeamSize = max_team_size || team_size || 4;
    const finalDeadline = deadline || end_date || null;

    // Debug log the values being inserted
    console.log('Creating project with values:', {
      title,
      description: description || null,
      requirements: finalRequirements,
      main_category: main_category || null,
      sub_category: finalSubCategory,
      skills_required: skills_required || null,
      resources: resources || null,
      max_team_size: finalMaxTeamSize,
      deadline: finalDeadline,
      client_id: userId,
      status
    });

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        `INSERT INTO projects (
          title, description, requirements, main_category, sub_category,
          skills_required, resources, max_team_size, deadline, client_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || null,
          finalRequirements,
          main_category || null,
          finalSubCategory,
          skills_required || null,
          resources || null,
          finalMaxTeamSize,
          finalDeadline,
          userId,
          status
        ]
      );

      // If project is created by client, create notification for instructors
      if (userRole === 'Client') {
        let instructors;
        if (selected_instructors && selected_instructors.length > 0) {
          // Get selected instructors
          [instructors] = await connection.execute(
            "SELECT id FROM users WHERE id IN (?)",
            [selected_instructors]
          );
        } else {
          // If no instructors selected, notify all instructors
          [instructors] = await connection.execute(
            "SELECT id FROM users WHERE role = 'Instructor'"
          );
        }
        // Create notifications for each instructor
        for (const instructor of instructors) {
          await connection.execute(
            `INSERT INTO notifications (
              user_id, type, content, project_id, created_at
            ) VALUES (?, 'project_approval', ?, ?, NOW())`,
            [instructor.id, `New project \"${title}\" needs approval`, result.insertId]
          );
        }
      }

      await connection.commit();
      res.status(201).json({
        message: "Project created successfully",
        projectId: result.insertId
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error creating project:", error && error.message ? error.message : error);
      if (error && error.stack) console.error(error.stack);
      res.status(500).json({ message: "Server error" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating project:", error && error.message ? error.message : error);
    if (error && error.stack) console.error(error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

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
    const connection = await db.getConnection();
    await connection.execute(
      "UPDATE projects SET status = ?, feedback = ? WHERE id = ?",
      [status, feedback, projectId]
    );

    // Get project and client details
    const [project] = await connection.execute(
      `SELECT p.*, u.id as client_id, u.name as client_name 
       FROM projects p 
       JOIN users u ON p.client_id = u.id 
       WHERE p.id = ?`,
      [projectId]
    );

    // Create notification for the client
    if (project[0]) {
      await connection.execute(
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

    await connection.commit();
    res.json({ message: `Project ${status} successfully` });
  } catch (error) {
    await connection.rollback();
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
