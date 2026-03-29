"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, Shield, Globe } from "lucide-react";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { CheckoutButton } from "@/components/CheckoutButton";
import { AsciiRenderer } from "@/uicapsule/ascii-renderer/ascii-renderer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* ASCII RENDER SECTION */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <AsciiRenderer />
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-sm text-neutral-300 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            GenZVoter is now live
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/get-started" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-black bg-white rounded overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* NAV TRIGGER SENTINEL */}
      <div id="nav-trigger" className="h-px w-full" />

      {/* INVOLVEMENT SECTION */}
      <section id="pricing" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
         <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Involvement</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Choose the level of involvement that fits your goals.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded bg-neutral-900/50 border border-white/10 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <p className="text-neutral-400 text-sm mb-4">Perfect for testing the waters.</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-neutral-500 text-sm">/ forever</span>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {["Basic email capture", "Community access", "Standard support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-neutral-500" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/involvement" className="w-full py-2.5 rounded bg-white/10 hover:bg-white/20 transition-colors font-medium text-sm text-center">
              Get Started
            </Link>
          </div>

          {/* Pro Tier - Highlighted */}
          <div className="relative p-6 rounded bg-linear-to-b from-neutral-800 to-neutral-900 border border-primary-500/30 flex flex-col overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
            <h3 className="text-xl font-semibold mb-2 text-white">Pro Plan</h3>
            <p className="text-primary-500/80 text-sm mb-4">For serious mobilization efforts.</p>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-neutral-500 text-sm">/ month</span>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {["Unlimited email captures", "Stripe subscription flow", "Priority support", "Custom analytics"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-primary-500" /> {item}
                </li>
              ))}
            </ul>
            <CheckoutButton />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="bg-primary-600/10 border border-primary-500/20 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="text-left flex-1 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to make an impact?</h2>
            <p className="text-primary-100/80 text-sm md:text-base">Join the waitlist today to secure your spot for the launch.</p>
          </div>
          <div className="w-full md:w-auto min-w-[300px] relative z-10">
            <EmailCaptureForm source="landing_page_footer" />
          </div>
        </div>
      </section>
    </div>
  );
}
