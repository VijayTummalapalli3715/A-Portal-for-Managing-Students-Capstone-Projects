// const db = require("../db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
//     await db.execute(sql, [name, email, hashedPassword, role]);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
//     if (!user.length) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user[0].id, role: user[0].role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const [users] = await db.execute("SELECT * FROM users");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// };

// module.exports = { registerUser, loginUser, getAllUsers };

const db = require("../db");
const { verifyTokenWithFirebase } = require("../middleware/authMiddleware");

const registerUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const firebaseUser = await verifyTokenWithFirebase(token);
    const { email } = firebaseUser;
    const { uid, name, role } = req.body;

    if (!uid || !name || !role || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(200).json({ message: "User already exists" });
    }

    await db.execute(
      "INSERT INTO users (name, email, firebase_uid, role) VALUES (?, ?, ?, ?)",
      [name, email, uid, role]
    );

    res.status(201).json({ message: "User registered in DB" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(403).json({ message: "Failed to verify token or save user" });
  }
};

const validateRole = async (req, res, next) => {
  const role = req.headers["x-user-role"] || req.query.role;
  if (!req.user || !req.user.db || !req.user.db.role) {
    return res.status(403).json({ message: "Unauthorized: User role not found" });
  }
  if (role && role !== req.user.db.role.toLowerCase()) {
    return res.status(403).json({ message: `Access denied. Expected role '${req.user.db.role}', got '${role}'` });
  }
  next();
};

module.exports = { registerUser, validateRole };

