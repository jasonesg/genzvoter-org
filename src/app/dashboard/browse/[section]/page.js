"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Heart, Star, SlidersHorizontal } from "lucide-react";
import { SECTIONS } from "@/lib/mockProperties";

const FILTERS = ["All", "For Rent", "For Sale", "New", "Featured", "Popular"];

function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/dashboard/listing/${property.id}`} className="group cursor-pointer">
      <div className="bg-white rounded-2xl border border-[#E2D5C3] overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3] bg-[#E2D5C3] overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${property.seed}/480/320`}
            alt={property.type}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {property.openHouse && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#27BE5D] rounded-full text-xs font-semibold text-white">
              Open: {property.openHouse}
            </span>
          )}
          {property.tag && !property.openHouse && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              {property.tag}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s); }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-[#27BE5D] text-[#27BE5D]" : "text-[#7A6555]"}`} />
          </button>
        </div>
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

export default function BrowseSectionPage() {
  const { section } = useParams();
  const router      = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const sectionData = SECTIONS.find(s => s.slug === section);

  if (!sectionData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#FBF4E8" }}>
        <p className="text-[#7A6555]">Section not found.</p>
        <Link href="/dashboard" className="text-sm font-medium text-[#27BE5D] hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const filtered = sectionData.properties.filter(p => {
    if (activeFilter === "All")      return true;
    if (activeFilter === "For Rent") return p.price.includes("/mo");
    if (activeFilter === "For Sale") return !p.price.includes("/mo");
    return p.tag === activeFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FBF4E8" }}>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E2D5C3] backdrop-blur-md" style={{ backgroundColor: "rgba(251,244,232,0.95)" }}>
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#4A3728] hover:text-[#1C1410] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-base font-serif font-bold text-[#1C1410]">{sectionData.title}</h1>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2D5C3] bg-white text-sm font-medium text-[#4A3728] hover:bg-[#F5EDD8] transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 py-6">

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor:      activeFilter === f ? "#1C1410" : "#E2D5C3",
                backgroundColor:  activeFilter === f ? "#1C1410" : "#fff",
                color:            activeFilter === f ? "#FBF4E8" : "#4A3728",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-[#7A6555] mb-5">
          {filtered.length} {filtered.length === 1 ? "listing" : "listings"}
          {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-2xl">🏠</p>
            <p className="text-[#4A3728] font-medium">No listings match this filter</p>
            <button onClick={() => setActiveFilter("All")} className="text-sm text-[#27BE5D] hover:underline">
              Clear filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
