/**
 * Group Formation Controller
 * 
 * Handles automatic group formation based on student preferences
 */

const { formGroups, saveGroups, getStudentsWithPreferences, getAvailableProjects, createGroups: createGroupsUtil } = require('../utils/groupFormationAlgorithm');
const db = require('../db');

/**
 * Get preview of how groups would be formed with a specific group size
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const previewGroups = async (req, res) => {
  try {
    const { groupSize } = req.query;
    
    // Validate input
    if (!groupSize || isNaN(parseInt(groupSize)) || parseInt(groupSize) < 1) {
      return res.status(400).json({ 
        error: "Invalid group size", 
        message: "Group size must be a positive number" 
      });
    }
    
    console.log(`Generating preview for group size: ${groupSize}`);
    
    // Use the actual algorithm to form groups
    try {
      const groups = await formGroups(parseInt(groupSize));
      
      if (!groups || groups.length === 0) {
        return res.status(404).json({
          error: "No groups formed",
          message: "Could not form any groups with the current student preferences and projects"
        });
      }
      
      console.log(`Successfully formed ${groups.length} groups`);
      
      // Calculate statistics
      const totalStudents = groups.reduce((sum, group) => sum + (group.members ? group.members.length : 0), 0);
      const stats = {
        totalGroups: groups.length,
        totalStudents: totalStudents,
        averageGroupSize: totalStudents / groups.length,
        firstChoiceAssignments: 0,
        secondChoiceAssignments: 0,
        thirdChoiceAssignments: 0,
        noPreferenceAssignments: 0
      };
      
      // Count preference assignments
      for (const group of groups) {
        if (group.members && Array.isArray(group.members)) {
          for (const member of group.members) {
            if (member.preference_score === 3) stats.firstChoiceAssignments++;
            else if (member.preference_score === 2) stats.secondChoiceAssignments++;
            else if (member.preference_score === 1) stats.thirdChoiceAssignments++;
            else stats.noPreferenceAssignments++;
          }
        }
      }
      
      // Calculate satisfaction rate (weighted average of preference scores)
      const totalPossibleScore = stats.totalStudents * 3; // If everyone got their first choice
      const totalActualScore = groups.reduce((sum, group) => sum + (group.preference_score || 0), 0);
      stats.satisfactionRate = totalPossibleScore > 0 ? totalActualScore / totalPossibleScore : 0;
      
      res.status(200).json({
        groups: groups,
        stats
      });
    } catch (algorithmError) {
      console.error("Error in group formation algorithm:", algorithmError);
      return res.status(500).json({
        error: "Algorithm error",
        message: algorithmError.message,
        stack: algorithmError.stack
      });
    }
  } catch (error) {
    console.error("Error previewing groups:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
};

/**
 * Form groups automatically and save them to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createGroups = async (req, res) => {
  const { groupSize } = req.body;

  if (!groupSize || groupSize <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Group size must be a positive number'
    });
  }

  try {
    // Get all students with their preferences
    const [students] = await db.execute(`
      SELECT 
        sp.student_id,
        sp.preference_order,
        sp.project_id,
        p.title as project_title
      FROM student_preferences sp
      JOIN projects p ON sp.project_id = p.id
      WHERE sp.assigned_project_id IS NULL
      ORDER BY sp.student_id, sp.preference_order
    `);

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found with preferences'
      });
    }

    // Create groups using the algorithm
    const groups = createGroupsUtil(students, groupSize);

    // Save the groups to the database
    await saveGroups(groups);

    res.json({
      success: true,
      message: 'Groups created successfully',
      data: {
        totalGroups: groups.length,
        totalStudents: students.length
      }
    });

  } catch (error) {
    console.error('Error in createGroups:', error);
    
    // Handle specific error cases
    if (error.message === 'Groups have already been created') {
      return res.status(409).json({
        success: false,
        message: 'Groups have already been created'
      });
    }

    // Handle database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry found. Groups may already exist.'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Error creating groups',
      error: error.message
    });
  }
};

/**
 * Get statistics about student preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPreferenceStatistics = async (req, res) => {
  try {
    console.log('Generating preference statistics');
    
    // Get students and projects data
    const students = await getStudentsWithPreferences();
    const projects = await getAvailableProjects();
    
    // Count students with preferences
    const studentsWithPreferences = students.filter(
      student => student.preference1_id || student.preference2_id || student.preference3_id
    ).length;
    
    // Calculate project popularity
    const projectPopularity = {};
    
    // Initialize project popularity data
    for (const project of projects) {
      if (project && project.id) {
        projectPopularity[project.id] = {
          id: project.id,
          title: project.title || 'Unnamed Project',
          firstChoiceCount: 0,
          secondChoiceCount: 0,
          thirdChoiceCount: 0,
          weightedScore: 0
        };
      }
    }
    
    // Count preferences
    for (const student of students) {
      if (student.preference1_id && projectPopularity[student.preference1_id]) {
        projectPopularity[student.preference1_id].firstChoiceCount++;
        projectPopularity[student.preference1_id].weightedScore += 3;
      }
      
      if (student.preference2_id && projectPopularity[student.preference2_id]) {
        projectPopularity[student.preference2_id].secondChoiceCount++;
        projectPopularity[student.preference2_id].weightedScore += 2;
      }
      
      if (student.preference3_id && projectPopularity[student.preference3_id]) {
        projectPopularity[student.preference3_id].thirdChoiceCount++;
        projectPopularity[student.preference3_id].weightedScore += 1;
      }
    }
    
    // Convert to array and sort by popularity
    const mostPopularProjects = Object.values(projectPopularity)
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 10); // Top 10 most popular
    
    const statistics = {
      totalStudents: students.length,
      studentsWithPreferences,
      totalProjects: projects.length,
      mostPopularProjects
    };
    
    console.log(`Statistics generated: ${students.length} students, ${projects.length} projects`);
    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error getting preference statistics:", error);
    res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
};

module.exports = {
  previewGroups,
  createGroups,
  getPreferenceStatistics
};
