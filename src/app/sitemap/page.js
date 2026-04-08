import Link from "next/link";

export const metadata = {
  title: "Sitemap — Houdy's",
};

const SECTIONS = [
  {
    heading: "Main",
    links: [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/thoughts", label: "News" },
      { href: "/icp-survey", label: "ICP Survey" },
    ],
  },
  {
    heading: "Product",
    links: [
      { href: "/signup", label: "Sign Up" },
      { href: "/onboarding", label: "Onboarding" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/get-started", label: "Get Started" },
    ],
  },
  {
    heading: "Legal & Info",
    links: [
      { href: "/subprocessors", label: "Subprocessors" },
      { href: "/involvement", label: "Involvement" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <div className="max-w-[700px] mx-auto px-5 py-16">
        <h1 className="font-serif font-bold text-[2em] text-[#1C1410] mb-10">
          Sitemap
        </h1>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="border-t border-[#e0dfdb] pt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#B0A898] mb-4">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#1C1410] hover:underline underline-offset-4 decoration-[#D1C9BF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-10 pt-6 border-t border-[#e0dfdb] flex items-center justify-between text-[10pt] text-[#7A6555]/70">
          <Link href="/sitemap" className="hover:underline">
            Sitemap
          </Link>
          <span>&copy; {new Date().getFullYear()} Houdy&apos;s</span>
        </footer>
      </div>
    </div>
  );
}
