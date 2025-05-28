// src/services/sellerApis.ts
import { supabase } from "../supabaseClient";
import { getCurrentUserId } from "./index";
import { AuthenticationRequiredError } from "./creditApis"; // Reuse error

export interface SellerApplicationData {
  businessName: string;
  applicationDetails?: string;
  contactEmail: string; // Consider pre-filling from auth user if appropriate
}

export interface SellerApplication extends SellerApplicationData {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

/**
 * Submits a seller application for the current authenticated user.
 */
export const submitSellerApplication = async (
  applicationInput: SellerApplicationData
): Promise<SellerApplication> => {
  const userId = await getCurrentUserId();
  if (!userId || userId === "false")
    throw new AuthenticationRequiredError("User must be logged in to submit an application.");

  const { data, error } = await supabase
    .from("seller_applications")
    .insert([
      {
        user_id: userId,
        business_name: applicationInput.businessName,
        application_details: applicationInput.applicationDetails,
        contact_email: applicationInput.contactEmail,
        // status and submitted_at have defaults in DB
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error submitting seller application:", error);
    // Check for unique constraint violation if user already applied
    if (error.code === "23505") {
      // unique_violation
      throw new Error("You have already submitted a seller application.");
    }
    throw error;
  }
  if (!data) throw new Error("Seller application submission failed to return data.");
  return mapToSellerApplication(data);
};

/**
 * Gets the current user's seller application status.
 */
export const getMySellerApplication = async (): Promise<SellerApplication | null> => {
  const userId = await getCurrentUserId();
  if (!userId || userId === "false")
    throw new AuthenticationRequiredError("User not authenticated.");

  const { data, error } = await supabase
    .from("seller_applications")
    .select("*")
    .eq("user_id", userId)
    // If not using unique constraint, you might want .order('submitted_at', { ascending: false }).limit(1)
    .maybeSingle(); // Use maybeSingle if an application is not guaranteed

  if (error) {
    console.error("Error fetching user's seller application:", error);
    throw error;
  }

  return data ? mapToSellerApplication(data) : null;
};

// Helper to map DB data to SellerApplication type
export const mapToSellerApplication = (dbData: any): SellerApplication => ({
  id: dbData.id,
  userId: dbData.user_id,
  businessName: dbData.business_name,
  applicationDetails: dbData.application_details,
  contactEmail: dbData.contact_email,
  status: dbData.status as SellerApplication["status"],
  submittedAt: dbData.submitted_at,
  reviewedAt: dbData.reviewed_at,
  reviewerNotes: dbData.reviewer_notes,
});
