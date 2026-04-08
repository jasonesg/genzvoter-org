"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/thoughts", label: "News" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f4f1]/90 backdrop-blur-md border-b border-[#e0dfdb]">
      <div className="h-16 flex items-center justify-between px-6 max-w-[1200px] mx-auto w-full">
        <Link href="/" className="font-serif font-bold text-xl text-[#1C1410] tracking-tight">
          Houdy&apos;s
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-7 items-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? "text-[#1C1410] font-medium"
                  : "text-[#7A6555] hover:text-[#1C1410]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#1C1410] text-[#f5f4f1] px-5 py-2 rounded-full hover:bg-[#2E2018] transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 text-[#7A6555] hover:text-[#1C1410] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[#e0dfdb] bg-[#f5f4f1]"
          >
            <div className="flex flex-col px-6 py-5 gap-5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#7A6555] hover:text-[#1C1410] transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold bg-[#1C1410] text-[#f5f4f1] px-5 py-2.5 rounded-full text-center hover:bg-[#2E2018] transition-colors"
              >
                Sign up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
