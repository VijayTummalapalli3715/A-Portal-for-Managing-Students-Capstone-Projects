const express = require("express");
const router = express.Router();
const db = require("../db");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, async (req, res) => {
  try {
    const clientId = req.user.db.id;

    // Fetch projects by this client
    const [projects] = await db.execute(
      "SELECT title AS name, main_category AS category, description FROM projects WHERE client_id = ? ORDER BY id DESC",
      [clientId]
    );

    const dashboard = {
      tasks: [
        {
          label: "Required",
          description: "Publish your project details to attract student teams.",
          buttonText: "Publish project",
        },
        {
          label: "Recommended",
          description: "Stay updated with notifications for matched teams.",
          buttonText: "Save search",
        },
      ],
      events: [],
      projects,
    };

    res.json(dashboard);
  } catch (err) {
    console.error("Error loading client dashboard:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

module.exports = router;
