"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // On non-landing routes, keep the nav always visible.
    if (pathname !== "/") {
      setVisible(true);
      return;
    }

    const heroThreshold = () => window.innerHeight * 0.6;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      // Hide nav while user is in the top ~60% of the first viewport (ASCII hero),
      // show it once they've scrolled past that region.
      setVisible(y >= heroThreshold());
    };

    // Initialize on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 inset-x-0 h-16 border-b border-white/10 bg-black/50 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12"
        >
          <Link href="/" className="font-bold text-xl tracking-tighter text-white">
            GenZVoter
          </Link>
          <div className="flex gap-6 items-center flex-row">
            <Link href="/involvement" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Involvement
            </Link>
            <Link href="/thoughts" className="text-sm text-neutral-400 hover:text-white transition-colors">
              News
            </Link>
            <a
              href="/#pricing"
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded hover:bg-neutral-200 transition-colors"
            >
              Vote Waitlist
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

