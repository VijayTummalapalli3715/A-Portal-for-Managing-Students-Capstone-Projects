const db = require("../db");

const createProjectsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      requirements TEXT,
      main_category VARCHAR(100),
      sub_category VARCHAR(100),
      skills_required TEXT,
      resources TEXT,
      max_team_size INT DEFAULT 4,
      deadline DATE,
      client_id INT,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `;

  try {
    await db.execute(sql);
    console.log("✅ Projects table created successfully");
  } catch (error) {
    console.error("Error creating projects table:", error);
    throw error;
  }
};

module.exports = { createProjectsTable };