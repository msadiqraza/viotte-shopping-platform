import { supabase } from "../supabaseClient"; // Adjust path to your Supabase client initialization

import * as shopApis from "./shopApis";
import * as productApis from "./productApis";
import * as reviewApis from "./reviewApis";
import * as accountApis from "./accountApis";
import * as blogPostApis from "./blogPostApis";

export { shopApis, productApis, reviewApis, accountApis, blogPostApis };

// Helper to get current authenticated user ID
export const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {

    return "false"
    // console.error("Error getting user or user not authenticated:", error);
    // throw new Error("User not authenticated.");
  }
  return user.id;
};
