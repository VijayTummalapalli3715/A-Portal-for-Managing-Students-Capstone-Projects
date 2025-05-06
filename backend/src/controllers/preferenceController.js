const db = require("../db");

// ✅ Add or update a student preference
const addPreference = async (req, res) => {
  const { project_id } = req.body;
  const studentId = req.user.db.id;

  // Validate input
  if (!project_id) {
    return res.status(400).json({ error: "Project ID is required." });
  }

  try {
    // Check if the student already has preferences
    const [existingPrefs] = await db.execute(
      "SELECT * FROM student_preferences WHERE student_id = ?",
      [studentId]
    );

    if (existingPrefs.length > 0) {
      // Student already has a preferences row
      const studentPrefs = existingPrefs[0];
      
      // Check if this project is already in preferences
      if (
        studentPrefs.preference1_id === parseInt(project_id) ||
        studentPrefs.preference2_id === parseInt(project_id) ||
        studentPrefs.preference3_id === parseInt(project_id)
      ) {
        return res.status(400).json({ error: "You have already selected this project." });
      }
      
      // Find the first empty preference slot
      let updateField = null;
      let updateQuery = "";
      
      if (studentPrefs.preference1_id === null) {
        updateField = "preference1_id";
      } else if (studentPrefs.preference2_id === null) {
        updateField = "preference2_id";
      } else if (studentPrefs.preference3_id === null) {
        updateField = "preference3_id";
      } else {
        return res.status(400).json({ error: "You can only select up to 3 preferred projects." });
      }
      
      // Update the preference
      await db.execute(
        `UPDATE student_preferences SET ${updateField} = ? WHERE student_id = ?`,
        [project_id, studentId]
      );
    } else {
      // Create a new preferences row for this student
      await db.execute(
        "INSERT INTO student_preferences (student_id, preference1_id) VALUES (?, ?)",
        [studentId, project_id]
      );
    }

    res.status(201).json({ message: "Preference added successfully!" });
  } catch (error) {
    console.error("Error adding preference:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
};

// ✅ Get all preferences for Admin or Debugging
const getPreferences = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM student_preferences");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// ✅ Get preferences of **Logged-In Student** (full project details)
const getStudentPreferences = async (req, res) => {
  const studentId = req.user.db.id;

  try {
    // Get the student's preferences
    const [preferences] = await db.execute(
      "SELECT * FROM student_preferences WHERE student_id = ?",
      [studentId]
    );

    if (preferences.length === 0) {
      return res.json([]);
    }

    const studentPrefs = preferences[0];
    const projectIds = [
      studentPrefs.preference1_id,
      studentPrefs.preference2_id,
      studentPrefs.preference3_id
    ].filter(id => id !== null);

    if (projectIds.length === 0) {
      return res.json([]);
    }

    // Get the project details
    const [projects] = await db.execute(
      `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.skills_required,
        p.resources,
        u.name AS client
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.id IN (${projectIds.join(",")})
      `,
    );

    // Assign preference_id and order projects based on student preferences
    const orderedProjects = projectIds.map(projectId => {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        // Add preference_id to match the frontend expectations
        return {
          ...project,
          preference_id: studentPrefs.id
        };
      }
      return null;
    }).filter(p => p !== null);

    res.json(orderedProjects);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
};

// ✅ Save student's preferred project rankings
const rankPreferences = async (req, res) => {
  const studentId = req.user.db.id;
  const { projectRankings } = req.body;

  console.log('Saving preferences ranking:', { studentId, projectRankings });

  try {
    // Validate input
    if (!projectRankings || !Array.isArray(projectRankings)) {
      return res.status(400).json({ error: "Invalid project rankings." });
    }

    if (projectRankings.length === 0) {
      return res.status(400).json({ error: "No projects to rank." });
    }

    if (projectRankings.length > 3) {
      return res.status(400).json({ error: "You can only rank up to 3 projects." });
    }

    // Get the student's current preferences
    const [existingPrefs] = await db.execute(
      "SELECT * FROM student_preferences WHERE student_id = ?",
      [studentId]
    );

    if (existingPrefs.length === 0) {
      return res.status(404).json({ error: "No preferences found for this student." });
    }

    // Update the preferences with the new ranking
    await db.execute(
      `UPDATE student_preferences SET 
        preference1_id = ?,
        preference2_id = ?,
        preference3_id = ?
      WHERE student_id = ?`,
      [
        projectRankings[0] || null,
        projectRankings[1] || null,
        projectRankings[2] || null,
        studentId
      ]
    );

    res.status(200).json({ message: "Project preferences ranked successfully!" });
  } catch (error) {
    console.error("Error ranking preferences:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
};

// ✅ Remove a student's preference for a project
const removePreference = async (req, res) => {
  const studentId = req.user.db.id;
  const { projectId } = req.query;

  // Validate input
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required." });
  }

  try {
    // Validate project ID is a number
    const parsedProjectId = parseInt(projectId, 10);
    if (isNaN(parsedProjectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    // Get the student's preferences
    const [preferences] = await db.execute(
      "SELECT * FROM student_preferences WHERE student_id = ?",
      [studentId]
    );

    if (preferences.length === 0) {
      return res.status(404).json({ error: "No preferences found for this student." });
    }

    const studentPrefs = preferences[0];
    let updateField = null;

    // Find which preference slot contains this project
    if (studentPrefs.preference1_id === parsedProjectId) {
      updateField = "preference1_id";
    } else if (studentPrefs.preference2_id === parsedProjectId) {
      updateField = "preference2_id";
    } else if (studentPrefs.preference3_id === parsedProjectId) {
      updateField = "preference3_id";
    } else {
      return res.status(404).json({ error: "Project not found in student preferences." });
    }

    // Remove the preference by setting it to NULL
    await db.execute(
      `UPDATE student_preferences SET ${updateField} = NULL WHERE student_id = ?`,
      [studentId]
    );

    res.status(200).json({ message: "Preference removed successfully!" });
  } catch (error) {
    console.error("Error removing preference:", error);
    res.status(500).json({ error: "Server error.", details: error.message });
  }
};

module.exports = { addPreference, getPreferences, getStudentPreferences, rankPreferences, removePreference };