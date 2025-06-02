// --- src/services/paymentApis.ts ---
import { supabase } from "../supabaseClient"; // For getting JWT
import { PaymentMethod, NewPaymentMethodData, StripeIntentResponse } from "../types";
import { AuthenticationRequiredError } from "./creditApis";

const BACKEND_API_URL =
  import.meta.env.VITE_PAYMENT_BACKEND_URL || "http://localhost:3001/api/stripe"; // Adjust if needed

// Helper to get Supabase JWT for authenticated requests to your backend
const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new AuthenticationRequiredError("User not authenticated.");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.access_token}`,
  };
};

/**
 * Fetches a Stripe SetupIntent client secret from your backend.
 */
export const createStripeSetupIntent = async (): Promise<StripeIntentResponse> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BACKEND_API_URL}/create-setup-intent`, {
    method: "POST",
    headers: headers,
  });
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to create setup intent: Server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  return response.json();
};

/**
 * Saves a new payment method (e.g., Stripe PaymentMethod ID) via your backend.
 */
export const savePaymentMethod = async (
  paymentMethodData: NewPaymentMethodData
): Promise<PaymentMethod> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BACKEND_API_URL}/save-payment-method`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(paymentMethodData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to save payment method: Server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetches the user's saved payment methods from your backend.
 */
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BACKEND_API_URL}/payment-methods`, {
    method: "GET",
    headers: headers,
  });
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to get payment methods: Server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  return response.json();
};

/**
 * Deletes a payment method via your backend.
 */
export const deleteUserPaymentMethod = async (paymentMethodInternalId: string): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BACKEND_API_URL}/payment-methods/${paymentMethodInternalId}`, {
    method: "DELETE",
    headers: headers,
  });
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to delete payment method: Server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  // No content expected for successful DELETE usually
};

/**
 * Sets a payment method as default via your backend.
 */
export const setDefaultUserPaymentMethod = async (
  paymentMethodInternalId: string
): Promise<PaymentMethod> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BACKEND_API_URL}/payment-methods/${paymentMethodInternalId}/set-default`,
    {
      method: "POST",
      headers: headers,
    }
  );
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to set default payment method: Server error" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  return response.json();
};

/**
 * Creates a PaymentIntent on your backend for processing a payment.
 */
export const createPaymentIntent = async (
  amount: number, // Amount in smallest currency unit (e.g., cents)
  currency: string,
  paymentMethodId?: string, // YOUR internal DB ID for a saved payment method
  methodTypes?: ("card" | "paypal")[]
): Promise<StripeIntentResponse> => {
  const headers = await getAuthHeaders();

  const body: { amount: number; currency: string; paymentMethodId?: string; methodTypes?: string[] } = {
    amount,
    currency,
  };

  if (paymentMethodId) {
    body.paymentMethodId = paymentMethodId;
  }
  if (methodTypes) {
    body.methodTypes = methodTypes;
  }

  const response = await fetch(`${BACKEND_API_URL}/create-payment-intent`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to create payment intent: Server error" }));
    return { clientSecret: "", error: errorData.error || `Server error: ${response.status}` };
  }
  const responseData: StripeIntentResponse = await response.json();
  // Ensure clientSecret is explicitly null if not present or empty, matching StripeIntentResponse type
  if (!responseData.clientSecret) {
    return { ...responseData, clientSecret: "" };
  }
  return responseData;
};
