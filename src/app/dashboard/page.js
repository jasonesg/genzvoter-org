"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Heart, Star, ChevronLeft, ChevronRight,
  LogOut, User, Home, Bookmark, MessageSquare, Bell,
  Settings, Menu, X, MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SECTIONS, MOCK_PROPERTIES, imgUrl } from "@/lib/mockProperties";

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
      <div className="bg-white rounded-2xl border border-[#E2D5C3] overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[#E2D5C3] overflow-hidden">
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
          <ChevronRight className="w-6 h-6 text-[#FBF4E8]" />
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
          <button onClick={() => scroll("left")} className="p-1.5 rounded-full border border-[#E2D5C3] bg-white hover:bg-[#F5EDD8] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#1C1410]" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-full border border-[#E2D5C3] bg-white hover:bg-[#F5EDD8] transition-colors">
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

// ── Map view ────────────────────────────────────────────────────────
function MapView({ initialZip = "" }) {
  const [zipInput, setZipInput]   = useState(initialZip);
  const [searching, setSearching] = useState(false);
  const [coords, setCoords]       = useState(null);
  const [mapZip, setMapZip]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [error, setError]         = useState("");

  async function searchZip(zip) {
    if (!zip) return;
    setSearching(true);
    setError("");
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=US&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data[0]) {
        setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
        setMapZip(zip);
      } else {
        setError("ZIP code not found. Try another.");
      }
    } catch {
      setError("Couldn't load map. Check your connection.");
    }
    setSearching(false);
  }

  useEffect(() => {
    if (initialZip) searchZip(initialZip);
  }, [initialZip]);

  async function handleSearch(e) {
    e.preventDefault();
    await searchZip(zipInput.trim());
  }

  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.06},${coords.lat - 0.06},${coords.lon + 0.06},${coords.lat + 0.06}&layer=mapnik`
    : null;

  const nearby = MOCK_PROPERTIES.filter(p =>
    filter === "all"  ? true :
    filter === "rent" ? p.price.includes("/mo") :
                        !p.price.includes("/mo")
  );

  return (
    <div className="px-6 py-8">
      <h2 className="text-xl font-serif font-bold text-[#1C1410] mb-1">Map search</h2>
      <p className="text-sm text-[#7A6555] mb-5">Enter a ZIP code to explore listings nearby.</p>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center bg-white rounded-full border border-[#E2D5C3] shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5">
            <MapPin className="w-4 h-4 text-[#7A6555] shrink-0" />
            <input
              type="text"
              value={zipInput}
              onChange={e => setZipInput(e.target.value)}
              placeholder="Enter ZIP code"
              maxLength={10}
              className="w-32 text-sm text-[#4A3728] placeholder-[#B0A090] bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="shrink-0 m-1.5 px-4 py-2 bg-[#27BE5D] text-white text-sm font-medium rounded-full hover:bg-[#297A46] transition-colors disabled:opacity-60"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#F5EDD8] rounded-full p-1 border border-[#E2D5C3]">
          {[{ id: "all", label: "All" }, { id: "rent", label: "Rent" }, { id: "buy", label: "Buy" }].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f.id ? "bg-white text-[#1C1410] shadow-sm" : "text-[#7A6555] hover:text-[#1C1410]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </form>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {mapSrc ? (
        <div className="rounded-2xl overflow-hidden border border-[#E2D5C3] shadow-sm mb-8" style={{ height: 360 }}>
          <iframe title="Property map" src={mapSrc} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2D5C3] bg-[#F5EDD8] flex flex-col items-center justify-center gap-3 mb-8" style={{ height: 360 }}>
          <MapPin className="w-10 h-10 text-[#27BE5D] opacity-50" />
          <p className="text-sm text-[#7A6555]">Enter a ZIP code above to load the map</p>
        </div>
      )}

      <div>
        <h3 className="text-base font-serif font-bold text-[#1C1410] mb-4">
          {mapZip ? `Listings near ${mapZip}` : "Sample listings"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearby.slice(0, 6).map(p => (
            <Link key={p.id} href={`/dashboard/listing/${p.id}`} className="bg-white rounded-2xl border border-[#E2D5C3] overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="relative aspect-[4/3] bg-[#E2D5C3]">
                <img
                  src={imgUrl(p.photoId, 480, 320)}
                  alt={p.type}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.openHouse && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#27BE5D] rounded-full text-xs font-semibold text-white">
                    Open: {p.openHouse}
                  </span>
                )}
                {p.tag && !p.openHouse && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 rounded-full text-xs font-semibold text-white">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-base font-bold text-[#1C1410] mb-1">{p.price}</p>
                <p className="text-sm text-[#4A3728] mb-1">
                  <span className="font-semibold">{p.beds} bds</span> | <span className="font-semibold">{p.baths} ba</span> | <span className="font-semibold">{p.sqft.toLocaleString()} sqft</span>
                </p>
                <p className="text-sm text-[#1C1410] mb-1 leading-snug">{p.address}</p>
                <p className="text-xs text-[#7A6555] truncate">{p.broker}, {p.agent} {p.dre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inner dashboard (reads search params) ──────────────────────────
function DashboardInner({ user, onSignOut }) {
  const searchParams   = useSearchParams();
  const initialNav     = searchParams.get("nav") || "browse";
  const initialZip     = searchParams.get("zip") || "";

  const [activeNav, setActiveNav] = useState(initialNav);
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarLetter = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";
  const displayName  = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You";

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
    <div className="flex min-h-screen" style={{ backgroundColor: "#FBF4E8" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col w-56 border-r border-[#E2D5C3]
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ backgroundColor: "#F5EDD8" }}
      >
        <div className="px-5 py-5 border-b border-[#E2D5C3] flex items-center justify-between">
          <Link href="/dashboard">
            <img src="/logo.png" alt="Houdys" className="h-8 w-auto" />
          </Link>
          <button className="md:hidden p-1 rounded-lg hover:bg-[#E2D5C3] transition-colors" onClick={() => setSidebarOpen(false)}>
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
                  ? "bg-[#1C1410] text-[#FBF4E8]"
                  : "text-[#4A3728] hover:bg-[#E2D5C3] hover:text-[#1C1410]"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#E2D5C3]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1C1410] flex items-center justify-center text-[#FBF4E8] text-sm font-bold shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1C1410] truncate">{displayName}</p>
              <p className="text-xs text-[#7A6555] truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/onboarding" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#4A3728] bg-[#E2D5C3] hover:bg-[#D4C5B0] transition-colors">
              <User className="w-3 h-3" /> Profile
            </Link>
            <button onClick={onSignOut} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#4A3728] bg-[#E2D5C3] hover:bg-[#D4C5B0] transition-colors">
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-56">

        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[#E2D5C3] backdrop-blur-md" style={{ backgroundColor: "rgba(251,244,232,0.95)" }}>
          <div className="px-5 py-3 flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl border border-[#E2D5C3] bg-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4 text-[#1C1410]" />
            </button>

            <div className="flex items-center gap-1 bg-[#F5EDD8] rounded-full p-1 border border-[#E2D5C3]">
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

            <div className="flex-1 flex items-center bg-white rounded-full border border-[#E2D5C3] shadow-sm overflow-hidden divide-x divide-[#E2D5C3]">
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
        <main className="flex-1">
          {activeNav === "map" ? (
            <MapView initialZip={initialZip} />
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/signup");
      else { setUser(data.user); setLoading(false); }
    });
  }, [router]);

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/signup");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBF4E8" }}>
        <div className="w-6 h-6 rounded-full border-2 border-[#27BE5D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <Suspense>
      <DashboardInner user={user} onSignOut={handleSignOut} />
    </Suspense>
  );
}
