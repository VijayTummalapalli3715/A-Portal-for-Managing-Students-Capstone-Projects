const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Fix CORS for frontend (port 5173)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Import database models
const { createUserTable } = require("./models/userModel");
const { createProjectsTable } = require("./models/project");
const { createGroupsTable } = require("./models/groups");
const { createPreferencesTable } = require("./models/preferences");
const { createNotificationsTable } = require("./models/notifications");

// Import routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const groupRoutes = require("./routes/groupRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const clientRoutes = require("./routes/clientRoutes");

// ✅ NEW: Import assigned project route for student
const assignedRoutes = require("./routes/studentRoutes");

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes); // includes /recommended
app.use("/api/groups", groupRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/client", clientRoutes);

// ✅ NEW: Student-specific APIs (assigned project, etc.)
app.use("/api/student", assignedRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Capstone Project API is running...");
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Initialize database tables
const initializeTables = async () => {
  try {
    // Create tables in order (respecting foreign key constraints)
    await createUserTable();
    await createProjectsTable();
    await createGroupsTable();
    await createPreferencesTable();
    await createNotificationsTable();
    
    console.log("✅ All database tables initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database tables:", error);
    process.exit(1);
  }
};

// Initialize tables
initializeTables();

// Start the server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
