const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allows parsing of form submissions
app.use(cors()); // Allow requests from frontend
app.use(cors({ origin: "http://localhost:4000", credentials: true }));

// Import database models
const { createUserTable } = require("./models/userModel");
const { createProjectsTable } = require("./models/project");
const { createGroupsTable } = require("./models/groups");
const { createPreferencesTable } = require("./models/preferences");

// Import routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const groupRoutes = require("./routes/groupRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/preferences", preferenceRoutes);

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

// Start the server and create tables
const PORT = process.env.PORT || 5006;

(async () => {
  try {
    await createUserTable();
    await createProjectsTable();
    await createGroupsTable();
    await createPreferencesTable();
    console.log("✅ All tables are ready.");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error initializing database tables:", err);
  }
})();
