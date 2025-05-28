import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!anon_key) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY");
}

console.log("Supabase client initialized.", url);
export const supabase = createClient(url, anon_key, {
    auth:{
        autoRefreshToken: true,
        persistSession: true,
    }
});
