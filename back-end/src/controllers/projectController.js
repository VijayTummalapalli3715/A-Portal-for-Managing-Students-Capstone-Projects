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
  const clientId = req.params.clientId;

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

// Add a new project
const addProject = async (req, res) => {
  const { title, description, skills_required, resources, client_id } = req.body;
  try {
    await db.execute(
      "INSERT INTO projects (title, description, skills_required, resources, client_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, skills_required, resources, client_id]
    );
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding project", error });
  }
};

module.exports = { getAllProjects, addProject, getClientProjects };
