"use server";

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function captureEmail(formData) {
  const email = formData.get("email")?.toString();
  const firstName = formData.get("first_name")?.toString() || null;
  const lastName = formData.get("last_name")?.toString() || null;
  const source = formData.get("source")?.toString() || "landing_page";

  if (!email) {
    return { error: "Email is required" };
  }

  // Use the Service Role Key to bypass RLS policies safely on the server
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabaseAdmin
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

export async function createStripeSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Plan Subscription',
              description: 'Unlimited captures and premium features.',
            },
            unit_amount: 1900,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?canceled=true`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Error:", error);
    return { error: "Failed to create checkout session." };
  }
}
