const db = require("../db");

// Create Groups Table
const createGroupsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`groups\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      client_id INT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await db.execute(sql);
};

// Create Group Members Table (Links students to groups)
const createGroupMembersTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS group_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_id INT NOT NULL,
      student_id INT NOT NULL,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await db.execute(sql);
};

module.exports = { createGroupsTable, createGroupMembersTable };
