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

// Add a new project
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

// Get a single project by ID
const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.db.id;
  const userRole = req.user.db.role;

  console.log(`Fetching project with ID: ${projectId}`);
  console.log(`User ID: ${userId}, User Role: ${userRole}`);

  try {
    let query = "SELECT * FROM projects WHERE id = ?";
    let params = [projectId];

    // If user is a client, only show their own projects
    if (userRole === 'Client') {
      query += " AND client_id = ?";
      params.push(userId);
    }

    console.log(`Query: ${query}`);
    console.log(`Params: ${params}`);

    const [rows] = await db.execute(query, params);
    
    console.log(`Projects found: ${rows.length}`);
    
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
};

// Update a project by ID
const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const clientId = req.user.db.id;

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

  try {
    const [existing] = await db.execute("SELECT * FROM projects WHERE id = ? AND client_id = ?", [projectId, clientId]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    await db.execute(
      `UPDATE projects SET 
        title = ?, description = ?, skills_required = ?, expected_outcomes = ?, 
        flexibility = ?, difficulty = ?, total_hours = ?, main_category = ?, 
        sub_categories = ?, team_size = ?, start_date = ?, end_date = ?, 
        resources = ? 
      WHERE id = ? AND client_id = ?`,
      [
        title, description, skills_required, expected_outcomes,
        flexibility, difficulty, total_hours, main_category,
        sub_categories, team_size, start_date, end_date,
        resources, projectId, clientId
      ]
    );

    res.json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

// ✅ NEW: Get recommended projects
const getRecommendedProjects = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM projects ORDER BY id DESC LIMIT 3");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching recommended projects:", error);
    res.status(500).json({ message: "Error fetching recommended projects" });
  }
};

module.exports = {
  getAllProjects,
  addProject,
  getClientProjects,
  getRecommendedProjects,
  getProjectById,
  updateProject
};
