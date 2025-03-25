const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const db = require("../db");
require("dotenv").config();

const verifyTokenWithFirebase = async (idToken) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Token verification failed");
  }

  const data = await response.json();
  return data.users[0];
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const firebaseUser = await verifyTokenWithFirebase(token);
    const email = firebaseUser.email;

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (!rows.length) {
      return res.status(403).json({ message: "Forbidden: User not found in database" });
    }

    req.user = {
      firebase: firebaseUser,
      db: rows[0],
    };

    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = {
  protect,
  verifyTokenWithFirebase,
};
