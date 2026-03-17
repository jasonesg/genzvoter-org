"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, Shield, Globe } from "lucide-react";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { CheckoutButton } from "@/components/CheckoutButton";

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            GenZVoter is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Empowering the Next Generation of Voters.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            A premium, dynamic platform to capture insights, mobilize, and subscribe to the future of democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Built with modern tools for a seamless experience.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Next.js App Router for instant page loads and seamless transitions." },
            { icon: Shield, title: "Secure Data", desc: "Supabase backend ensures your email captures and user data are safe." },
            { icon: Globe, title: "Global Reach", desc: "Deployed on Vercel's Edge Network for global low-latency access." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-6 text-primary-500 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
         <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Start capturing emails and processing subscriptions via Stripe.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/10 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">Starter</h3>
            <p className="text-neutral-400 mb-6">Perfect for testing the waters.</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-neutral-500">/ forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Basic email capture", "Community access", "Standard support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-neutral-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-medium">
              Get Started
            </button>
          </div>

          {/* Pro Tier - Highlighted */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-primary-500/30 flex flex-col overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
            <h3 className="text-2xl font-semibold mb-2 text-white">Pro Plan</h3>
            <p className="text-primary-500/80 mb-6">For serious mobilization efforts.</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold">$19</span>
              <span className="text-neutral-500">/ month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited email captures", "Stripe subscription flow", "Priority support", "Custom analytics"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" /> {item}
                </li>
              ))}
            </ul>
            <CheckoutButton />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-primary-600 rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to make an impact?</h2>
          <p className="text-primary-100 mb-10 text-lg max-w-xl mx-auto relative z-10">Join the waitlist today to secure your spot for the launch.</p>
          <div className="w-full relative z-10">
            <EmailCaptureForm source="landing_page_footer" />
          </div>
        </div>
      </section>
    </div>
  );
}
