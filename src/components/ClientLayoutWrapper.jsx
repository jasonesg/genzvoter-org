"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { Twitter, Instagram, Linkedin } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/subprocessors", label: "Subprocessors" },
  { href: "/get-started", label: "Flea Playground" },
];

const RESOURCE_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/icp-survey", label: "ICP Survey" },
];

const SOCIAL_LINKS = [
  { href: "https://x.com/houdys", label: "X", Icon: Twitter },
  { href: "https://instagram.com/houdys", label: "Instagram", Icon: Instagram },
  { href: "https://linkedin.com/company/houdys", label: "LinkedIn", Icon: Linkedin },
];

export function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/get-started" || pathname === "/signup" || pathname === "/onboarding";
  const isDashboard = pathname.startsWith("/dashboard");
  const isSurveyPage = pathname === "/icp-survey";
  const isDesignerDash = pathname === "/designer-dashboard";

  if (isAuthPage || isDesignerDash) {
    return (
      <div className="relative h-screen flex flex-col bg-white selection:bg-primary-500/20">
        <main className="flex-1 h-full">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    );
  }

  // Dashboard: render directly — PageTransition applies CSS filter which breaks
  // fixed positioning on the sidebar (filter creates a new containing block).
  if (isDashboard) {
    return <>{children}</>;
  }

  // Survey pages: full-screen, no global header/footer — FormRunner owns its layout.
  if (isSurveyPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-primary-500/20" style={{ backgroundColor: "#f5f4f1" }}>
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="border-t border-[#e0dfdb] pt-14 pb-10 px-6" style={{ backgroundColor: "#f5f4f1" }}>
        <div className="max-w-[1200px] mx-auto">

          {/* Top row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="font-serif font-bold text-2xl text-[#1C1410] mb-3 inline-block">
                Houdy&apos;s
              </Link>
              <p className="text-sm text-[#7A6555] max-w-xs leading-relaxed">
                Find your next home. Browse listings, connect with brokers, and move faster.
              </p>
              {/* Social icons */}
              <div className="flex gap-4 mt-5">
                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-[#e0dfdb] flex items-center justify-center text-[#7A6555] hover:bg-[#1C1410] hover:text-[#f5f4f1] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-[#1C1410] uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-3">
                {PRODUCT_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-[#7A6555] hover:text-[#1C1410] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold text-[#1C1410] uppercase tracking-widest mb-4">Resources</p>
              <ul className="space-y-3">
                {RESOURCE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-[#7A6555] hover:text-[#1C1410] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom row */}
          <div className="border-t border-[#e0dfdb] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#7A6555]">© {new Date().getFullYear()} Houdy&apos;s. All rights reserved.</p>
            <Link href="/sitemap" className="text-xs text-[#7A6555] hover:text-[#1C1410] transition-colors">
              Sitemap
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}
