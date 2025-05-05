const db = require('./src/db');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// Public endpoint to get all projects
app.get('/api/projects', async (req, res) => {
  try {
    console.log('Fetching all projects');
    const [rows] = await db.execute('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Public endpoint to get a project by ID
app.get('/api/projects/public/:id', async (req, res) => {
  const projectId = req.params.id;
  
  try {
    console.log(`Fetching project with ID: ${projectId}`);
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (rows.length === 0) {
      console.log('No project found with that ID');
      return res.status(404).json({ message: 'Project not found' });
    }
    
    console.log('Project found:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Start server on a different port
const PORT = 5008;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

console.log('Test server started. Try accessing:');
console.log('- http://localhost:5008/test');
console.log('- http://localhost:5008/api/projects');
console.log('- http://localhost:5008/api/projects/public/2'); 