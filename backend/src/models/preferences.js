const db = require("../db");

// Create Student Preferences Table - One row per student with three preference columns
const createPreferencesTable = async () => {
  try {
    // Drop the old preferences table if it exists
    await db.execute(`DROP TABLE IF EXISTS preferences`);
    
    // Create new preferences table with preference1, preference2, preference3 columns
    const sql = `
      CREATE TABLE IF NOT EXISTS student_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        preference1_id INT,
        preference2_id INT,
        preference3_id INT,
        assigned_project_id INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (preference1_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (preference2_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (preference3_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL,
        CONSTRAINT unique_student UNIQUE (student_id)
      )
    `;
    await db.execute(sql);
    console.log('✅ Student preferences table created successfully');
  } catch (error) {
    console.error('Error creating student preferences table:', error);
    throw error;
  }
};

module.exports = { createPreferencesTable };
