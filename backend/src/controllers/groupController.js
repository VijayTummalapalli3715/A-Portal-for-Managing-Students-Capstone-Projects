const db = require("../db");

// Get all groups with their members and assigned projects
const getAllGroups = async (req, res) => {
  try {
    // Get all groups
    const [groups] = await db.execute(`
      SELECT g.*, p.title as project_title, p.description as project_description
      FROM groups g
      LEFT JOIN projects p ON g.project_id = p.id
    `);

    // For each group, get its members
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const [members] = await db.execute(`
          SELECT u.id, u.name, u.email
          FROM group_members gm
          JOIN users u ON gm.student_id = u.id
          WHERE gm.group_id = ?
        `, [group.id]);

        return {
          id: group.id,
          project: group.project_title ? {
            title: group.project_title,
            description: group.project_description
          } : null,
          members: members
        };
      })
    );

    res.json(groupsWithMembers);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Generate groups based on student preferences
const generateGroups = async (req, res) => {
  try {
    // Start a transaction
    await db.beginTransaction();

    // Get all students with their preferences
    const [students] = await db.execute(`
      SELECT DISTINCT u.id, u.name, p.project_id
      FROM users u
      LEFT JOIN preferences p ON u.id = p.student_id
      WHERE u.role = 'Student'
      ORDER BY u.id, p.created_at
    `);

    // Group students by their preferences
    const studentsByPreference = {};
    students.forEach(student => {
      if (student.project_id) {
        if (!studentsByPreference[student.project_id]) {
          studentsByPreference[student.project_id] = [];
        }
        studentsByPreference[student.project_id].push(student);
      }
    });

    // Clear existing groups
    await db.execute('DELETE FROM group_members');
    await db.execute('DELETE FROM groups');

    // Create new groups
    const maxGroupSize = 4; // Maximum students per group
    const groups = [];

    for (const [projectId, studentsForProject] of Object.entries(studentsByPreference)) {
      // Split students into groups of maxGroupSize
      for (let i = 0; i < studentsForProject.length; i += maxGroupSize) {
        const groupStudents = studentsForProject.slice(i, i + maxGroupSize);
        
        // Create a new group
        const [result] = await db.execute(
          'INSERT INTO groups (project_id) VALUES (?)',
          [projectId]
        );
        const groupId = result.insertId;
        
        // Add students to the group
        for (const student of groupStudents) {
          await db.execute(
            'INSERT INTO group_members (group_id, student_id) VALUES (?, ?)',
            [groupId, student.id]
          );
        }
        
        groups.push({
          id: groupId,
          projectId: parseInt(projectId),
          students: groupStudents
        });
      }
    }

    // Handle remaining students without preferences
    const [remainingStudents] = await db.execute(`
      SELECT u.id, u.name
      FROM users u
      LEFT JOIN group_members gm ON u.id = gm.student_id
      WHERE u.role = 'Student' AND gm.id IS NULL
    `);

    if (remainingStudents.length > 0) {
      // Create groups for remaining students
      for (let i = 0; i < remainingStudents.length; i += maxGroupSize) {
        const groupStudents = remainingStudents.slice(i, i + maxGroupSize);
        
        // Create a new group without project
        const [result] = await db.execute('INSERT INTO groups () VALUES ()');
        const groupId = result.insertId;
        
        // Add students to the group
        for (const student of groupStudents) {
          await db.execute(
            'INSERT INTO group_members (group_id, student_id) VALUES (?, ?)',
            [groupId, student.id]
          );
        }
        
        groups.push({
          id: groupId,
          projectId: null,
          students: groupStudents
        });
      }
    }

    // Commit the transaction
    await db.commit();
    
    res.json({ message: "Groups generated successfully", groups });
  } catch (error) {
    // Rollback on error
    await db.rollback();
    console.error("Error generating groups:", error);
    res.status(500).json({ error: "Failed to generate groups" });
  }
};

// Add a student to a group
const addStudentToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { studentId } = req.body;

    // Check if student is already in a group
    const [existingMembership] = await db.execute(
      'SELECT * FROM group_members WHERE student_id = ?',
      [studentId]
    );

    if (existingMembership.length > 0) {
      return res.status(400).json({ error: "Student is already in a group" });
    }

    // Add student to group
    await db.execute(
      'INSERT INTO group_members (group_id, student_id) VALUES (?, ?)',
      [groupId, studentId]
    );

    res.json({ message: "Student added to group successfully" });
  } catch (error) {
    console.error("Error adding student to group:", error);
    res.status(500).json({ error: "Failed to add student to group" });
  }
};

// Remove a student from a group
const removeStudentFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { studentId } = req.body;

    await db.execute(
      'DELETE FROM group_members WHERE group_id = ? AND student_id = ?',
      [groupId, studentId]
    );

    res.json({ message: "Student removed from group successfully" });
  } catch (error) {
    console.error("Error removing student from group:", error);
    res.status(500).json({ error: "Failed to remove student from group" });
  }
};

module.exports = {
  getAllGroups,
  generateGroups,
  addStudentToGroup,
  removeStudentFromGroup
};
