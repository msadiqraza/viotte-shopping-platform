// src/services/creditApis.ts
import { supabase } from "../supabaseClient";
import { getCurrentUserId } from "./index"; // Assuming this is your central auth helper
import { UserAccountDetails } from "../types"; // Assuming UserAccountDetails has 'credit'

// Define an error for when authentication is required but missing
export class AuthenticationRequiredError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

/**
 * Fetches the current user's credit balance.
 */
export const getUserCredit = async (): Promise<{ credit: number } | null> => {
  const userId = await getCurrentUserId();
  if (!userId || userId === "false")
    throw new AuthenticationRequiredError("User not authenticated to fetch credit.");

  const { data, error } = await supabase
    .from("profiles")
    .select("credit")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user credit:", error);
    throw error;
  }

  return data ? { credit: data.credit as number } : null;
};

/**
 * Placeholder function for a user initiating a credit-earning activity.
 * In a real app, this might create a request that an admin verifies,
 * or if the action is auto-verifiable, trigger a Supabase Edge Function
 * to securely update the credit.
 *
 * For now, it just simulates lodging a request.
 */
export const requestCreditForActivity = async (
  activityType: string,
  activityDetails?: Record<string, any>
): Promise<{ success: boolean; message: string }> => {
  const userId = await getCurrentUserId();
  if (!userId || userId === "false")
    throw new AuthenticationRequiredError("User not authenticated to request credit.");

  console.log(`User [${userId}] requested credit for activity: ${activityType}`, activityDetails);

  // TODO: In a real application:
  // 1. Insert a record into a 'credit_requests' table.
  // 2. OR, if the action is simple (like "daily check-in" and can be server-validated),
  //    call a Supabase Edge Function that can securely update the user's credit.
  //    DO NOT let the client dictate the credit amount to add.

  // For now, return a mock response
  return {
    success: true,
    message: `Request for '${activityType}' received. Credit will be reviewed and applied if eligible.`,
  };
};

/**
 * ADMIN FUNCTION: To add credit to a user.
 * This should be called from a secure admin interface or a trusted environment.
 * Requires appropriate RLS on 'profiles' for admins or use of service_role key.
 * For RLS based admin check, ensure 'is_admin()' function is effective.
 */
export const adminAddUserCredit = async (
  targetUserId: string,
  amount: number
): Promise<{ success: boolean; newCredit?: number; error?: string }> => {
  // This function assumes the caller is an admin and RLS policies
  // for admins are set up on the 'profiles' table, or this is called
  // using a client initialized with the service_role key in a secure environment.

  if (amount <= 0) {
    return { success: false, error: "Credit amount must be positive." };
  }

  // It's safer to use an RPC function to handle credit updates atomically.
  const { data, error } = await supabase.rpc("add_user_credit", {
    p_user_id: targetUserId,
    p_amount: amount,
  });

  if (error) {
    console.error("Error adding user credit via RPC:", error);
    return { success: false, error: error.message };
  }
  // Assuming the RPC function returns the new credit balance.
  // Adjust based on your RPC function's actual return.
  return { success: true, newCredit: data as number };
};
