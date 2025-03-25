const db = require("../db");

const createProjectsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      skills_required TEXT NOT NULL,
      expected_outcomes TEXT,
      flexibility VARCHAR(50),
      difficulty VARCHAR(50),
      total_hours INT,
      main_category VARCHAR(100),
      sub_categories TEXT,
      team_size INT,
      start_date DATE,
      end_date DATE,
      resources TEXT NOT NULL,
      client_id INT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await db.execute(sql);
};

module.exports = { createProjectsTable };
