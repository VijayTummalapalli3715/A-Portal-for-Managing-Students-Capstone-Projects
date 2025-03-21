const db = require("../db");

// Create Preferences Table
const createPreferencesTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS preferences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      project_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT unique_student_project UNIQUE (student_id, project_id)
    )
  `;
  await db.execute(sql);
};

module.exports = { createPreferencesTable };
