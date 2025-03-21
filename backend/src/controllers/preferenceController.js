const db = require("../db");

// Add student preference (POST request)
const addPreference = async (req, res) => {
  try {
    const { student_id, project_id } = req.body;

    if (!student_id || !project_id) {
      return res.status(400).json({ error: "Student ID and Project ID are required." });
    }

    // Check if the user exists and is a student
    const [userRows] = await db.execute("SELECT role FROM users WHERE id = ?", [student_id]);
    if (!userRows.length || userRows[0].role !== "Student") {
      return res.status(403).json({ error: "Only students can select preferences." });
    }

    // Check if the preference already exists
    const [existingPreference] = await db.execute(
      "SELECT * FROM preferences WHERE student_id = ? AND project_id = ?",
      [student_id, project_id]
    );

    if (existingPreference.length > 0) {
      return res.status(400).json({ error: "You have already selected this project as a preference." });
    }

    // Check how many preferences the student already has
    const [rows] = await db.execute("SELECT COUNT(*) AS count FROM preferences WHERE student_id = ?", [student_id]);

    if (rows[0].count >= 3) {
      return res.status(400).json({ error: "You can only select up to 3 preferred projects." });
    }

    // Insert new preference
    await db.execute("INSERT INTO preferences (student_id, project_id) VALUES (?, ?)", [student_id, project_id]);

    res.status(201).json({ message: "Preference added successfully!" });
  } catch (error) {
    console.error("Error adding preference:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Get all preferences (GET request)
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

module.exports = { addPreference, getPreferences };
