"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STEPS_SHOPPER = ["role", "basic", "location", "preferences", "photo"];
const STEPS_BROKER  = ["role", "basic", "location", "professional", "photo"];

// ── Mascot + speech bubble ──────────────────────────────────────────
function Mascot({ message }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 select-none"
           style={{ background: "linear-gradient(135deg,#FBF4E8,#F5EDD8)", border: "2px solid #E2D5C3" }}>
        🏠
      </div>
      <div className="relative bg-white rounded-2xl px-5 py-4 shadow-sm" style={{ border: "2px solid #E8E8E8" }}>
        {/* tail */}
        <span className="absolute -left-[13px] top-5 border-t-[8px] border-t-transparent border-r-[13px] border-b-[8px] border-b-transparent"
              style={{ borderRightColor: "#E8E8E8" }} />
        <span className="absolute -left-[10px] top-5 border-t-[8px] border-t-transparent border-r-[13px] border-b-[8px] border-b-transparent"
              style={{ borderRightColor: "#fff" }} />
        <p className="text-[17px] font-bold text-gray-800 leading-snug">{message}</p>
      </div>
    </div>
  );
}

// ── Multiple-choice card ────────────────────────────────────────────
function OptionCard({ emoji, label, sublabel, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98]"
      style={{
        borderColor: selected ? "#C4602A" : "#E0E0E0",
        background:  selected ? "#FFF5F0" : "#fff",
      }}
    >
      <span className="text-2xl shrink-0 leading-none">{emoji}</span>
      <div>
        <p className="font-bold text-[15px]" style={{ color: selected ? "#C4602A" : "#222" }}>{label}</p>
        {sublabel && <p className="text-sm text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
    </button>
  );
}

