"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, MessageSquare, Star, Home, Briefcase } from "lucide-react";
import { AsciiRenderer } from "@/uicapsule/ascii-renderer/ascii-renderer";
import Link from "next/link";

const FEATURES = [
  {
    icon: Search,
    title: "Smart property search",
    desc: "Filter by price, location, size, and amenities. Find exactly what you're looking for in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Direct broker messaging",
    desc: "Skip the back-and-forth. Connect directly with licensed agents and schedule viewings instantly.",
  },
  {
    icon: Star,
    title: "Save your favourites",
    desc: "Build a shortlist of properties you love and revisit them anytime from any device.",
  },
];

const SHOPPER_FEATURES = ["Browse rent & buy listings", "Advanced price & location filters", "Save unlimited favourites", "Get instant broker contact"];
const BROKER_FEATURES = ["List unlimited properties", "Featured placement in search", "Lead management dashboard", "Performance analytics"];

export default function LandingPage() {
  return (
    <div className="w-full">

      {/* ── HERO — ASCII art ── */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <AsciiRenderer />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center gap-5 px-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/80 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Actively building at Houdys
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-xs sm:max-w-none">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 text-sm font-semibold text-[#1C1410] bg-[#FBF4E8] rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              Sign up for Houdys
            </Link>
            <Link
              href="/get-started"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              Flea Playground <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── TAGLINE ── */}
      <section className="py-24 px-6 text-center max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#1C1410] leading-tight mb-6">
            Find your next home,<br />
            <span className="text-[#27BE5D]">on your terms.</span>
          </h1>
          <p className="text-lg text-[#7A6555] max-w-2xl mx-auto">
            Houdys connects shoppers and brokers in a single, beautifully simple platform. Browse listings, message agents, and move faster.
          </p>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-7 rounded-2xl bg-[#F5EDD8] border border-[#E2D5C3]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1C1410] flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-[#FBF4E8]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1C1410] mb-2">{title}</h3>
              <p className="text-sm text-[#7A6555] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SHOPPER vs BROKER ── */}
      <section className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1C1410] mb-4">Built for everyone<br />in real estate</h2>
          <p className="text-[#7A6555] max-w-xl mx-auto">Whether you're hunting for your next place or closing deals for clients, Houdys has a dedicated experience for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shopper */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-[#1C1410] text-[#FBF4E8]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FBF4E8]/10 flex items-center justify-center mb-6">
              <Home className="w-5 h-5 text-[#FBF4E8]" />
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2">For Shoppers</h3>
            <p className="text-[#FBF4E8]/60 text-sm mb-6">Looking to rent or buy? We've got thousands of listings waiting for you.</p>
            <ul className="space-y-3 mb-8">
              {SHOPPER_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#FBF4E8]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27BE5D] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FBF4E8] bg-[#27BE5D] px-5 py-2.5 rounded-full hover:bg-[#297A46] transition-colors">
              Start browsing <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Broker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-[#F5EDD8] border border-[#E2D5C3]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1C1410] flex items-center justify-center mb-6">
              <Briefcase className="w-5 h-5 text-[#FBF4E8]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#1C1410] mb-2">For Brokers</h3>
            <p className="text-[#7A6555] text-sm mb-6">Grow your client base and manage listings all in one place.</p>
            <ul className="space-y-3 mb-8">
              {BROKER_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#4A3728]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27BE5D] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FBF4E8] bg-[#1C1410] px-5 py-2.5 rounded-full hover:bg-[#2E2018] transition-colors">
              List your properties <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#27BE5D] px-10 py-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FBF4E8] mb-4">Ready to find your<br />next home?</h2>
          <p className="text-[#FBF4E8]/70 mb-8 max-w-md mx-auto">Join Houdys today and start browsing thousands of properties across the country.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#FBF4E8] text-[#1C1410] px-7 py-3 rounded-full hover:bg-white transition-colors"
          >
            Create your free account <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
