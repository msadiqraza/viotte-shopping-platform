// --- Shop Endpoint (for the single main shop) ---
import { Shop } from "../types";
import { supabase } from "../supabaseClient"; // Adjust path to your Supabase client initialization

// --- Shop Endpoint (for the single main shop) ---
export const getMainShopDetails = async (): Promise<Shop | null> => {
  const MAIN_SHOP_ID_OR_SLUG = import.meta.env.VITE_PUBLIC_SHOP_ID;
  if (!MAIN_SHOP_ID_OR_SLUG) {
    throw new Error("Missing VITE_PUBLIC_SHOP_ID");
  }

  const { data, error } = await supabase
    .from("shop")
    .select("*")
    .or(`id.eq.${MAIN_SHOP_ID_OR_SLUG},slug.eq.${MAIN_SHOP_ID_OR_SLUG}`) // Filter by ID or slug
    .maybeSingle(); // Expects 0 or 1 row. Use .single() if the shop MUST exist.

  if (error) {
    console.error("Supabase error details:", error);
    throw error;
  }

  console.log("Main shop details fetched.", data); // data will be a single object or null

  return data as Shop | null;
};

export const followMainStore = async (): Promise<{ success: boolean; followersCount?: number }> => {
  const shopDetails = await getMainShopDetails();
  if (!shopDetails) throw new Error("Main shop not found");

  // This is a simplified example. Real implementation might involve a 'shop_followers' table.
  // Or, if followers_count is just for display, it might be an RPC call to increment.
  const newFollowersCount = (shopDetails.followersCount || 0) + 1;
  const { error } = await supabase.from("shop").update({ followers_count: newFollowersCount }).eq("id", shopDetails.id);
  if (error) throw error;
  return { success: true, followersCount: newFollowersCount };
};
