// -----------------------------------------------------------------------------
// Part 3: Updated API Service Functions (Account-Related)
// -----------------------------------------------------------------------------
// These functions would replace or augment those in your existing `src/services/api.ts`.
// They assume you have a `supabaseClient.ts` that exports the `supabase` client.
// For brevity, error handling is simplified. Add more robust error handling in a real app.

import { supabase } from "../supabaseClient"; // Adjust path to your supabase client
import {
  UserAccountDetails,
  Order,
  Address,
  PaymentMethod,
  Product,
  PaginatedResponse,
  GetProductsParams,
} from "../types";
import { getCurrentUserId } from "./index";
import { getProducts } from "./productApis";

const ITEMS_PER_PAGE_DEFAULT = 10;

export class AuthenticationRequiredError extends Error {
  constructor(message = "Authentication is required for this action.") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

// --- ACCOUNT MANAGEMENT ---
export const getUserAccountDetails = async (): Promise<UserAccountDetails | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data: authUser } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, phone_number, gender")
    .eq("id", userId);

  if (error && error.code !== "PGRST116") {
    // PGRST116: no rows found, which is fine if profile not created
    console.error("Error fetching profile:", error);
    throw error;
  }
  if (!data) return null;

  return data
    ? ({ ...data[0], email: authUser.user?.email || "" } as unknown as UserAccountDetails)
    : null;
};

export const updateUserAccountDetails = async (
  details: Partial<Omit<UserAccountDetails, "id" | "email">>
): Promise<{ success: boolean; updatedDetails?: UserAccountDetails }> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new AuthenticationRequiredError();

  const { data: authUser } = await supabase.auth.getUser();

  const updatePayload: any = { updated_at: new Date().toISOString() };
  if (details.first_name !== undefined) updatePayload.first_name = details.first_name;
  if (details.last_name !== undefined) updatePayload.last_name = details.last_name;
  if (details.avatar_url !== undefined) updatePayload.avatar_url = details.avatar_url;
  if (details.phone_number !== undefined) updatePayload.phone_number = details.phone_number;
  if (details.gender !== undefined) updatePayload.gender = details.gender;

  const { data, error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId)
    .select("id, first_name, last_name, avatar_url, phone_number, gender");

  console.log("Updated profile:", data);

  if (error) throw error;
  const updatedDetailsWithEmail = data
    ? ({ ...data[0], email: authUser.user?.email || "" } as unknown as UserAccountDetails)
    : undefined;
  return { success: !!data, updatedDetails: updatedDetailsWithEmail };
};

// User Collection (Wishlist)
export const getUserCollection = async (
  params: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  const userId = await getCurrentUserId();
  if (!userId) return { items: [], totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 };

  const page = params.page || 1;
  const limit = params.limit || ITEMS_PER_PAGE_DEFAULT;
  const offset = (page - 1) * limit;

  // Fetch product_ids from collection_items
  const {
    data: collectionLinks,
    error: collectionError,
    count: collectionCount,
  } = await supabase
    .from("collection_items")
    .select("product_id", { count: "exact" })
    .eq("user_id", userId)
    .order("date_added", { ascending: false }) // Example sort
    .range(offset, offset + limit - 1);

  if (collectionError) throw collectionError;
  if (!collectionLinks || collectionLinks.length === 0) {
    return { items: [], totalItems: 0, totalPages: 0, currentPage: page, itemsPerPage: limit };
  }

  const productIds = collectionLinks.map((item) => item.product_id);
  // Fetch actual product details for these IDs
  const productsResponse = await getProducts({
    ids: productIds.join(","),
    limit: productIds.length,
  }); // Fetch all linked products
  return {
    items: productsResponse.items,
    totalItems: collectionCount || 0,
    totalPages: Math.ceil((collectionCount || 0) / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
};

export const addToCollection = async (productId: string): Promise<{ success: boolean }> => {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false };

  const { error } = await supabase
    .from("collection_items")
    .insert({ user_id: userId, product_id: productId });
  if (error && error.code !== "23505") throw error; // 23505 is unique_violation, item already exists
  return { success: !error || error.code === "23505" };
};

export const removeFromCollection = async (productId: string): Promise<{ success: boolean }> => {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false };

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .match({ user_id: userId, product_id: productId });
  if (error) throw error;
  return { success: true };
};

// User Orders
export const getUserOrders = async (params: {
  page?: number;
  limit?: number;
  status?: Order["status"];
}): Promise<PaginatedResponse<Order>> => {
  const userId = await getCurrentUserId();
    const page = params.page || 1;
  const limit = params.limit || ITEMS_PER_PAGE_DEFAULT;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select(`*, order_items(*)`, { count: "exact" }) // Fetch related order_items
    .eq("user_id", userId);

  if (params.status) query = query.eq("status", params.status);
  query = query.order("date_placed", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return {
    items: (data as Order[]) || [],
    totalItems: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
};

// User Addresses
export const getUserAddresses = async (): Promise<Address[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addUserAddress = async (
  addressInput: Omit<Address, "id" | "user_id" | "isDefault">
): Promise<Address> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("addresses")
    .insert([{ ...addressInput, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data as Address;
};

export const updateUserAddress = async (
  addressId: string,
  updates: Partial<Omit<Address, "id" | "user_id">>
): Promise<Address> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("addresses")
    .update({ ...updates, updated_at: new Date() })
    .match({ id: addressId, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  if (!data) throw new Error("Address not found or permission denied.");
  return data as Address;
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .match({ id: addressId, user_id: userId });
  if (error) throw error;
};

export const setDefaultAddress = async (
  addressId: string,
): Promise<void> => {
  const userId = await getCurrentUserId();
  // Use an RPC function for transactions in Supabase for atomicity
  const { error } = await supabase.rpc("set_default_address", {
    p_user_id: userId,
    p_address_id: addressId,
    p_address_type: "Both",
  });
  if (error) throw error;
};

// User Payment Methods
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });
  if (error) throw error;
  return data || [];
};
// Add/Update/Delete for Payment Methods would be similar, keeping in mind PCI compliance.
