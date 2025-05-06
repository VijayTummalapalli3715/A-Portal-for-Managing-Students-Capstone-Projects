/**
 * Group Formation Algorithm
 * 
 * This algorithm forms groups based on student preferences for projects.
 * It tries to maximize student satisfaction by assigning students to their preferred projects
 * while maintaining balanced group sizes.
 */

const db = require("../db");

/**
 * Get all students with their preferences
 * @returns {Promise<Array>} Array of students with their preferences
 */
const getStudentsWithPreferences = async () => {
  try {
    const [students] = await db.execute(`
      SELECT 
        u.id AS student_id, 
        u.name AS student_name,
        sp.preference1_id,
        sp.preference2_id,
        sp.preference3_id
      FROM users u
      LEFT JOIN student_preferences sp ON u.id = sp.student_id
      WHERE u.role = 'Student'
    `);
    
    return students;
  } catch (error) {
    console.error("Error fetching students with preferences:", error);
    throw error;
  }
};

/**
 * Get all projects available for assignment
 * @returns {Promise<Array>} Array of available projects
 */
const getAvailableProjects = async () => {
  try {
    // Use 'approved' status as required
    const [projects] = await db.execute(`
      SELECT 
        p.id, 
        p.title,
        p.client_id,
        u.name AS client_name,
        COUNT(DISTINCT sp1.student_id) AS first_choice_count,
        COUNT(DISTINCT sp2.student_id) AS second_choice_count,
        COUNT(DISTINCT sp3.student_id) AS third_choice_count
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      LEFT JOIN student_preferences sp1 ON p.id = sp1.preference1_id
      LEFT JOIN student_preferences sp2 ON p.id = sp2.preference2_id
      LEFT JOIN student_preferences sp3 ON p.id = sp3.preference3_id
      WHERE p.status = 'approved'
      GROUP BY p.id
      ORDER BY (COUNT(DISTINCT sp1.student_id) * 3 + 
                COUNT(DISTINCT sp2.student_id) * 2 + 
                COUNT(DISTINCT sp3.student_id)) DESC
    `);
    
    console.log(`Found ${projects.length} available projects`);
    return projects;
  } catch (error) {
    console.error("Error fetching available projects:", error);
    throw error;
  }
};

/**
 * Calculate preference score for a student-project pair
 * @param {Object} student Student object with preferences
 * @param {number} projectId Project ID
 * @returns {number} Preference score (3 for first choice, 2 for second, 1 for third, 0 for no preference)
 */
const getPreferenceScore = (student, projectId) => {
  if (student.preference1_id === projectId) return 3;
  if (student.preference2_id === projectId) return 2;
  if (student.preference3_id === projectId) return 1;
  return 0;
};

/**
 * Form groups based on student preferences and desired group size
 * @param {number} groupSize Desired size of each group
 * @returns {Promise<Array>} Array of formed groups
 */
