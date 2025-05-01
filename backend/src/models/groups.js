const db = require("../db");

// Create Groups Table
const createGroupsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`groups\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      project_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
    )
  `;

  const groupMembersSql = `
    CREATE TABLE IF NOT EXISTS group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT NOT NULL,
      student_id INT NOT NULL,
      role VARCHAR(50) DEFAULT 'Member',
      status ENUM('Not Started', 'In Progress', 'Submitted', 'Under Review') DEFAULT 'Not Started',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_group_student (group_id, student_id)
    )
  `;

  try {
    await db.execute(sql);
    await db.execute(groupMembersSql);
    console.log("✅ Groups and group_members tables created successfully");
  } catch (error) {
    console.error("Error creating groups tables:", error);
    throw error;
  }
};

module.exports = { createGroupsTable };
