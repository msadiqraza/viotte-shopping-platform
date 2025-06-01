import { supabase } from "../supabaseClient";
import { ContactFormData } from "../types";

export const sendContactForm = async (data: ContactFormData): Promise<boolean> => {
  const { error } = await supabase.from("contact_messages").insert([data]);

  if (error) {
    console.error("Failed to send contact form:", error);
    return false;
  }

  return true;
};
