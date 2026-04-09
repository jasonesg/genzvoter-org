"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Heart, ChevronLeft, ChevronRight,
  LogOut, User, Home, Bookmark, MessageSquare, Bell,
  Settings, Menu, X, MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SECTIONS, MOCK_PROPERTIES, imgUrl } from "@/lib/mockProperties";
import MapView from "@/components/dashboard/MapView";

const NAV_ITEMS = [
  { id: "browse",   label: "Browse",   Icon: Home },
  { id: "map",      label: "Map",      Icon: MapPin },
  { id: "saved",    label: "Saved",    Icon: Bookmark },
  { id: "messages", label: "Messages", Icon: MessageSquare },
  { id: "alerts",   label: "Alerts",   Icon: Bell },
  { id: "settings", label: "Settings", Icon: Settings },
];

// ── Redfin-style property card ──────────────────────────────────────
function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/dashboard/listing/${property.id}`} className="shrink-0 w-72 group cursor-pointer">
      <div className="bg-white rounded-2xl border border-[#e0dfdb] overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[#e0dfdb] overflow-hidden">
          <img
            src={imgUrl(property.photoId, 480, 320)}
            alt={property.type}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {property.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              {property.tag}
            </span>
          )}
          {property.openHouse && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#27BE5D] rounded-full text-xs font-semibold text-white">
              Open: {property.openHouse}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s); }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-[#27BE5D] text-[#27BE5D]" : "text-[#7A6555]"}`} />
          </button>
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <p className="text-lg font-bold text-[#1C1410] leading-tight mb-1">{property.price}</p>
          <p className="text-sm text-[#4A3728] mb-1">
            <span className="font-semibold">{property.beds} bds</span>
            {" | "}
            <span className="font-semibold">{property.baths} ba</span>
            {" | "}
            <span className="font-semibold">{property.sqft.toLocaleString()} sqft</span>
            {" | "}
            {property.listingType}
          </p>
          <p className="text-sm text-[#1C1410] mb-2 leading-snug">{property.address}</p>
          <p className="text-xs text-[#7A6555] truncate">
            {property.broker}, {property.agent} {property.dre}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── See-all card (last item in each row) ───────────────────────────
function SeeAllCard({ slug, count, title }) {
  return (
    <Link
      href={`/dashboard/browse/${slug}`}
      className="shrink-0 w-72 group"
    >
      <div
        className="flex flex-col items-center justify-center gap-4 h-full rounded-2xl border-2 border-dashed border-[#D4C5B0] hover:border-[#27BE5D] hover:bg-[#F0FBF4] transition-all duration-200 cursor-pointer"
        style={{ minHeight: 260 }}
      >
        <div className="w-14 h-14 rounded-full bg-[#1C1410] flex items-center justify-center group-hover:bg-[#27BE5D] transition-colors">
          <ChevronRight className="w-6 h-6 text-[#f5f4f1]" />
        </div>
        <div className="text-center px-6">
          <p className="text-sm font-bold text-[#1C1410] group-hover:text-[#27BE5D] transition-colors">
            Show all {count} homes
          </p>
          <p className="text-xs text-[#7A6555] mt-1 leading-snug">{title}</p>
        </div>
      </div>
    </Link>
  );
}

// ── Scrollable row ──────────────────────────────────────────────────
function PropertyRow({ title, slug, properties }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-bold text-[#1C1410]">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="p-1.5 rounded-full border border-[#e0dfdb] bg-white hover:bg-[#eceae6] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#1C1410]" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-full border border-[#e0dfdb] bg-white hover:bg-[#eceae6] transition-colors">
            <ChevronRight className="w-4 h-4 text-[#1C1410]" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        <SeeAllCard slug={slug} count={properties.length} title={title} />
      </div>
    </div>
  );
}


// ── Inner dashboard (reads search params) ──────────────────────────
function DashboardInner({ user, profile, onSignOut }) {
  const searchParams   = useSearchParams();
  const initialNav     = searchParams.get("nav") || "browse";

  const [activeNav, setActiveNav] = useState(initialNav);
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prefer profile name (set during onboarding) over auth metadata
  const displayName  = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You";
  const avatarLetter = displayName[0]?.toUpperCase() || "U";

  // Compute filtered sections based on activeTab and searchInput
  const filteredSections = SECTIONS.map(section => {
    const filtered = section.properties.filter(p => {
      const matchesTab =
        activeTab === "all" ? true :
        activeTab === "rent" ? p.price.includes("/mo") :
        !p.price.includes("/mo");

      const query = searchInput.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.address.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
    return { ...section, properties: filtered };
  }).filter(section => section.properties.length > 0);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f5f4f1" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col w-56 border-r border-[#e0dfdb]
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ backgroundColor: "#eceae6" }}
      >
        <div className="px-5 py-5 border-b border-[#e0dfdb] flex items-center justify-between">
          <Link href="/dashboard">
            <img src="/logo.png" alt="Houdys" className="h-8 w-auto" />
          </Link>
          <button className="md:hidden p-1 rounded-lg hover:bg-[#e0dfdb] transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 text-[#7A6555]" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeNav === id
                  ? "bg-[#1C1410] text-[#f5f4f1]"
                  : "text-[#4A3728] hover:bg-[#e0dfdb] hover:text-[#1C1410]"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#e0dfdb]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1C1410] flex items-center justify-center text-[#f5f4f1] text-sm font-bold shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1C1410] truncate">{displayName}</p>
              <p className="text-xs text-[#7A6555] truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/onboarding" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#4A3728] bg-[#e0dfdb] hover:bg-[#D4C5B0] transition-colors">
              <User className="w-3 h-3" /> Profile
            </Link>
            <button onClick={onSignOut} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#4A3728] bg-[#e0dfdb] hover:bg-[#D4C5B0] transition-colors">
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-56">

        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[#e0dfdb] backdrop-blur-md" style={{ backgroundColor: "rgba(245,244,241,0.95)" }}>
          <div className="px-5 py-3 flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl border border-[#e0dfdb] bg-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4 text-[#1C1410]" />
            </button>

            <div className="flex items-center gap-1 bg-[#eceae6] rounded-full p-1 border border-[#e0dfdb]">
              {[{ id: "all", label: "All" }, { id: "rent", label: "Rent" }, { id: "buy", label: "Buy" }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id ? "bg-white text-[#1C1410] shadow-sm" : "text-[#7A6555] hover:text-[#1C1410]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 flex items-center bg-white rounded-full border border-[#e0dfdb] shadow-sm overflow-hidden divide-x divide-[#e0dfdb]">
              <div className="flex-1 px-4 py-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search destinations"
                  className="w-full text-sm text-[#4A3728] placeholder-[#B0A090] bg-transparent focus:outline-none"
                />
              </div>
              <div className="px-4 py-2 hidden sm:block">
                <p className="text-sm text-[#7A6555]">
                  {activeTab === "all" ? "Rent or Buy" : activeTab === "rent" ? "For Rent" : "For Sale"}
                </p>
              </div>
              <div className="px-4 py-2 hidden lg:block">
                <p className="text-sm text-[#7A6555]">Any beds</p>
              </div>
              <button className="shrink-0 m-1.5 p-2.5 bg-[#27BE5D] rounded-full hover:bg-[#297A46] transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            <Link href="/signup?mode=broker" className="hidden lg:block shrink-0 text-sm font-medium text-[#7A6555] hover:text-[#1C1410] transition-colors whitespace-nowrap">
              Become a broker
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col">
          {activeNav === "map" ? (
            <div className="flex-1" style={{ height: "calc(100vh - 57px)" }}>
              <MapView filter={activeTab} zipCode={profile?.zip_code} />
            </div>
          ) : (
            <div className="px-6 py-8">
              {filteredSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Search className="w-12 h-12 text-[#27BE5D] opacity-30" />
                  <p className="text-lg font-semibold text-[#1C1410]">No listings found</p>
                  <p className="text-sm text-[#7A6555]">
                    Try adjusting your search or switching to a different tab.
                  </p>
                </div>
              ) : (
                filteredSections.map(section => (
                  <PropertyRow key={section.title} title={section.title} slug={section.slug} properties={section.properties} />
                ))
              )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

// ── Main dashboard (auth guard) ─────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace("/signup"); return; }
      setUser(data.user);
      // Fetch profile for full_name + zip_code
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, zip_code")
        .eq("id", data.user.id)
        .single();
      setProfile(prof ?? null);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/signup");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f4f1" }}>
        <div className="w-6 h-6 rounded-full border-2 border-[#27BE5D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <Suspense>
      <DashboardInner user={user} profile={profile} onSignOut={handleSignOut} />
    </Suspense>
  );
}
