const db = require("../db");

const createUserTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      firebase_uid VARCHAR(255) NOT NULL,
      role ENUM('Instructor', 'Student', 'Client') NOT NULL,
      department VARCHAR(100),
      contact_number VARCHAR(20),
      preferences JSON,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.execute(sql);
    console.log("✅ Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
};

module.exports = { createUserTable };
