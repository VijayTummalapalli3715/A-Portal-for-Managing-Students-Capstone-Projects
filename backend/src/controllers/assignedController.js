const db = require("../db");

// Get the assigned project and teammates for the current student
const getAssignedProject = async (req, res) => {
  try {
    // Debug logging
    console.log('User object:', req.user);
    console.log('User DB object:', req.user?.db);
    console.log('Student ID:', req.user?.db?.id);

    // Ensure we have a valid student ID
    if (!req.user || !req.user.db || !req.user.db.id) {
      console.log('Authentication check failed:', {
        hasUser: !!req.user,
        hasDb: !!req.user?.db,
        hasId: !!req.user?.db?.id
      });
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid user data"
      });
    }

    const studentId = req.user.db.id;
    console.log('Using student ID:', studentId);

    // First check if the student has any preferences
    const [preferences] = await db.execute(`
      SELECT student_id, assigned_project_id
      FROM student_preferences
      WHERE student_id = ?
    `, [studentId]);

    console.log('Student preferences:', preferences);

    if (!preferences || preferences.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No preferences found for this student"
      });
    }

    if (!preferences[0].assigned_project_id) {
      return res.status(404).json({
        success: false,
        message: "No project has been assigned to you yet"
      });
    }

    // Get the assigned project details
    const [assignedProject] = await db.execute(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.requirements,
        p.skills_required,
        p.resources,
        p.main_category,
        p.sub_category,
        p.max_team_size,
        p.deadline,
        u.name as client_name,
        g.id as group_id,
        g.name as group_name
      FROM student_preferences sp
      JOIN projects p ON sp.assigned_project_id = p.id
      JOIN users u ON p.client_id = u.id
      JOIN \`groups\` g ON g.project_id = p.id
      JOIN group_members gm ON g.id = gm.group_id AND gm.student_id = ?
      WHERE sp.student_id = ?
    `, [studentId, studentId]);

    console.log('Assigned project query result:', assignedProject);

    if (!assignedProject || assignedProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No project has been assigned to you yet"
      });
    }

    // Get other group members
    const [groupMembers] = await db.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        gm.status as member_status
      FROM group_members gm
      JOIN users u ON gm.student_id = u.id
      WHERE gm.group_id = ?
    `, [assignedProject[0].group_id]);

    console.log('Group members query result:', groupMembers);

    res.json({
      success: true,
      project: assignedProject[0],
      group: {
        id: assignedProject[0].group_id,
        name: assignedProject[0].group_name,
        members: groupMembers
      }
    });

  } catch (error) {
    console.error("Error fetching assigned project:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: "Error fetching assigned project",
      error: error.message
    });
  }
};

module.exports = {
  getAssignedProject
};
