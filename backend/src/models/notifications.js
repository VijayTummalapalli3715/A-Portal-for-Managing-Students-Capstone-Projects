const db = require("../db");

const createNotificationsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      project_id INT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `;
  
  try {
    await db.execute(sql);
    console.log("✅ Notifications table created successfully");
  } catch (error) {
    console.error("Error creating notifications table:", error);
    throw error;
  }
};

module.exports = { createNotificationsTable }; 