// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // Check if authorization header exists and follows "Bearer <token>" format
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract token

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user payload to request
//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error);

//     if (error.name === "TokenExpiredError") {
//       return res.status(403).json({ message: "Forbidden: Token has expired" });
//     }

//     return res.status(403).json({ message: "Forbidden: Invalid token" });
//   }
// };

// module.exports = { protect };

const fetch = require("node-fetch");
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
  return data.users[0]; // Contains user info: email, uid, etc.
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const firebaseUser = await verifyTokenWithFirebase(token);
    req.user = firebaseUser; // You can access email, uid, etc.
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = { protect };
