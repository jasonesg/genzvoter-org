"use client";

import { useState } from "react";
import { createStripeSession } from "@/app/actions";
import { Loader2 } from "lucide-react";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const result = await createStripeSession();
    
    if (result.url) {
      window.location.href = result.url; // Redirect to Stripe Checkout
    } else {
      console.error(result.error);
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 rounded bg-primary-600 hover:bg-primary-500 transition-colors font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] flex justify-center items-center h-12 disabled:opacity-70"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe Now"}
    </button>
  );
}
