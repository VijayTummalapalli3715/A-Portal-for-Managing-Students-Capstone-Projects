const db = require("../db");

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.execute("SELECT * FROM projects");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Get projects assigned to a specific client
const getClientProjects = async (req, res) => {
  //const clientId = req.params.clientId;
  const clientId = req.user.db.id;

  try {
    const [projects] = await db.execute("SELECT * FROM projects WHERE client_id = ?", [clientId]);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this client" });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client projects", error });
  }
};

const addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      skills_required,
      expected_outcomes,
      flexibility,
      difficulty,
      total_hours,
      main_category,
      sub_categories,
      team_size,
      start_date,
      end_date,
      resources,
    } = req.body;

    const client_id = req.user.db.id;

    const sql = `
      INSERT INTO projects (
        title, description, skills_required, expected_outcomes,
        flexibility, difficulty, total_hours, main_category,
        sub_categories, team_size, start_date, end_date,
        resources, client_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title ?? null,
      description ?? null,
      skills_required ?? null,
      expected_outcomes ?? null,
      flexibility ?? null,
      difficulty ?? null,
      total_hours ?? null,
      main_category ?? null,
      sub_categories ?? null,
      team_size ?? null,
      start_date ?? null,
      end_date ?? null,
      resources ?? "",
      client_id,
    ];

    await db.execute(sql, values);

    res.status(201).json({ message: "Project added successfully" });
  } catch (err) {
    console.error("Error inserting project:", err);
    res.status(500).json({ message: "Error adding project" });
  }
};

const getRecommendedProjects = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM projects ORDER BY id DESC LIMIT 3`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching recommended projects:", error);
    res.status(500).json({ message: "Error fetching recommended projects" });
  }
};

module.exports = {  getRecommendedProjects,getAllProjects, addProject, getClientProjects };
