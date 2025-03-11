const db = require("../db");

// Get all groups
const getAllGroups = async (req, res) => {
  try {
    const [groups] = await db.execute("SELECT * FROM groups");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

// Assign a project to a group
const assignProjectToGroup = async (req, res) => {
  const { group_id, project_id } = req.body;
  try {
    await db.execute(
      "UPDATE groups SET project_id = ? WHERE id = ?",
      [project_id, group_id]
    );
    res.status(200).json({ message: "Project assigned to group successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning project to group", error });
  }
};

module.exports = { getAllGroups, assignProjectToGroup };
