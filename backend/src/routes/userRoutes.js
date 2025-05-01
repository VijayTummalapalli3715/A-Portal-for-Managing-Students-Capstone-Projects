const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const db = require("../db");

//router.get("/", getAllUsers);
router.post("/register", registerUser);
// router.post("/login", loginUser);

// User verification endpoint
router.post("/verify", protect, async (req, res) => {
  try {
    const { role } = req.body;
    const email = req.user.firebase.email;

    // Get user from database
    const [users] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. You are not registered as a ${role}` 
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

// Get current user profile
router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user.db.id;
    const [user] = await db.execute(
      "SELECT id, name, email, department, contact_number, preferences FROM users WHERE id = ?",
      [userId]
    );

    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse preferences if they exist
    const userData = {
      ...user[0],
      preferences: user[0].preferences ? JSON.parse(user[0].preferences) : {
        emailNotifications: true,
        groupCreationAlerts: true,
        evaluationReminders: true
      }
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const userId = req.user.db.id;
    const { name, email, department, contactNumber, preferences } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is already taken by another user
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Update user profile
    await db.execute(
      `UPDATE users SET 
        name = ?,
        email = ?,
        department = ?,
        contact_number = ?,
        preferences = ?
      WHERE id = ?`,
      [
        name,
        email,
        department || null,
        contactNumber || null,
        preferences ? JSON.stringify(preferences) : null,
        userId
      ]
    );

    // Fetch updated user data
    const [updatedUser] = await db.execute(
      "SELECT id, name, email, department, contact_number, preferences FROM users WHERE id = ?",
      [userId]
    );

    if (!updatedUser[0]) {
      throw new Error("Failed to fetch updated user data");
    }

    // Parse preferences if they exist
    const userData = {
      ...updatedUser[0],
      preferences: updatedUser[0].preferences ? JSON.parse(updatedUser[0].preferences) : {
        emailNotifications: true,
        groupCreationAlerts: true,
        evaluationReminders: true
      }
    };

    res.json({
      message: "Profile updated successfully",
      user: userData
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// Get all students (for instructor view)
router.get("/students", protect, async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.join_date,
        p.title as project,
        COALESCE(gm.status, 'Not Started') as status
      FROM users u
      LEFT JOIN group_members gm ON u.id = gm.student_id
      LEFT JOIN \`groups\` g ON gm.group_id = g.id
      LEFT JOIN projects p ON g.project_id = p.id
      WHERE u.role = 'Student'
      ORDER BY u.join_date DESC
    `);

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new student
router.post("/students", protect, async (req, res) => {
  try {
    const { name, email, firebase_uid } = req.body;

    // Check if email already exists
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Insert new student
    const [result] = await db.execute(
      `INSERT INTO users (name, email, firebase_uid, role, join_date) 
       VALUES (?, ?, ?, 'Student', NOW())`,
      [name, email, firebase_uid]
    );

    res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertId
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
