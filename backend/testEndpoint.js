const db = require('./src/db');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Simple endpoint to get a project by ID
app.get('/api/projects/:id', async (req, res) => {
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

// Start server
const PORT = 5007;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

console.log('Test server started. Try accessing http://localhost:5007/api/projects/2'); 