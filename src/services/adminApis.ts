// src/services/adminApis.ts
import { supabase } from "../supabaseClient";
// import { getCurrentUserId } from "./index"; // For getting current user if needed for admin check
// import { AuthenticationRequiredError } from "./creditApis"; // Reuse error
import { SellerApplication, mapToSellerApplication } from "./sellerApis"; // Reuse type and mapper

/**
 * Client-side check to see if the current user is an admin based on email.
 * Note: RLS policies are the primary security mechanism for admin actions.
 * This function is mainly for UI control (e.g., showing/hiding admin links).
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const adminEmailsEnv: string = import.meta.env.VITE_ADMIN_EMAIL;
    if (!adminEmailsEnv) {
      console.warn("VITE_ADMIN_EMAIL environment variable is not set.");
      return false;
    }

    // Split the environment variable by commas, trim spaces, and check if the user's email is in the list
    const adminEmails = adminEmailsEnv.split(",").map((email) => email.trim().toLowerCase());
    return adminEmails.includes(user.email?.toLowerCase() || "");
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};


/**
 * Fetches all seller applications, typically those pending review.
 * This function relies on RLS to ensure only admins can access this data.
 */
export const getSellerApplicationsForAdmin = async (
  status: "pending" | "approved" | "rejected" | "all" = "pending"
): Promise<SellerApplication[]> => {
  // Optional: Add a client-side check, but RLS is the enforcer
  // const isAdmin = await isCurrentUserAdmin();
  // if (!isAdmin) throw new Error("Access denied: Admin privileges required.");

  let query = supabase
    .from("seller_applications")
    .select("*")
    .order("submitted_at", { ascending: true });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching seller applications for admin:", error);
    throw error;
  }
  return data ? data.map(mapToSellerApplication) : [];
};

/**
 * Updates the status of a seller application.
 * This function relies on RLS to ensure only admins can perform this action.
 */
export const updateSellerApplicationStatus = async (
  applicationId: string,
  newStatus: "approved" | "rejected",
  reviewerNotes?: string
): Promise<SellerApplication> => {
  const updatePayload: { status: string; reviewed_at: string; reviewer_notes?: string } = {
    status: newStatus,
    reviewed_at: new Date().toISOString(),
  };
  if (reviewerNotes) {
    updatePayload.reviewer_notes = reviewerNotes;
  }

  const { data, error } = await supabase
    .from("seller_applications")
    .update(updatePayload)
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating seller application status:", error);
    throw error;
  }
  if (!data) throw new Error("Failed to update application or retrieve updated data.");

  // Potentially, if 'approved', trigger other actions here or via a DB trigger/function:
  // - Create a 'shop' record for the user.
  // - Update the user's role in your system (e.g., in 'profiles' table add a 'role' column or similar).

  return mapToSellerApplication(data);
};
