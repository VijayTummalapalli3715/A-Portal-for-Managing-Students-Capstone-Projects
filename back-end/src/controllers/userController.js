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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("Incoming Request Data:", req.body); // Debugging step

    const { name, email, password, role } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    await db.execute(sql, [name, email, hashedPassword, role]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error Registering User:", error); // Log errors for debugging
    res.status(500).json({ error: "Error registering user." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (!user.length) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };