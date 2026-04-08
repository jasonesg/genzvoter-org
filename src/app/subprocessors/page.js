import Link from "next/link";

export const metadata = {
  title: "Subprocessors | Houdys",
  description: "List of third-party subprocessors used by Houdys.",
};

const SUBPROCESSORS = [
  { name: "Supabase", purpose: "Authentication, database, and storage", location: "United States", website: "https://supabase.com" },
  { name: "Vercel", purpose: "Frontend hosting and deployment", location: "United States", website: "https://vercel.com" },
  { name: "Stripe", purpose: "Payment processing and billing", location: "United States", website: "https://stripe.com" },
  { name: "Twilio", purpose: "SMS delivery and phone verification", location: "United States", website: "https://twilio.com" },
  { name: "Google", purpose: "OAuth authentication", location: "United States", website: "https://google.com" },
  { name: "AWS", purpose: "Cloud infrastructure (via Supabase)", location: "United States", website: "https://aws.amazon.com" },
  { name: "Cloudflare", purpose: "CDN, DDoS protection, and DNS", location: "United States", website: "https://cloudflare.com" },
];

export default function SubprocessorsPage() {
  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "#FBF4E8" }}>
      <div className="max-w-[1200px] mx-auto">

        <div className="mb-12">
          <Link href="/" className="text-sm text-[#7A6555] hover:text-[#1C1410] transition-colors mb-8 inline-block">
            ← Houdys
          </Link>
          <h1 className="text-4xl font-serif font-bold text-[#1C1410] mb-4">Subprocessors</h1>
          <p className="text-[#7A6555] text-base max-w-2xl">
            Houdys uses certain third-party subprocessors to provide, improve, and maintain our services.
            This page lists the subprocessors we rely on, what data they handle, and where they're located.
          </p>
          <p className="text-[#7A6555]/70 text-sm mt-4">Last updated: April 4, 2026</p>
        </div>

        {/* Table — desktop */}
        <div className="hidden sm:block rounded-2xl border border-[#E2D5C3] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2D5C3] bg-[#F5EDD8]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A6555] uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A6555] uppercase tracking-wider">Purpose</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A6555] uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#7A6555] uppercase tracking-wider">Website</th>
              </tr>
            </thead>
            <tbody className="bg-[#FBF4E8]">
              {SUBPROCESSORS.map((sp, i) => (
                <tr
                  key={sp.name}
                  className={`hover:bg-[#F5EDD8] transition-colors ${i < SUBPROCESSORS.length - 1 ? "border-b border-[#E2D5C3]" : ""}`}
                >
                  <td className="px-5 py-4 font-semibold text-[#1C1410]">{sp.name}</td>
                  <td className="px-5 py-4 text-[#4A3728]">{sp.purpose}</td>
                  <td className="px-5 py-4 text-[#7A6555]">{sp.location}</td>
                  <td className="px-5 py-4">
                    <a href={sp.website} target="_blank" rel="noopener noreferrer"
                      className="text-[#27BE5D] hover:underline transition-colors">
                      {sp.website.replace("https://", "")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="sm:hidden space-y-4">
          {SUBPROCESSORS.map((sp) => (
            <div key={sp.name} className="rounded-2xl border border-[#E2D5C3] bg-[#F5EDD8] p-5 space-y-2">
              <p className="font-semibold text-[#1C1410]">{sp.name}</p>
              <p className="text-sm text-[#4A3728]">{sp.purpose}</p>
              <p className="text-sm text-[#7A6555]">{sp.location}</p>
              <a href={sp.website} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#27BE5D] hover:underline block">{sp.website.replace("https://", "")}</a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-[#7A6555]">
          Questions about data handling?{" "}
          <a href="mailto:privacy@houdys.com" className="text-[#27BE5D] hover:underline">
            privacy@houdys.com
          </a>
        </p>

      </div>
    </div>
  );
}
