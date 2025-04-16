const db = require("../db");

// Get the assigned project and teammates for the current student
const getAssignedProject = async (req, res) => {
  const studentId = req.user.db.id;

  try {
    const [assigned] = await db.execute(`
      SELECT p.id, p.title, p.client, p.description, p.skills_required AS skills, p.resources
      FROM assigned_projects ap
      JOIN projects p ON ap.project_id = p.id
      WHERE ap.student_id = ?
    `, [studentId]);

    if (assigned.length === 0) {
      return res.status(404).json({ message: "No assigned project found" });
    }

    const project = assigned[0];

    // Fetch team members (same project_id)
    const [team] = await db.execute(`
      SELECT u.id, u.name, u.email
      FROM assigned_projects ap
      JOIN users u ON ap.student_id = u.id
      WHERE ap.project_id = ?
    `, [project.id]);

    res.status(200).json({ ...project, teamMembers: team });
  } catch (error) {
    console.error("Error fetching assigned project:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getAssignedProject };
