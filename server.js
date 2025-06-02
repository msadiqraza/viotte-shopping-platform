// -----------------------------------------------------------------------------
// File: backend/server.js
// Main Express server setup
// -----------------------------------------------------------------------------
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from your frontend
  })
);
app.use(express.json()); // For parsing application/json

// Routes
app.use("/api/stripe", paymentRoutes); // Prefix all payment routes with /api/stripe

// Basic root route
app.get("/", (req, res) => {
  res.send("Payment Backend is Running");
});

// Global error handler (optional basic one)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Payment backend server running on port ${PORT}`);
  console.log(
    `Stripe Secret Key Loaded: ${process.env.STRIPE_SECRET_KEY ? "Yes" : "No - CHECK .env!"}`
  );
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
  console.log(
    `Supabase Service Role Key Loaded: ${
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "Yes" : "No - CHECK .env!"
    }`
  );
  console.log(
    `Supabase JWT Secret Loaded: ${process.env.SUPABASE_JWT_SECRET ? "Yes" : "No - CHECK .env!"}`
  );
});
