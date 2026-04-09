"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { imgUrl } from "@/lib/mockProperties";
import {
  Heart, MapPin, Bed, Bath, Square,
  ArrowRight, X, Flame, Loader2,
} from "lucide-react";
import Link from "next/link";

// ── Fallback Unsplash photo IDs by property type ────────────────────
const TYPE_PHOTOS = {
  House:      "1568605114967-8130f3a36994",
  Townhouse:  "1570129477492-45c003edd2be",
  Condo:      "1545324418-cc1a3fa10c00",
  Apartment:  "1560448204-e02f11c3d0e2",
  Villa:      "1560185127-6ed189bf02f4",
  Estate:     "1560185127-6ed189bf02f4",
  Studio:     "1493809842364-78817add7ffb",
};

// ── Emoji per property type ─────────────────────────────────────────
const TYPE_EMOJI = {
  House:      "🏡",
  Townhouse:  "🏘️",
  Condo:      "🏢",
  Apartment:  "🏠",
  Villa:      "🏖️",
  Estate:     "🏰",
  Studio:     "🛋️",
};

// ── Badge config ────────────────────────────────────────────────────
const BADGE = {
  hot:    { bg: "bg-red-500",    text: "text-white", label: "🔥 Hot"    },
  new:    { bg: "bg-[#27BE5D]",  text: "text-white", label: "✨ New"    },
  open:   { bg: "bg-blue-500",   text: "text-white", label: "🚪 Open"   },
  luxury: { bg: "bg-amber-500",  text: "text-white", label: "💎 Luxury" },
};

function getBadgeKey(tag) {
  if (!tag) return null;
  const t = tag.toLowerCase();
  if (t === "hot")          return "hot";
  if (t === "new")          return "new";
  if (t.includes("open"))   return "open";
  if (t === "luxury")       return "luxury";
  return null;
}

// Map a Supabase row to the shape the UI expects
function toProperty(row) {
  const badgeKey = getBadgeKey(row.tag);
  return {
    ...row,
    emoji:       TYPE_EMOJI[row.type]  ?? "🏠",
    photoId:     TYPE_PHOTOS[row.type] ?? "1568605114967-8130f3a36994",
    badge:       badgeKey,
    listingType: `${row.type} ${row.listing_type}`,  // "House for sale"
    price:       row.price_display,                   // reuse price field for pins
  };
}