// ── Styled input ────────────────────────────────────────────────────
function Field({ placeholder, value, onChange, type = "text", maxLength, className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-5 py-4 rounded-2xl border-2 text-[15px] text-gray-800 placeholder-gray-400 bg-white
        focus:outline-none transition-colors ${className}`}
      style={{ borderColor: value ? "#C4602A" : "#E0E0E0" }}
      onFocus={e => e.currentTarget.style.borderColor = "#C4602A"}
      onBlur={e  => e.currentTarget.style.borderColor = value ? "#C4602A" : "#E0E0E0"}
    />
  );
}

// ── Main page ───────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [saving, setSaving] = useState(false);
  const [dir, setDir]       = useState(1); // 1 = forward, -1 = back

  const [data, setData] = useState({
    role: "", full_name: "", city: "", state: "", zip_code: "",
    intent: "", budget_min: "", budget_max: "",
    license_number: "", brokerage_name: "", areas_served: "",
    avatar_url: "",
  });

  const steps        = data.role === "broker" ? STEPS_BROKER : STEPS_SHOPPER;
  const totalSteps   = steps.length;
  const stepName     = steps[step];
  const isLastStep   = step === totalSteps - 1;
  const progressPct  = Math.round((step / (totalSteps - 1)) * 100);

  function update(field, value) { setData(d => ({ ...d, [field]: value })); }

  function go(delta) {
    setDir(delta);
    if (delta < 0 && step === 0) { router.push("/"); return; }
    setStep(s => Math.max(0, Math.min(s + delta, totalSteps - 1)));
  }

  function canContinue() {
    switch (stepName) {
      case "role":         return !!data.role;
      case "basic":        return !!data.full_name.trim();
      case "location":     return !!data.city.trim() && !!data.state.trim() && !!data.zip_code.trim();
      case "preferences":  return !!data.intent;
      case "professional": return !!data.license_number.trim() && !!data.brokerage_name.trim();
      default:             return true;
    }
  }

  async function finish() {
    setSaving(true);
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name:      data.full_name,
          city:           data.city,
          state:          data.state,
          zip_code:       data.zip_code,
          role:           data.role,
          intent:         data.intent || null,
          budget_min:     data.budget_min  ? parseInt(data.budget_min)  : null,
          budget_max:     data.budget_max  ? parseInt(data.budget_max)  : null,
          license_number: data.license_number  || null,
          brokerage_name: data.brokerage_name  || null,
          areas_served:   data.areas_served    || null,
          updated_at:     new Date().toISOString(),
        });
      }
    }
    const zip = data.zip_code || "";
    router.push(`/dashboard?nav=map${zip ? `&zip=${zip}` : ""}`);
  }

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: {     opacity: 1, x: 0 },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white px-6 pt-5 pb-4 flex items-center gap-4">
        <button
          onClick={() => go(-1)}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1 h-3.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "#C4602A" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── Scrollable step content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={stepName}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >

              {/* ── Role ── */}
              {stepName === "role" && (
                <div>
                  <Mascot message="How will you use Houdys?" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <OptionCard emoji="🔍" label="Shopper"
                      sublabel="Looking to rent or buy"
                      selected={data.role === "shopper"}
                      onClick={() => update("role", "shopper")} />
                    <OptionCard emoji="💼" label="Broker"
                      sublabel="Licensed real estate agent"
                      selected={data.role === "broker"}
                      onClick={() => update("role", "broker")} />
                  </div>
                </div>
              )}

              {/* ── Name ── */}
              {stepName === "basic" && (
                <div>
                  <Mascot message="What should we call you?" />
                  <Field
                    placeholder="Your full name"
                    value={data.full_name}
                    onChange={e => update("full_name", e.target.value)}
                  />
                </div>
              )}

              {/* ── Location ── */}
              {stepName === "location" && (
                <div>
                  <Mascot message="Where are you based?" />
                  <div className="space-y-3">
                    <Field placeholder="City" value={data.city}
                      onChange={e => update("city", e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field placeholder="State (CA)" value={data.state} maxLength={2}
                        onChange={e => update("state", e.target.value.toUpperCase())} />
                      <Field placeholder="ZIP code" value={data.zip_code}
                        onChange={e => update("zip_code", e.target.value.replace(/\D/g, "").slice(0, 5))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Shopper preferences ── */}
              {stepName === "preferences" && (
                <div>
                  <Mascot message="What are you looking for?" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <OptionCard emoji="🔑" label="Rent"
                      sublabel="Looking for a rental"
                      selected={data.intent === "rent"}
                      onClick={() => update("intent", "rent")} />
                    <OptionCard emoji="🏷️" label="Buy"
                      sublabel="Ready to purchase"
                      selected={data.intent === "buy"}
                      onClick={() => update("intent", "buy")} />
                  </div>

                  <AnimatePresence>
                    {data.intent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                          Budget range <span className="font-normal normal-case">(optional)</span>
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                            <Field placeholder="Min" value={data.budget_min} type="number"
                              className="pl-8"
                              onChange={e => update("budget_min", e.target.value)} />
                          </div>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                            <Field placeholder="Max" value={data.budget_max} type="number"
                              className="pl-8"
                              onChange={e => update("budget_max", e.target.value)} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Broker professional ── */}
              {stepName === "professional" && (
                <div>
                  <Mascot message="Tell us about your practice." />
                  <div className="space-y-3">
                    <Field placeholder="License number (e.g. DRE 01234567)"
                      value={data.license_number}
                      onChange={e => update("license_number", e.target.value)} />
                    <Field placeholder="Brokerage name (e.g. COMPASS)"
                      value={data.brokerage_name}
                      onChange={e => update("brokerage_name", e.target.value)} />
                    <Field placeholder="Areas you serve (e.g. San Francisco, Oakland)"
                      value={data.areas_served}
                      onChange={e => update("areas_served", e.target.value)} />
                  </div>
                </div>
              )}

              {/* ── Photo ── */}
              {stepName === "photo" && (
                <div>
                  <Mascot message="Add a photo so people know it's you." />
                  <div className="flex flex-col items-center gap-5 py-4">
                    <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {data.avatar_url
                        ? <img src={data.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        : <span className="text-4xl font-bold text-gray-300">{data.full_name?.[0]?.toUpperCase() || "?"}</span>
                      }
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#C4602A] hover:text-[#C4602A] transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload photo
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) update("avatar_url", URL.createObjectURL(file));
                        }} />
                    </label>
                    <p className="text-sm text-gray-400">You can always add one later.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        {/* Skip — only on preferences */}
        {stepName === "preferences"
          ? <button onClick={() => go(1)} className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              Skip for now
            </button>
          : <div />
        }

        <button
          onClick={isLastStep ? finish : () => go(1)}
          disabled={!canContinue() || saving}
          className="px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-150 active:scale-95"
          style={{
            background:  canContinue() && !saving ? "#C4602A" : "#E0E0E0",
            color:       canContinue() && !saving ? "#fff"    : "#aaa",
            cursor:      canContinue() && !saving ? "pointer" : "not-allowed",
            boxShadow:   canContinue() && !saving ? "0 4px 14px rgba(196,96,42,0.35)" : "none",
          }}
        >
          {saving ? "Saving…" : isLastStep ? "Finish" : "Continue"}
        </button>
      </div>

    </div>
  );
}
