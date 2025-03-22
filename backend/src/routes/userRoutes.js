const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllUsers);
// router.post("/register", registerUser);
// router.post("/login", loginUser);

module.exports = router;
