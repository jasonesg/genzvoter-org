"use client";

import { useState } from "react";
import { captureEmail } from "@/app/actions";
import { Loader2, CheckCircle2 } from "lucide-react";

export function EmailCaptureForm({ source = "landing_page_hero" }) {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  async function clientAction(formData) {
    setStatus("loading");
    formData.append("source", source);
    
    const result = await captureEmail(formData);
    
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result.success) {
      setStatus("success");
      setMessage(result.message);
    }
  }

  if (status === "success") {
    return (
<<<<<<< HEAD
      <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 w-full max-w-md mx-auto">
=======
      <div className="flex items-center justify-center gap-3 px-6 py-4 rounded bg-green-500/20 border border-green-500/30 text-green-400 w-full max-w-md mx-auto">
>>>>>>> master
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <form action={clientAction} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto relative z-10">
      <div className="flex-1 flex flex-col gap-2">
         <div className="flex gap-2">
            <input 
              type="text" 
              name="first_name" 
              placeholder="First Name" 
              className="w-1/2 px-5 py-4 rounded-full bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md" 
            />
            <input 
              type="text" 
              name="last_name" 
              placeholder="Last Name" 
              className="w-1/2 px-5 py-4 rounded-full bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md" 
            />
         </div>
         <input 
           type="email" 
           name="email" 
           required 
           placeholder="Enter your email" 
           className="w-full px-5 py-4 rounded-full bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md" 
         />
         {status === "error" && (
           <p className="text-red-400 text-sm text-left px-4">{message}</p>
         )}
      </div>
      <button 
        type="submit" 
        disabled={status === "loading"}
        className="self-end sm:self-auto h-[104px] sm:h-auto px-8 py-4 bg-white text-black font-bold rounded-3xl hover:bg-neutral-200 transition-colors whitespace-nowrap flex items-center justify-center disabled:opacity-70"
      >
        {status === "loading" ? <Loader2 className="w-5 h-5 auto-spin animate-spin" /> : "Join Waitlist"}
=======
    <form
      action={clientAction}
      className="flex flex-col gap-4 w-full max-w-lg mx-auto relative z-10"
    >
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="flex-1 px-5 py-4 rounded bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your Email"
          className="flex-1 px-5 py-4 rounded bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-md"
        />
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm text-left px-1">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-8 py-3 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors whitespace-nowrap flex items-center justify-center disabled:opacity-70"
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 auto-spin animate-spin" />
        ) : (
          "Join Waitlist"
        )}
>>>>>>> master
      </button>
    </form>
  );
}
