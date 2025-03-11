const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Forbidden: Token has expired" });
    }

    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = { protect };
