// Add these to src/services/api.ts (Supabase Version)
import { supabase } from "../supabaseClient"; // Ensure this path is correct
import { User, AuthError, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";

// --- AUTHENTICATION ---
export const signInUser = async (credentials: SignInWithPasswordCredentials): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { user: data.user, error };
};

export const signUpUser = async (credentials: SignUpWithPasswordCredentials): Promise<{ user: User | null; session: any | null; error: AuthError | null }> => {
  // You can add options here, e.g., for email redirect or custom data
  // const { data, error } = await supabase.auth.signUp({
  //   email: credentials.email,
  //   password: credentials.password,
  //   options: {
  //     data: {
  //       first_name: 'John', // Example: If you want to store this in user_metadata
  //     },
  //     // emailRedirectTo: `${window.location.origin}/welcome`
  //   }
  // });
  const { data, error } = await supabase.auth.signUp(credentials);
  return { user: data.user, session: data.session, error };
};

export const signOutUser = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const sendPasswordResetEmail = async (email: string): Promise<{ error: AuthError | null }> => {
  // const redirectUrl = `${window.location.origin}/account/update-password`; // Your frontend route for handling password updates
  // const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
};

export const updateUserPassword = async (newPassword: string): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { user: data.user, error };
};

export const getCurrentSupabaseUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// You might also want a function to listen to auth state changes globally
// export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
//   const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
//   return subscription;
// };
