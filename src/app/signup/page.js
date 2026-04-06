"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone, ChevronDown, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

const COUNTRIES = [
  { name: "United States", code: "US", dial: "+1" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "Sweden", code: "SE", dial: "+46" },
  { name: "Norway", code: "NO", dial: "+47" },
  { name: "Denmark", code: "DK", dial: "+45" },
  { name: "Finland", code: "FI", dial: "+358" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Austria", code: "AT", dial: "+43" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Poland", code: "PL", dial: "+48" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "Turkey", code: "TR", dial: "+90" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "UAE", code: "AE", dial: "+971" },
  { name: "Israel", code: "IL", dial: "+972" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Ghana", code: "GH", dial: "+233" },
  { name: "Egypt", code: "EG", dial: "+20" },
  { name: "Argentina", code: "AR", dial: "+54" },
  { name: "Colombia", code: "CO", dial: "+57" },
  { name: "Chile", code: "CL", dial: "+56" },
  { name: "Peru", code: "PE", dial: "+51" },
  { name: "Venezuela", code: "VE", dial: "+58" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Vietnam", code: "VN", dial: "+84" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Greece", code: "GR", dial: "+30" },
  { name: "Czech Republic", code: "CZ", dial: "+420" },
  { name: "Hungary", code: "HU", dial: "+36" },
  { name: "Romania", code: "RO", dial: "+40" },
  { name: "Ukraine", code: "UA", dial: "+380" },
];

function CountryDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-50 border-r border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors whitespace-nowrap"
      >
        <span className="font-medium">{selected.dial}</span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-neutral-100 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-neutral-400">No results</li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${selected.code === c.code ? "bg-neutral-100 font-medium" : ""}`}
                >
                  <span className="text-neutral-800">{c.name}</span>
                  <span className="text-neutral-500 tabular-nums">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function FloatingCard({ tag, color, delay, rotate, translateY }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: translateY }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{ rotate: `${rotate}deg` }}
      className="w-64 sm:w-72 bg-white rounded-xl shadow-2xl overflow-hidden border border-white/20"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
        <div className={`w-6 h-6 rounded ${color} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">{tag[0]}</span>
        </div>
        <span className="text-sm font-semibold text-neutral-800">{tag}</span>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {["Home", "Getting Started", "Configuration", "Advanced"].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-neutral-200" />
            <div className="h-2.5 bg-neutral-100 rounded" style={{ width: `${50 + (item.length * 5) % 40}%` }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  const [view, setView] = useState("main"); // "main" | "phone" | "phone-verify" | "email" | "done"
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]); // default US
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    if (!supabase) {
      setError("Auth not configured — add Supabase keys to .env.local");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleEmailContinue(e) {
    e.preventDefault();
    if (!supabase) {
      setError("Auth not configured — add Supabase keys to .env.local");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setView("done");
    setLoading(false);
  }

  async function handlePhoneSend(e) {
    e.preventDefault();
    if (!supabase) {
      setError("Auth not configured — add Supabase keys to .env.local");
      return;
    }
    setLoading(true);
    setError("");
    const fullPhone = country.dial + phoneNum.replace(/\D/g, "");
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) setError(error.message);
    else setView("phone-verify");
    setLoading(false);
  }

  async function handlePhoneVerify(e) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError("");
    const fullPhone = country.dial + phoneNum.replace(/\D/g, "");
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: code, type: "sms" });
    if (error) setError(error.message);
    else window.location.replace("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">H</span>
            </div>
            <span className="text-sm font-semibold text-neutral-800 group-hover:text-black transition-colors">
              Houdys
            </span>
          </Link>

          <AnimatePresence mode="wait">

            {/* ── MAIN VIEW ── */}
            {view === "main" && (
              <motion.div key="main" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
                <p className="text-neutral-500 text-sm mb-8">Find your next home with Houdys.</p>

                {error && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
                )}

                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <button
                    onClick={() => { setView("phone"); setError(""); }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-neutral-500" />
                    Sign up with Phone
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs text-neutral-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                <form onSubmit={handleEmailContinue} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter work email"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Continue"}
                  </button>
                </form>

                <p className="mt-5 text-xs text-neutral-400 text-center">
                  By continuing, you agree to our{" "}
                  <Link href="#" className="underline hover:text-neutral-600">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="underline hover:text-neutral-600">Privacy policy</Link>.
                </p>
                <p className="mt-4 text-sm text-neutral-500 text-center">
                  Already have an account?{" "}
                  <Link href="/signup" className="font-medium text-neutral-900 hover:underline">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* ── PHONE ENTRY ── */}
            {view === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <button onClick={() => { setView("main"); setError(""); }} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-2xl font-bold text-neutral-900 mb-1">Enter your number</h1>
                <p className="text-neutral-500 text-sm mb-8">We'll text you a one-time code to verify your number.</p>

                {error && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
                )}

                <form onSubmit={handlePhoneSend} className="space-y-3">
                  <div className="flex rounded-lg border border-neutral-200 overflow-visible focus-within:ring-2 focus-within:ring-black/10 focus-within:border-neutral-400 transition">
                    <CountryDropdown selected={country} onChange={setCountry} />
                    <input
                      type="tel"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value.replace(/[^\d\s\-()]/g, ""))}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none bg-white rounded-r-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Send code"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── PHONE VERIFY ── */}
            {view === "phone-verify" && (
              <motion.div key="phone-verify" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <button onClick={() => { setView("phone"); setError(""); }} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-2xl font-bold text-neutral-900 mb-1">Enter the code</h1>
                <p className="text-neutral-500 text-sm mb-8">
                  Sent to <span className="font-medium text-neutral-800">{country.dial} {phoneNum}</span>
                </p>

                {error && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">{error}</div>
                )}

                <form onSubmit={handlePhoneVerify} className="space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying…" : "Verify"}
                  </button>
                </form>

                <button
                  onClick={handlePhoneSend}
                  className="mt-4 w-full text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  Resend code
                </button>
              </motion.div>
            )}

            {/* ── EMAIL SENT ── */}
            {view === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Check your email</h2>
                <p className="text-sm text-neutral-500">
                  We sent a magic link to <span className="font-medium text-neutral-800">{email}</span>
                </p>
                <button
                  onClick={() => { setView("main"); setEmail(""); setError(""); }}
                  className="mt-6 text-sm text-neutral-500 hover:text-neutral-800 underline"
                >
                  Use a different email
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT PANEL (desktop) ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
        <div className="absolute top-10 left-10 right-10 z-10">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Houdys</p>
          <h2 className="text-white text-3xl font-bold leading-tight">Find your<br />next home.</h2>
        </div>
        <div className="relative flex flex-col items-center gap-4 mt-20">
          <FloatingCard tag="Flea" color="bg-orange-500" delay={0.1} rotate={-3} translateY={-8} />
          <FloatingCard tag="Vote" color="bg-rose-600" delay={0.2} rotate={1} translateY={0} />
          <FloatingCard tag="Gen Z" color="bg-red-500" delay={0.3} rotate={3} translateY={8} />
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span className="text-white/40 text-xs">Powered by Houdys</span>
        </div>
      </div>

      {/* ── RIGHT PANEL (mobile banner) ── */}
      <div className="lg:hidden w-full py-10 px-6 bg-gradient-to-r from-orange-500 to-rose-600 flex flex-col items-center text-center">
        <h2 className="text-white text-xl font-bold mb-1">Find your next home.</h2>
        <p className="text-white/70 text-sm">Browse properties with Houdys.</p>
      </div>

    </div>
  );
}
