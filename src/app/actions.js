"use server";

import { supabase } from "@/lib/supabase";

export async function captureEmail(formData) {
  const email = formData.get("email")?.toString();
  const firstName = formData.get("first_name")?.toString() || null;
  const lastName = formData.get("last_name")?.toString() || null;
  const source = formData.get("source")?.toString() || "landing_page";

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const { data, error } = await supabase
      .from("email_captures")
      .insert([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          source,
        },
      ]);

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === '23505') {
         return { success: true, message: "You're already on the list!" };
      }
      console.error("Supabase Error:", error);
      return { error: "Failed to join waitlist. Please try again." };
    }

    return { success: true, message: "Successfully joined the waitlist!" };
  } catch (err) {
    console.error("Action Error:", err);
    return { error: "An unexpected error occurred." };
  }
}
