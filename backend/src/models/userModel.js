const db = require("../db");

const createUserTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      firebase_uid VARCHAR(255) NOT NULL,
      role ENUM('Instructor', 'Student', 'Client') NOT NULL
    )
  `;
  await db.execute(sql);
};

module.exports = { createUserTable };
