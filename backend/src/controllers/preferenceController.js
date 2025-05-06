const db = require("../db");

// Add a new student preference
const addPreference = async (req, res) => {
  try {
    const { project_id } = req.body;
    const student = req.user.db;

    console.log("👤 Logged-in user:", student);

    if (!project_id) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    if (!student || student.role !== "Student") {
      return res.status(403).json({ error: "Only students can select preferences." });
    }

    const student_id = student.id;

    // Check if preference already exists
    const [existingPreference] = await db.execute(
      "SELECT * FROM preferences WHERE student_id = ? AND project_id = ?",
      [student_id, project_id]
    );

    if (existingPreference.length > 0) {
      return res.status(400).json({ error: "You have already selected this project as a preference." });
    }

    // Limit to 3 preferences
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM preferences WHERE student_id = ?",
      [student_id]
    );

    if (rows[0].count >= 3) {
      return res.status(400).json({ error: "You can only select up to 3 preferred projects." });
    }

    // Insert new preference
    await db.execute(
      "INSERT INTO preferences (student_id, project_id) VALUES (?, ?)",
      [student_id, project_id]
    );

    res.status(201).json({ message: "Preference added successfully!" });
  } catch (error) {
    console.error("Error adding preference:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ Get all preferences for Admin or Debugging
const getPreferences = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.id, u.name AS student_name, pr.title AS project_title
       FROM preferences p
       JOIN users u ON p.student_id = u.id
       JOIN projects pr ON p.project_id = pr.id`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ Get preferences of **Logged-In Student** (full project details)
const getStudentPreferences = async (req, res) => {
  const studentId = req.user.db.id;

  try {
    const [preferences] = await db.execute(
      `
      SELECT 
        p.id AS preference_id,
        pr.id AS id,
        pr.title,
        pr.description,
        pr.skills_required,
        pr.resources,
        u.name AS client
      FROM preferences p
      JOIN projects pr ON p.project_id = pr.id
      JOIN users u ON pr.client_id = u.id
      WHERE p.student_id = ?
      ORDER BY p.id
      `,
      [studentId]
    );

    res.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ Rank student's preferred projects
const rankPreferences = async (req, res) => {
  const studentId = req.user.db.id;
  const { projectRankings } = req.body;

  try {
    // Validate input
    if (!projectRankings || !Array.isArray(projectRankings)) {
      return res.status(400).json({ error: "Invalid project rankings." });
    }

    // Verify that the student has these projects in their preferences
    const [validationRows] = await db.execute(
      `SELECT project_id FROM preferences WHERE student_id = ? AND project_id IN (?)`,
      [studentId, projectRankings]
    );

    if (validationRows.length !== projectRankings.length) {
      return res.status(400).json({ error: "Invalid project preferences." });
    }

    // Update rankings for each project
    const updatePromises = projectRankings.map(async (projectId, index) => {
      await db.execute(
        `UPDATE preferences SET ranking = ? WHERE student_id = ? AND project_id = ?`,
        [index + 1, studentId, projectId]
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Project preferences ranked successfully!" });
  } catch (error) {
    console.error("Error ranking preferences:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ Remove a student's preference for a project
const removePreference = async (req, res) => {
  console.log('Remove Preference Request:', {
    method: req.method,
    studentId: req.user.db.id,
    projectId: req.query.projectId,
    headers: req.headers,
    query: req.query,
    body: req.body
  });

  const studentId = req.user.db.id;
  const { projectId } = req.query;

  // Validate input
  if (!projectId) {
    console.error('Remove Preference Error: No Project ID');
    return res.status(400).json({ 
      error: "Project ID is required.",
      details: "Please provide a valid projectId in the query parameters"
    });
  }

  try {
    // Validate project ID is a number
    const parsedProjectId = parseInt(projectId, 10);
    if (isNaN(parsedProjectId)) {
      console.error('Remove Preference Error: Invalid Project ID', { projectId });
      return res.status(400).json({ 
        error: "Invalid Project ID",
        details: "Project ID must be a valid number"
      });
    }

    // Check if the preference exists
    const [existingPreference] = await db.execute(
      "SELECT * FROM preferences WHERE student_id = ? AND project_id = ?",
      [studentId, parsedProjectId]
    );

    console.log('Existing Preference Check:', {
      studentId,
      projectId: parsedProjectId,
      existingPreferenceCount: existingPreference.length
    });

    if (existingPreference.length === 0) {
      console.warn('Remove Preference Warning: Preference not found', {
        studentId,
        projectId: parsedProjectId
      });
      return res.status(404).json({ 
        error: "Preference not found.",
        details: "No preference exists for this project and student"
      });
    }

    // Remove the preference
    const [deleteResult] = await db.execute(
      "DELETE FROM preferences WHERE student_id = ? AND project_id = ?",
      [studentId, parsedProjectId]
    );

    console.log('Delete Preference Result:', {
      affectedRows: deleteResult.affectedRows,
      studentId,
      projectId: parsedProjectId
    });

    // Check if rows were actually deleted
    if (deleteResult.affectedRows === 0) {
      console.warn('Remove Preference Warning: No rows deleted', {
        studentId,
        projectId: parsedProjectId
      });
      return res.status(500).json({ 
        error: "Failed to remove preference",
        details: "Database operation did not affect any rows"
      });
    }

    res.status(200).json({ 
      message: "Preference removed successfully!",
      deletedRows: deleteResult.affectedRows,
      projectId: parsedProjectId
    });
  } catch (error) {
    console.error("Error removing preference:", {
      message: error.message,
      stack: error.stack,
      studentId,
      projectId
    });
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      studentId,
      projectId
    });
  }
};

module.exports = { addPreference, getPreferences, getStudentPreferences, rankPreferences, removePreference };