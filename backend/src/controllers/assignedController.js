const db = require("../db");

// Get the assigned project and teammates for the current student
const getAssignedProject = async (req, res) => {
  const studentId = req.user.db.id;

  try {
    // Check if the student has an assigned_project in student_preferences
    const [preferences] = await db.execute(`
      SELECT assigned_project
      FROM student_preferences
      WHERE student_id = ?
    `, [studentId]);

    if (preferences.length === 0 || preferences[0].assigned_project === null) {
      return res.status(404).json({ message: "No assigned project found. Your instructor is assigning projects or you have not yet been assigned. If you haven't provided your preferences, please do so." });
    }

    const projectId = preferences[0].assigned_project;

    // Fetch project details
    const [projectRows] = await db.execute(`
      SELECT id, title, client, description, skills_required AS skills, resources
      FROM projects
      WHERE id = ?
    `, [projectId]);

    if (projectRows.length === 0) {
      return res.status(404).json({ message: "Assigned project not found" });
    }

    const project = projectRows[0];

    // Fetch team members (students with the same assigned_project in student_preferences)
    const [team] = await db.execute(`
      SELECT u.id, u.name, u.email
      FROM student_preferences sp
      JOIN users u ON sp.student_id = u.id
      WHERE sp.assigned_project = ?
    `, [projectId]);

    res.status(200).json({ ...project, teamMembers: team });
  } catch (error) {
    console.error("Error fetching assigned project:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getAssignedProject };