// ── Enhanced map pin ────────────────────────────────────────────────
function MapPin_({ property, isActive, onClick }) {
  const isRent = property.listing_type === "for rent";
  const badge  = property.badge ? BADGE[property.badge] : null;
  const isOpen = property.badge === "open";
  const isHot  = property.badge === "hot";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-0.5 focus:outline-none"
    >
      {isOpen && (
        <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-40 pointer-events-none" />
      )}

      <span className={`text-base leading-none transition-transform duration-150 ${isActive ? "scale-125" : "group-hover:scale-110"}`}>
        {property.emoji}
      </span>

      <div className={`
        relative flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
        shadow-md border transition-all duration-150 whitespace-nowrap
        ${isActive
          ? "bg-[#1C1410] text-[#f5f4f1] border-[#1C1410] scale-110"
          : isRent
            ? "bg-[#EBF9F0] text-[#1C1410] border-[#27BE5D] hover:bg-[#27BE5D] hover:text-white"
            : "bg-white text-[#1C1410] border-[#e0dfdb] hover:bg-[#1C1410] hover:text-[#f5f4f1]"
        }
      `}>
        {isHot && <Flame className="w-3 h-3 text-red-400 shrink-0" />}
        {property.price_display}
      </div>

      {badge && !isHot && (
        <span className={`
          px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none
          ${badge.bg} ${badge.text}
          transition-opacity duration-150
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}>
          {badge.label}
        </span>
      )}

      <span className={`
        w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px]
        border-l-transparent border-r-transparent
        ${isActive ? "border-t-[#1C1410]" : isRent ? "border-t-[#27BE5D]" : "border-t-[#e0dfdb]"}
        transition-colors duration-150
      `} />
    </button>
  );
}

// ── Listing drawer ──────────────────────────────────────────────────
function ListingDrawer({ property, open, onClose }) {
  const [saved, setSaved] = useState(false);
  if (!property) return null;

  const badge = property.badge ? BADGE[property.badge] : null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 overflow-y-auto bg-[#f5f4f1] border-l border-[#e0dfdb]"
      >
        <div className="relative aspect-[4/3] bg-[#e0dfdb] overflow-hidden">
          <img
            src={imgUrl(property.photoId, 800, 600)}
            alt={property.type}
            className="w-full h-full object-cover"
          />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <X className="w-4 h-4 text-[#1C1410]" />
          </button>
          <button onClick={() => setSaved(s => !s)} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Heart className={`w-4 h-4 ${saved ? "fill-[#27BE5D] text-[#27BE5D]" : "text-[#7A6555]"}`} />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-2xl leading-none drop-shadow">{property.emoji}</span>
            {badge && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-5">
          <SheetHeader className="mb-4 text-left">
            <p className="text-2xl font-bold text-[#1C1410]">{property.price_display}</p>
            <SheetTitle className="text-base font-medium text-[#7A6555] font-sans">
              {property.listingType}
            </SheetTitle>
          </SheetHeader>

          <div className="flex items-center gap-4 mb-4 text-sm text-[#4A3728]">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-[#27BE5D]" />
              {property.beds === 0 ? "Studio" : `${property.beds} bds`}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-[#27BE5D]" /> {property.baths} ba
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4 text-[#27BE5D]" /> {property.sqft?.toLocaleString()} sqft
            </span>
          </div>

          <div className="flex items-start gap-2 mb-5 pb-5 border-b border-[#e0dfdb]">
            <MapPin className="w-4 h-4 text-[#27BE5D] mt-0.5 shrink-0" />
            <p className="text-sm text-[#1C1410] leading-snug">{property.address}, {property.city}, {property.state}</p>
          </div>

          <p className="text-sm text-[#4A3728] leading-relaxed mb-5 pb-5 border-b border-[#e0dfdb]">
            {property.description}
          </p>

          {property.features?.length > 0 && (
            <div className="mb-5 pb-5 border-b border-[#e0dfdb]">
              <p className="text-xs font-semibold text-[#1C1410] uppercase tracking-widest mb-3">Features</p>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-[#4A3728]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27BE5D] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.broker_name && (
            <div className="mb-6">
              <p className="text-xs text-[#7A6555]">
                {property.brokerage} · {property.broker_name} · {property.broker_license}
              </p>
            </div>
          )}

          <Link
            href={`/dashboard/listing/${property.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#1C1410] text-[#f5f4f1] text-sm font-semibold rounded-xl hover:bg-[#27BE5D] transition-colors"
          >
            View full listing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main map view ───────────────────────────────────────────────────
export default function MapView({ filter = "all", zipCode }) {
  const [listings,    setListings]    = useState([]);
  const [fetchState,  setFetchState]  = useState("idle"); // "idle" | "loading" | "done" | "error"
  const [activeId,    setActiveId]    = useState(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [center,      setCenter]      = useState(null);
  const mapRef = useRef(null);

  // Fetch all active listings from Supabase on mount
  useEffect(() => {
    if (!supabase) return;
    setFetchState("loading");
    supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .then(({ data, error }) => {
        if (error) { setFetchState("error"); return; }
        setListings((data ?? []).map(toProperty));
        setFetchState("done");
      });
  }, []);

  // Geocode ZIP → fly map to user's area
  useEffect(() => {
    if (!zipCode) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zipCode)}&country=US&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    )
      .then(r => r.json())
      .then(data => {
        if (!data[0]) return;
        const lng = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);
        setCenter([lng, lat]);
        if (mapRef.current) {
          mapRef.current.easeTo({ center: [lng, lat], zoom: 11, duration: 1200 });
        }
      })
      .catch(() => {});
  }, [zipCode]);

  // Filter listings by active tab
  const filtered = useMemo(() => {
    return listings.filter(p => {
      if (filter === "rent") return p.listing_type === "for rent";
      if (filter === "buy")  return p.listing_type === "for sale";
      return true;
    });
  }, [listings, filter]);

  const activeProperty = filtered.find(p => p.id === activeId) ?? null;

  function handlePinClick(property) {
    setActiveId(property.id);
    setDrawerOpen(true);
  }

  function handleClose() {
    setDrawerOpen(false);
    setActiveId(null);
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Map
        ref={mapRef}
        center={[-96.5, 38.5]}
        zoom={4}
        theme="light"
        className="w-full h-full rounded-none"
      >
        <MapControls />

        {filtered.map(p => (
          <MapMarker key={p.id} longitude={p.lng} latitude={p.lat}>
            <MarkerContent>
              <MapPin_
                property={p}
                isActive={activeId === p.id}
                onClick={() => handlePinClick(p)}
              />
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>

      {/* Loading listings */}
      {fetchState === "loading" && (
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-[#e0dfdb] rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-[#27BE5D] animate-spin" />
            <p className="text-xs text-[#7A6555]">Loading listings…</p>
          </div>
        </div>
      )}

      {/* No results after filter */}
      {fetchState === "done" && filtered.length === 0 && (
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-[#e0dfdb] rounded-2xl px-6 py-4 shadow-lg text-center">
            <p className="text-sm font-semibold text-[#1C1410]">No listings found</p>
            <p className="text-xs text-[#7A6555] mt-1">Try switching between rent and buy.</p>
          </div>
        </div>
      )}

      {/* No ZIP set */}
      {fetchState === "done" && !zipCode && (
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-[#e0dfdb] rounded-2xl px-6 py-4 shadow-lg text-center max-w-xs">
            <p className="text-2xl mb-2">📍</p>
            <p className="text-sm font-semibold text-[#1C1410]">Add your ZIP code</p>
            <p className="text-xs text-[#7A6555] mt-1">Complete your profile to zoom to your area.</p>
          </div>
        </div>
      )}

      <ListingDrawer
        property={activeProperty}
        open={drawerOpen}
        onClose={handleClose}
      />
    </div>
  );
}