const formGroups = async (groupSize) => {
  try {
    // Get students and projects data
    const students = await getStudentsWithPreferences();
    const projects = await getAvailableProjects();
    
    // Validate data
    if (!students || students.length === 0) {
      throw new Error("No students found");
    }
    
    if (!projects || projects.length === 0) {
      throw new Error("No available projects found");
    }
    
    // Validate project data
    const validProjects = projects.filter(project => {
      if (!project || !project.id) {
        console.warn("Skipping invalid project:", project);
        return false;
      }
      return true;
    });
    
    if (validProjects.length === 0) {
      throw new Error("No valid projects available");
    }
    
    // Initialize groups structure
    const groups = validProjects.map(project => ({
      project_id: project.id,
      project_title: project.title || "Unnamed Project",
      client_id: project.client_id || null,
      client_name: project.client_name || "Unknown Client",
      members: [],
      preference_score: 0
    }));
    
    // Filter out students without valid IDs
    const validStudents = students.filter(student => {
      if (!student || !student.student_id) {
        console.warn("Skipping invalid student:", student);
        return false;
      }
      return true;
    });
    
    if (validStudents.length === 0) {
      throw new Error("No valid students with preferences found");
    }
    
    // Create a copy of students array to work with
    let unassignedStudents = [...validStudents];
    
    // First pass: assign students to their first preference if possible
    for (const group of groups) {
      // Skip if group has no valid project_id
      if (!group.project_id) continue;
      
      const firstChoiceStudents = unassignedStudents.filter(
        student => student.preference1_id === group.project_id
      );
      
      // Sort by those who have this as their only preference
      firstChoiceStudents.sort((a, b) => {
        const aHasOtherPrefs = a.preference2_id || a.preference3_id;
        const bHasOtherPrefs = b.preference2_id || b.preference3_id;
        return aHasOtherPrefs - bHasOtherPrefs;
      });
      
      // Take up to groupSize students
      const assignedStudents = firstChoiceStudents.slice(0, groupSize);
      
      // Add them to the group
      for (const student of assignedStudents) {
        group.members.push({
          student_id: student.student_id,
          student_name: student.student_name,
          preference_score: 3
        });
        group.preference_score += 3;
        
        // Remove from unassigned students
        unassignedStudents = unassignedStudents.filter(s => s.student_id !== student.student_id);
      }
    }
    
    // Second pass: assign students to their second preference if possible
    for (const group of groups) {
      // Skip if group has no valid project_id or is already full
      if (!group.project_id || group.members.length >= groupSize) continue;
      
      const secondChoiceStudents = unassignedStudents.filter(
        student => student.preference2_id === group.project_id
      );
      
      // Sort by those who have this as their highest remaining preference
      secondChoiceStudents.sort((a, b) => {
        const aHasThirdPref = a.preference3_id;
        const bHasThirdPref = b.preference3_id;
        return aHasThirdPref - bHasThirdPref;
      });
      
      // Take up to remaining capacity
      const remainingCapacity = groupSize - group.members.length;
      const assignedStudents = secondChoiceStudents.slice(0, remainingCapacity);
      
      // Add them to the group
      for (const student of assignedStudents) {
        if (!student || !student.student_id) continue;
        
        group.members.push({
          student_id: student.student_id,
          student_name: student.student_name || `Student ${student.student_id}`,
          preference_score: 2
        });
        group.preference_score += 2;
        
        // Remove from unassigned students
        unassignedStudents = unassignedStudents.filter(s => s.student_id !== student.student_id);
      }
    }
    
    // Third pass: assign students to their third preference if possible
    for (const group of groups) {
      // Skip if group has no valid project_id or is already full
      if (!group.project_id || group.members.length >= groupSize) continue;
      
      const thirdChoiceStudents = unassignedStudents.filter(
        student => student.preference3_id === group.project_id
      );
      
      // Take up to remaining capacity
      const remainingCapacity = groupSize - group.members.length;
      const assignedStudents = thirdChoiceStudents.slice(0, remainingCapacity);
      
      // Add them to the group
      for (const student of assignedStudents) {
        if (!student || !student.student_id) continue;
        
        group.members.push({
          student_id: student.student_id,
          student_name: student.student_name || `Student ${student.student_id}`,
          preference_score: 1
        });
        group.preference_score += 1;
        
        // Remove from unassigned students
        unassignedStudents = unassignedStudents.filter(s => s.student_id !== student.student_id);
      }
    }
    
    // Final pass: assign remaining students to any group with space
    // Sort groups by number of members (ascending)
    groups.sort((a, b) => a.members.length - b.members.length);
    
    for (const student of unassignedStudents) {
      if (!student || !student.student_id) continue;
      
      // Find the group with the fewest members that isn't full
      const group = groups.find(g => g.project_id && g.members.length < groupSize);
      
      if (group) {
        const preferenceScore = getPreferenceScore(student, group.project_id);
        
        group.members.push({
          student_id: student.student_id,
          student_name: student.student_name || `Student ${student.student_id}`,
          preference_score: preferenceScore
        });
        group.preference_score += preferenceScore;
      } else {
        // All groups are full, create a new group for the remaining students
        // Find the project with the highest preference score for this student
        let bestProjectId = null;
        let bestScore = -1;
        
        for (const project of validProjects) {
          if (!project || !project.id) continue;
          const score = getPreferenceScore(student, project.id);
          if (score > bestScore) {
            bestScore = score;
            bestProjectId = project.id;
          }
        }
        
        // Find the project
        const project = validProjects.find(p => p.id === bestProjectId) || validProjects[0];
        
        if (!project) {
          console.warn("No valid project found for student:", student.student_id);
          continue;
        }
        
        // Create a new group
        const newGroup = {
          project_id: project.id,
          project_title: project.title || "Unnamed Project",
          client_id: project.client_id || null,
          client_name: project.client_name || "Unknown Client",
          members: [{
            student_id: student.student_id,
            student_name: student.student_name || `Student ${student.student_id}`,
            preference_score: bestScore
          }],
          preference_score: bestScore
        };
        
        groups.push(newGroup);
      }
    }
    
    // Sort groups by project_id for consistent output
    groups.sort((a, b) => a.project_id - b.project_id);
    
    return groups;
  } catch (error) {
    console.error("Error forming groups:", error);
    throw error;
  }
};

/**
 * Save formed groups to the database
 * @param {Array} groups Array of formed groups
 * @returns {Promise<Array>} Array of saved group IDs
 */
const saveGroups = async (groups) => {
  try {
    // Get a connection from the pool
    const connection = await db.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Check if groups already exist
      const [existingGroups] = await connection.execute(`
        SELECT g.id, g.project_id, COUNT(gm.student_id) as member_count 
        FROM \`groups\` g 
        LEFT JOIN group_members gm ON g.id = gm.group_id 
        GROUP BY g.id
      `);
      
      if (existingGroups.length > 0) {
        throw new Error("Groups have already been created. Cannot create new groups.");
      }
      
      const groupIds = [];
      
      // Create groups and add members
      for (const group of groups) {
        // Insert group
        const [groupResult] = await connection.execute(
          'INSERT INTO `groups` (project_id, name) VALUES (?, ?)',
          [group.project_id, `${group.project_title} Group`]
        );
        
        const groupId = groupResult.insertId;
        groupIds.push(groupId);
        
        // Add members to the group and update their assigned project
        for (const member of group.members) {
          // Add to group_members
          await connection.execute(
            'INSERT INTO group_members (group_id, student_id, status) VALUES (?, ?, ?)',
            [groupId, member.student_id, 'Not Started']
          );
          
          // Update student's assigned project
          await connection.execute(
            'UPDATE student_preferences SET assigned_project_id = ? WHERE student_id = ?',
            [group.project_id, member.student_id]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      return groupIds;
      
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection back to pool
      connection.release();
    }
  } catch (error) {
    console.error("Error saving groups:", error);
    throw error;
  }
};

module.exports = {
  formGroups,
  saveGroups,
  getStudentsWithPreferences,
  getAvailableProjects
};
