import { supabase } from "../supabaseClient"; // Adjust path

// This version will be used by service functions.
// If a service function is called when it shouldn't be (i.e., user not logged in),
// this will throw an error, which the calling UI code should catch and then prompt login.
export const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(
      "Error in getCurrentUserId: User not authenticated or error fetching user.",
      error
    );
    // Throw a specific error message or type that UI can check for
    throw new Error("UserNotAuthenticated");
  }
  return user.id;
};

// Re-export your API modules
export * as shopApis from "./shopApis";
export * as productApis from "./productApis";
export * as reviewApis from "./reviewApis";
export * as accountApis from "./accountApis"; //
export * as blogPostApis from "./blogPostApis"; //
export * as cartCheckoutApis from "./cartCheckoutApis"; // Assuming you want this pattern for all
export * as utilityApis from "./utilityApis"; // Assuming you want this pattern for all
