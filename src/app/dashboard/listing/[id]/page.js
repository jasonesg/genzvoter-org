"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Heart, Share2, MapPin, Calendar, Home,
  Ruler, Star, Phone, Mail, ChevronLeft, ChevronRight,
} from "lucide-react";
import { MOCK_PROPERTIES, imgUrl } from "@/lib/mockProperties";

export default function ListingPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const property  = MOCK_PROPERTIES.find(p => p.id === parseInt(id));
  const [saved, setSaved]       = useState(false);
  const [imgIdx, setImgIdx]     = useState(0);
  const [contacted, setContacted] = useState(false);

  // Mortgage calculator state
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate]       = useState(7.0);
  const [term, setTerm]       = useState(30);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#FBF4E8" }}>
        <p className="text-[#7A6555]">Listing not found.</p>
        <Link href="/dashboard" className="text-sm font-medium text-[#27BE5D] hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const images = property.galleryIds.map(gid => imgUrl(gid, 960, 640));
  const isRental = property.price.includes("/mo");

  // Mortgage calculation
  const P = property.priceNum * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = term * 12;
  const monthlyPayment = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const downAmount = property.priceNum * (downPct / 100);
  const loanAmount = property.priceNum - downAmount;

  function formatCurrency(val) {
    return "$" + Math.round(val).toLocaleString();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FBF4E8" }}>

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-30 bg-[#FBF4E8]/95 backdrop-blur-md border-b border-[#E2D5C3]">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#4A3728] hover:text-[#1C1410] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2D5C3] bg-white text-sm font-medium text-[#4A3728] hover:bg-[#F5EDD8] transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={() => setSaved(s => !s)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2D5C3] bg-white text-sm font-medium text-[#4A3728] hover:bg-[#F5EDD8] transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-[#27BE5D] text-[#27BE5D]" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* ── Left column ── */}
          <div>

            {/* Image gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/9] bg-[#E2D5C3]">
              <img
                src={images[imgIdx]}
                alt={property.type}
                className="w-full h-full object-cover"
              />
              {property.openHouse && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#27BE5D] rounded-full text-sm font-semibold text-white">
                  Open: {property.openHouse}
                </span>
              )}
              {property.tag && !property.openHouse && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                  {property.tag}
                </span>
              )}
              {/* Arrows */}
              <button
                onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#1C1410]" />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#1C1410]" />
              </button>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 rounded-full text-xs text-white font-medium">
                {imgIdx + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? "border-[#27BE5D]" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title block */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#1C1410] mb-2">{property.price}</h1>
              <p className="text-base text-[#4A3728] mb-2 font-medium">
                {property.beds} bds &nbsp;|&nbsp; {property.baths} ba &nbsp;|&nbsp; {property.sqft.toLocaleString()} sqft &nbsp;|&nbsp; {property.listingType}
              </p>
              <div className="flex items-center gap-1.5 text-[#7A6555] text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-[#F5EDD8] border border-[#E2D5C3] rounded-full text-xs font-medium text-[#1C1410]">
                {property.status}
              </span>
              {property.yearBuilt && (
                <span className="px-3 py-1 bg-[#F5EDD8] border border-[#E2D5C3] rounded-full text-xs font-medium text-[#1C1410]">
                  Built {property.yearBuilt}
                </span>
              )}
              {property.lotSize && (
                <span className="px-3 py-1 bg-[#F5EDD8] border border-[#E2D5C3] rounded-full text-xs font-medium text-[#1C1410]">
                  Lot: {property.lotSize}
                </span>
              )}
              {property.hoa && (
                <span className="px-3 py-1 bg-[#F5EDD8] border border-[#E2D5C3] rounded-full text-xs font-medium text-[#1C1410]">
                  HOA: {property.hoa}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-serif font-bold text-[#1C1410] mb-3">About this home</h2>
              <p className="text-sm text-[#4A3728] leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-lg font-serif font-bold text-[#1C1410] mb-4">Key features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-[#E2D5C3]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#27BE5D] shrink-0" />
                    <p className="text-sm text-[#4A3728]">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Property details table */}
            <div className="mb-8">
              <h2 className="text-lg font-serif font-bold text-[#1C1410] mb-4">Property details</h2>
              <div className="rounded-2xl border border-[#E2D5C3] overflow-hidden">
                {[
                  { label: "Property type",   value: property.type },
                  { label: "Listing type",     value: property.listingType },
                  { label: "Bedrooms",         value: `${property.beds} bedrooms` },
                  { label: "Bathrooms",        value: `${property.baths} full baths` },
                  { label: "Living area",      value: `${property.sqft.toLocaleString()} sqft` },
                  ...(property.lotSize ? [{ label: "Lot size", value: property.lotSize }] : []),
                  ...(property.yearBuilt ? [{ label: "Year built", value: property.yearBuilt.toString() }] : []),
                  ...(property.hoa ? [{ label: "HOA fees", value: property.hoa }] : []),
                  { label: "MLS ID", value: `#MLS${String(property.id).padStart(8, "0")}` },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    className={`flex justify-between px-5 py-3 text-sm ${
                      i % 2 === 0 ? "bg-white" : "bg-[#F5EDD8]"
                    } ${i < arr.length - 1 ? "border-b border-[#E2D5C3]" : ""}`}
                  >
                    <span className="text-[#7A6555]">{label}</span>
                    <span className="text-[#1C1410] font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mortgage calculator (for-sale only) ── */}
            {!isRental && (
              <div id="mortgage-calculator" className="mb-8">
                <h2 className="text-lg font-serif font-bold text-[#1C1410] mb-4">Mortgage calculator</h2>
                <div className="bg-white rounded-2xl border border-[#E2D5C3] p-6">

                  {/* Est. monthly payment */}
                  <div className="mb-6 pb-6 border-b border-[#E2D5C3]">
                    <p className="text-xs text-[#7A6555] mb-1 uppercase tracking-wider">Est. monthly payment</p>
                    <p className="text-4xl font-bold text-[#1C1410]">{formatCurrency(monthlyPayment)}<span className="text-lg font-normal text-[#7A6555]">/mo</span></p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-5">

                      {/* Down payment slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-[#4A3728]">Down payment</label>
                          <span className="text-sm font-bold text-[#1C1410]">{downPct}% &nbsp;·&nbsp; {formatCurrency(downAmount)}</span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={50}
                          step={1}
                          value={downPct}
                          onChange={e => setDownPct(Number(e.target.value))}
                          className="w-full accent-[#27BE5D]"
                        />
                        <div className="flex justify-between text-xs text-[#B0A090] mt-1">
                          <span>3%</span>
                          <span>50%</span>
                        </div>
                      </div>

                      {/* Interest rate */}
                      <div>
                        <label className="text-sm font-medium text-[#4A3728] block mb-2">Interest rate</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={15}
                            step={0.1}
                            value={rate}
                            onChange={e => setRate(Number(e.target.value))}
                            className="w-24 px-3 py-2 rounded-xl border border-[#E2D5C3] bg-[#F5EDD8] text-sm text-[#1C1410] font-semibold focus:outline-none focus:border-[#27BE5D]"
                          />
                          <span className="text-sm text-[#7A6555]">% per year</span>
                        </div>
                      </div>

                      {/* Loan term */}
                      <div>
                        <label className="text-sm font-medium text-[#4A3728] block mb-2">Loan term</label>
                        <div className="flex gap-2">
                          {[15, 30].map(t => (
                            <button
                              key={t}
                              onClick={() => setTerm(t)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                                term === t
                                  ? "bg-[#1C1410] text-[#FBF4E8] border-[#1C1410]"
                                  : "bg-white text-[#4A3728] border-[#E2D5C3] hover:bg-[#F5EDD8]"
                              }`}
                            >
                              {t}yr
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col justify-center gap-3">
                      <div className="rounded-xl bg-[#F5EDD8] border border-[#E2D5C3] px-4 py-3">
                        <p className="text-xs text-[#7A6555] mb-0.5">Home price</p>
                        <p className="text-base font-bold text-[#1C1410]">{property.price}</p>
                      </div>
                      <div className="rounded-xl bg-[#F5EDD8] border border-[#E2D5C3] px-4 py-3">
                        <p className="text-xs text-[#7A6555] mb-0.5">Down payment ({downPct}%)</p>
                        <p className="text-base font-bold text-[#1C1410]">{formatCurrency(downAmount)}</p>
                      </div>
                      <div className="rounded-xl bg-[#F5EDD8] border border-[#E2D5C3] px-4 py-3">
                        <p className="text-xs text-[#7A6555] mb-0.5">Loan amount</p>
                        <p className="text-base font-bold text-[#1C1410]">{formatCurrency(loanAmount)}</p>
                      </div>
                      <p className="text-xs text-[#B0A090] leading-relaxed">
                        Estimate based on {downPct}% down, {rate}% rate, {term}-year fixed. Taxes and insurance not included.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* ── Right column: Broker card ── */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-2xl border border-[#E2D5C3] p-6 shadow-sm mb-4">
              <p className="text-xl font-bold text-[#1C1410] mb-1">{property.price}</p>
              <p className="text-xs text-[#7A6555] mb-5">
                {isRental ? "Per month · utilities may vary" : "List price · est. payment available"}
              </p>

              {/* Compact mortgage estimate in broker card (for-sale only) */}
              {!isRental && (
                <div className="rounded-xl bg-[#F5EDD8] border border-[#E2D5C3] px-4 py-3 mb-4">
                  <p className="text-xs text-[#7A6555] mb-0.5">Est. monthly payment</p>
                  <p className="text-xl font-bold text-[#1C1410]">{formatCurrency(monthlyPayment)}<span className="text-sm font-normal text-[#7A6555]">/mo</span></p>
                  <p className="text-xs text-[#B0A090] mt-1">{downPct}% down · {rate}% · {term}yr fixed</p>
                  <a href="#mortgage-calculator" className="text-xs text-[#27BE5D] font-medium hover:underline mt-1.5 inline-block">
                    See full calculator ↓
                  </a>
                </div>
              )}

              {contacted ? (
                <div className="rounded-xl bg-[#F5EDD8] border border-[#E2D5C3] p-4 text-center mb-4">
                  <p className="text-sm font-semibold text-[#1C1410] mb-1">Request sent!</p>
                  <p className="text-xs text-[#7A6555]">The agent will be in touch shortly.</p>
                </div>
              ) : (
                <button
                  onClick={() => setContacted(true)}
                  className="w-full py-3 mb-3 rounded-xl bg-[#27BE5D] text-white text-sm font-semibold hover:bg-[#297A46] transition-colors"
                >
                  {isRental ? "Request a tour" : "Contact agent"}
                </button>
              )}

              <button className="w-full py-3 rounded-xl border border-[#E2D5C3] bg-[#F5EDD8] text-[#1C1410] text-sm font-semibold hover:bg-[#E2D5C3] transition-colors">
                Schedule a call
              </button>
            </div>

            {/* Broker info */}
            <div className="bg-white rounded-2xl border border-[#E2D5C3] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#7A6555] uppercase tracking-wider mb-4">Listed by</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1C1410] flex items-center justify-center text-[#FBF4E8] text-lg font-bold shrink-0">
                  {property.agent[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1C1410]">{property.agent}</p>
                  <p className="text-xs text-[#7A6555]">{property.dre}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F5EDD8] px-4 py-3 mb-4 border border-[#E2D5C3]">
                <p className="text-xs text-[#7A6555] mb-0.5">Brokerage</p>
                <p className="text-sm font-bold text-[#1C1410]">{property.broker}</p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-[#4A3728]">
                  <Phone className="w-4 h-4 text-[#7A6555] shrink-0" />
                  <span>(415) 555-{String(property.id * 1234 % 9000 + 1000)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#4A3728]">
                  <Mail className="w-4 h-4 text-[#7A6555] shrink-0" />
                  <span className="truncate">
                    {property.agent.split(" ")[0].toLowerCase()}.{property.agent.split(" ")[1]?.toLowerCase() || "agent"}@{property.broker.toLowerCase().replace(/[^a-z]/g, "")}.com
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#4A3728]">
                  <MapPin className="w-4 h-4 text-[#7A6555] shrink-0" />
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E2D5C3]">
                <p className="text-xs text-[#7A6555] leading-relaxed">
                  Listing provided by {property.broker}. {property.agent} {property.dre}.
                  Information deemed reliable but not guaranteed. Last updated April 4, 2026.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
