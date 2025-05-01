const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const db = require("../db");

// Get all groups
router.get("/", protect, async (req, res) => {
  try {
    const [groups] = await db.execute(`
      SELECT 
        g.id,
        g.name,
        p.title as project_name,
        COUNT(gm.student_id) as member_count,
        g.created_at
      FROM \`groups\` g
      LEFT JOIN projects p ON g.project_id = p.id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);

    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// Create new group
router.post("/", protect, async (req, res) => {
  try {
    const { name, project_id, student_ids } = req.body;

    if (!name || !project_id || !student_ids || !Array.isArray(student_ids)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Start transaction
    await db.execute("START TRANSACTION");

    // Create group
    const [result] = await db.execute(
      "INSERT INTO \`groups\` (name, project_id) VALUES (?, ?)",
      [name, project_id]
    );

    const groupId = result.insertId;

    // Add members to group
    for (const studentId of student_ids) {
      await db.execute(
        "INSERT INTO group_members (group_id, student_id) VALUES (?, ?)",
        [groupId, studentId]
      );
    }

    // Commit transaction
    await db.execute("COMMIT");

    res.status(201).json({
      message: "Group created successfully",
      groupId
    });
  } catch (error) {
    // Rollback on error
    await db.execute("ROLLBACK");
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Failed to create group" });
  }
});

// Get group details
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Get group details
    const [group] = await db.execute(`
      SELECT 
        g.*,
        p.title as project_name,
        p.description as project_description
      FROM \`groups\` g
      LEFT JOIN projects p ON g.project_id = p.id
      WHERE g.id = ?
    `, [id]);

    if (!group[0]) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Get group members
    const [members] = await db.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        gm.role,
        gm.status,
        gm.joined_at
      FROM group_members gm
      JOIN users u ON gm.student_id = u.id
      WHERE gm.group_id = ?
    `, [id]);

    res.json({
      ...group[0],
      members
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ message: "Failed to fetch group details" });
  }
});

// Update group member status
router.put("/:groupId/members/:studentId", protect, async (req, res) => {
  try {
    const { groupId, studentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    await db.execute(
      "UPDATE group_members SET status = ? WHERE group_id = ? AND student_id = ?",
      [status, groupId, studentId]
    );

    res.json({ message: "Member status updated successfully" });
  } catch (error) {
    console.error("Error updating member status:", error);
    res.status(500).json({ message: "Failed to update member status" });
  }
});

// Delete group
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if group exists
    const [group] = await db.execute(
      "SELECT id FROM \`groups\` WHERE id = ?",
      [id]
    );

    if (!group[0]) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Delete group (group_members will be deleted automatically due to CASCADE)
    await db.execute("DELETE FROM \`groups\` WHERE id = ?", [id]);

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Failed to delete group" });
  }
});

module.exports = router;
