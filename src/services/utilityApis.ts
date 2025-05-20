import { supabase } from "../supabaseClient"; // Adjust path to your Supabase client initialization
import { CarouselItem, Category } from "../types"; // Adjust path to your types file

// --- Utility Endpoints ---
export const getCarouselItems = async (): Promise<CarouselItem[]> => {
  const { data, error } = await supabase.from("carousel_items").select("*").eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getCategories = async (): Promise<Category[]> => {
  // This needs to fetch top_level_categories and potentially structure them
  // For a simple list as before:
  const { data, error } = await supabase
    .from("categories") // Assuming 'categories' is your main product categories table
    .select("id, name, slug, image_url, product_count")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data || [];
};

// For the MegaMenu structure, you'd need a more complex query or a database function:
export const getNavigationCategories = async (): Promise<any[]> => {
  // Replace 'any' with proper TopLevelCategory type
  console.warn("getNavigationCategories: Fetching mock data for mega menu. Implement actual Supabase query.");
  // This would involve joining top_level_categories, mega_menu_column_groups, and categories
  // Or calling a PostgreSQL function that structures this data.
  // Returning mock data for now based on previous structure.
  const programmingTechMegaMenu = {
    /* ... mock data from previous example ... */
  };
  return Promise.resolve([programmingTechMegaMenu /*, other top level cats */]);
};

export const subscribeToNewsletter = async (email: string): Promise<{ message: string }> => {
  // Example: If you have a 'newsletter_subscriptions' table
  const { error } = await supabase.from("newsletter_subscriptions").insert({ email: email, subscribed_at: new Date().toISOString() });
  if (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
  return { message: "Successfully subscribed to the newsletter!" };
};
