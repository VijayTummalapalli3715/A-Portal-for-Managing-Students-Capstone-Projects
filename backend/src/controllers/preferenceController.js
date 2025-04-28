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
      `,
      [studentId]
    );

    res.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { addPreference, getPreferences, getStudentPreferences };