const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
//router.get("/", getAllUsers);
router.post("/register", registerUser);
// router.post("/login", loginUser);

router.get("/me", protect, async (req, res) => {
    res.json(req.user.db); // this comes from `auth.js` middleware
  });

module.exports = router;
