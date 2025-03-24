const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.json({
    tasks: [
      {
        label: "Required",
        description: "Publish your project vchjbkl.",
        buttonText: "Publish project",
      },
      {
        label: "Recommended",
        description: "Get notified of new opportunities matching your preferences.",
        buttonText: "Save search",
      },
    ],
    events: [],
    projects: [
      {
        name: "vchjbkl",
        category: "Other",
        description: "This is a test project listed by the client.",
      },
    ],
  });
});

module.exports = router;
