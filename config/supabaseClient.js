// -----------------------------------------------------------------------------
// File: backend/config/supabaseClient.js
// Utility to initialize Supabase admin client (if needed for service role operations)
// -----------------------------------------------------------------------------
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is missing in .env file.");
  // process.exit(1); // Or handle this more gracefully
}

// This client uses the Service Role Key and bypasses RLS.
// Use with extreme caution and only for operations that genuinely require admin privileges.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabaseAdmin };
