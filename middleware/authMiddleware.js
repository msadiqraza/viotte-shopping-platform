// -----------------------------------------------------------------------------
// File: backend/middleware/authMiddleware.js
// Middleware to verify Supabase JWT and extract user
// -----------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateSupabaseUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using your Supabase JWT secret (often the anon key for verification)
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // `decoded.sub` should be the Supabase user ID
    if (!decoded.sub) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }

    req.user = {
      id: decoded.sub, // Supabase User ID
      email: decoded.email, // User email
      role: decoded.role, // e.g., 'authenticated'
      // Add other relevant fields from the JWT payload if needed
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { authenticateSupabaseUser };