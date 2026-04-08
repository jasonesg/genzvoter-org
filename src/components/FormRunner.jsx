"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Motion presets
// ─────────────────────────────────────────────────────────────
const EASE     = [0.32, 0.72, 0, 1];
const SPRING   = { type: "spring", stiffness: 380, damping: 26 };
const SPRING_SOFT = { type: "spring", stiffness: 220, damping: 22 };

// Step slide + blur (Typeform-style)
const stepVariants = {
  enter: (dir) => ({ opacity: 0, y: dir > 0 ? 52 : -52, filter: "blur(6px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit:  (dir) => ({ opacity: 0, y: dir > 0 ? -52 : 52, filter: "blur(6px)" }),
};
const stepTransition = { duration: 0.32, ease: EASE };

// Stagger containers
const stagger = (delay = 0.05, children = 0.09) => ({
  hidden: {},
  show: { transition: { staggerChildren: children, delayChildren: delay } },
});
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4 } },
};

// ─────────────────────────────────────────────────────────────
// Ambient floating orbs — welcome screen background
// ─────────────────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 480, left: "-8%",  top: "10%",  dur: 11, delay: 0 },
    { size: 280, left: "68%",  top: "55%",  dur: 15, delay: 2.5 },
    { size: 360, left: "38%",  top: "-14%", dur: 13, delay: 1.2 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.left, top: o.top,
            background:
              "radial-gradient(circle, rgba(39,190,93,0.11) 0%, transparent 68%)",
          }}
          animate={{ x: [0, 22, -14, 0], y: [0, -22, 12, 0], scale: [1, 1.04, 0.97, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confetti burst — thank-you screen
// ─────────────────────────────────────────────────────────────
function ConfettiBurst() {
  const pieces = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const rad   = (angle * Math.PI) / 180;
    const dist  = 55 + (i % 3) * 22;
    return {
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      color: ["#27BE5D","#F5EDD8","#1C1410","#E2D5C3","#D4A574"][i % 5],
      size: 5 + (i % 3) * 2,
    };
  });
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.85, delay: 0.15 + i * 0.025, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Animated textarea with expanding underline + char count
// ─────────────────────────────────────────────────────────────
function AnimatedTextarea({ value, onChange, onKeyDown, placeholder, rows = 4, autoFocusRef }) {
  const [focused, setFocused] = useState(false);
  const charCount = value?.length || 0;
  return (
    <div className="relative pb-1">
      <textarea
        ref={autoFocusRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full resize-none bg-transparent border-none focus:outline-none
          text-xl text-[#1C1410] placeholder-[#D1C9BF]
          py-3 pb-4 leading-relaxed caret-[#27BE5D]
        "
      />
      {/* Track */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E0D5]" />
      {/* Animated fill */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#27BE5D] rounded-full origin-left"
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0.4 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ transformOrigin: "left" }}
      />
      {/* Character count — fades in after typing starts */}
      <AnimatePresence>
        {charCount > 0 && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="absolute -bottom-5 right-0 text-[10px] text-[#C4C0B8] tabular-nums select-none"
          >
            {charCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Continue button — springs in/out with canContinue + idle pulse
// ─────────────────────────────────────────────────────────────
function ContinueBtn({ onClick, show, label = "OK ↵", loading = false }) {
  return (
    <AnimatePresence>
      {(show || loading) && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.94 }}
          transition={SPRING}
          className="relative"
        >
          {/* Idle glow ring */}
          {!loading && (
            <motion.span
              className="absolute inset-0 rounded-xl bg-[#27BE5D] pointer-events-none"
              animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <motion.button
            onClick={onClick}
            disabled={loading}
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 12px 32px rgba(39,190,93,0.32)" }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className="
              relative px-7 py-3 rounded-xl bg-[#27BE5D] text-white
              text-sm font-bold uppercase tracking-widest
              shadow-md shadow-[#27BE5D]/20
              disabled:opacity-70
            "
          >
            {loading ? "Saving…" : label}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard hint — delayed fade in
// ─────────────────────────────────────────────────────────────
function KeyHint({ text = "press Enter ↵" }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="text-xs text-[#C4C0B8] select-none"
    >
      {text}
    </motion.p>
  );
}

// ─────────────────────────────────────────────────────────────
// Video placeholder — Spotify Wrapped style portrait card
// ─────────────────────────────────────────────────────────────
function VideoPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING_SOFT, delay: 0.2 }}
      className="relative w-[140px] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 flex-shrink-0"
      style={{ aspectRatio: "9/16" }}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f14] via-[#0a1a10] to-[#111]" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "120px",
        }}
      />

      {/* Green glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#27BE5D]/25 to-transparent" />

      {/* Top label */}
      <div className="absolute top-3 left-0 right-0 flex justify-center">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
          Introduction
        </span>
      </div>

      {/* Pulsing play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Ring pulse */}
          <motion.div
            className="absolute w-12 h-12 rounded-full border border-white/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          {/* Play icon */}
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 16 16">
              <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom "coming soon" tag */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <span className="text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#27BE5D]/20 text-[#27BE5D] border border-[#27BE5D]/30">
          Coming soon
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Welcome
// ─────────────────────────────────────────────────────────────
function WelcomeStep({ step, onNext }) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6 h-full gap-7 overflow-hidden">
      <FloatingOrbs />

      <motion.div
        variants={stagger(0.05, 0.12)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Video placeholder */}
        <motion.div variants={fadeUp}>
          <VideoPlaceholder />
        </motion.div>

        {step.eyebrow && (
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5EDD8] border border-[#E2D5C3] text-xs text-[#7A6555] font-medium"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#27BE5D]"
              animate={{ scale: [1, 1.6, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {step.eyebrow}
          </motion.span>
        )}

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold text-[#1C1410] leading-[1.05] max-w-lg tracking-tight"
        >
          {step.heading}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-[#7A6555] max-w-sm leading-relaxed"
        >
          {step.subheading}
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 16px 36px rgba(39,190,93,0.30)" }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="
              mt-1 px-10 py-4 rounded-2xl bg-[#27BE5D] text-white
              text-base font-bold tracking-wide
              shadow-lg shadow-[#27BE5D]/25
            "
          >
            {step.cta}
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-3 text-xs text-[#C4C0B8]"
          >
            or press <kbd className="font-mono bg-[#F5EDD8] px-1.5 py-0.5 rounded text-[#7A6555] border border-[#E2D5C3]">Enter ↵</kbd>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// YouTube inline — underlined text with logo peek on hover/tap
// ─────────────────────────────────────────────────────────────
function YouTubeWord() {
  const [peeked, setPeeked] = useState(false);
  return (
    <span
      className="relative inline-block cursor-default"
      onMouseEnter={() => setPeeked(true)}
      onMouseLeave={() => setPeeked(false)}
      onClick={() => setPeeked((p) => !p)}
    >
      <span className="underline decoration-[#D1C9BF] decoration-1 underline-offset-4">YouTube</span>
      <AnimatePresence>
        {peeked && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <img
              src="/youtube-icon.svg"
              alt="YouTube"
              className="h-6 w-auto drop-shadow-md"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function RichQuestion({ text }) {
  const parts = text.split(/(YouTube)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "YouTube" ? <YouTubeWord key={i} /> : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Long text
// ─────────────────────────────────────────────────────────────
function LongTextStep({ step, value, onChange, onNext, canContinue }) {
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 160);
    return () => clearTimeout(t);
  }, [step.field]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canContinue) onNext();
    }
  }

  return (
    <motion.div
      variants={stagger(0.04, 0.1)}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-center px-6 md:px-0 h-full max-w-2xl mx-auto w-full gap-5"
    >
      {/* Step number */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <motion.span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C1410] text-[#FBF4E8] text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...SPRING, delay: 0.05 }}
        >
          {step.number}
        </motion.span>
        <motion.span
          className="text-xs font-semibold text-[#27BE5D] uppercase tracking-widest"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          →
        </motion.span>
      </motion.div>

      {/* Question — supports inline tokens like {{youtube}} */}
      <motion.h2
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-[#1C1410] leading-snug"
      >
        {step.question.includes("YouTube") ? <RichQuestion text={step.question} /> : step.question}
      </motion.h2>

      {/* Hint */}
      {step.hint && (
        <motion.p variants={fadeUp} className="text-sm text-[#B0A898] -mt-2">
          {step.hint}
        </motion.p>
      )}

      {/* Input */}
      <motion.div variants={fadeUp} className="w-full">
        <AnimatedTextarea
          autoFocusRef={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={step.placeholder}
        />

        <div className="flex items-center justify-between mt-5">
          <KeyHint text="Shift + Enter for new line · Enter to continue" />
          <ContinueBtn onClick={onNext} show={canContinue} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Logo single-select + fun fact tooltip (Q1)
// ─────────────────────────────────────────────────────────────
function LogoSelectStep({ step, selectedValues, onSelect, onNext, canContinue }) {
  const selected = selectedValues[0] || null;
  const selectedLogo = step.logos.find((l) => l.value === selected) || null;

  return (
    <motion.div
      variants={stagger(0.04, 0.1)}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-center px-6 md:px-0 h-full max-w-2xl mx-auto w-full gap-6"
    >
      {/* Step number */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <motion.span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C1410] text-[#FBF4E8] text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...SPRING, delay: 0.05 }}
        >
          {step.number}
        </motion.span>
        <motion.span
          className="text-xs font-semibold text-[#27BE5D] uppercase tracking-widest"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          →
        </motion.span>
      </motion.div>

      <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#1C1410] leading-snug">
        {step.question}
      </motion.h2>

      {step.subtext && (
        <motion.p variants={fadeUp} className="text-sm text-[#B0A898] -mt-3">
          {step.subtext}
        </motion.p>
      )}

      {/* Logo cards — 4×1 horizontal row */}
      <motion.div variants={stagger(0.06, 0.08)} className="grid grid-cols-4 gap-2">
        {step.logos.map((logo) => {
          const isSelected = selected === logo.value;
          return (
            <motion.button
              key={logo.value}
              variants={fadeUp}
              onClick={() => onSelect(isSelected ? null : logo.value)}
              whileHover={{ scale: 1.12, y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className="relative w-full flex items-center justify-center py-3 px-2 rounded-xl"
            >
              <div className="relative">
                <img src={logo.icon} alt={logo.label}
                  className={`w-10 h-10 object-contain rounded-lg transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                <span className={`hidden w-10 h-10 rounded-lg bg-[#F5EDD8] items-center justify-center text-sm font-bold ${isSelected ? "text-[#27BE5D]" : "text-[#1C1410]"}`}>
                  {logo.label[0]}
                </span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }} transition={SPRING}
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#27BE5D] flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Fun fact tooltip — rendered below the grid, always within container */}
      <AnimatePresence>
        {selectedLogo?.funFact && (
          <motion.div
            key={selectedLogo.value}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ ...SPRING_SOFT, delay: 0.15 }}
            className="rounded-xl bg-[#1C1410] text-white px-4 py-3 shadow-lg -mt-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#27BE5D] mb-1">Fun fact</p>
            <p className="text-[12px] leading-snug text-white/85">{selectedLogo.funFact}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <KeyHint text="Pick one to continue" />
        <ContinueBtn onClick={onNext} show={canContinue} />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Choice + optional text
// ─────────────────────────────────────────────────────────────
function ChoiceWithTextStep({ step, choiceValue, textValue, onChoiceChange, onTextChange, onNext, canContinue }) {
  const requireText = !!step.requireText;
  const minWords = step.minWords || 0;
  const wordCount = textValue ? textValue.trim().split(/\s+/).filter(Boolean).length : 0;
  const textRef = useRef(null);

  // Auto-advance only when no text is required
  function handleSelect(value) {
    onChoiceChange(value);
    if (!requireText) setTimeout(onNext, 320);
  }

  // Focus textarea when choice is made and text is required
  useEffect(() => {
    if (requireText && choiceValue && textRef.current) {
      setTimeout(() => textRef.current?.focus(), 200);
    }
  }, [choiceValue, requireText]);

  return (
    <motion.div
      variants={stagger(0.04, 0.1)}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-center px-6 md:px-0 h-full max-w-2xl mx-auto w-full gap-6"
    >
      {/* Step number */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <motion.span
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C1410] text-[#FBF4E8] text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...SPRING, delay: 0.05 }}
        >
          {step.number}
        </motion.span>
        <span className="text-xs font-semibold text-[#27BE5D] uppercase tracking-widest">→</span>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-[#1C1410] leading-snug"
      >
        {step.question}
      </motion.h2>

      {step.subtext && (
        <motion.p variants={fadeUp} className="text-sm text-[#B0A898] -mt-3">
          {step.subtext}
        </motion.p>
      )}

      {/* Choice cards */}
      <motion.div variants={stagger(0.06, 0.07)} className="flex flex-wrap gap-3">
        {step.choices.map((c) => {
          const selected = choiceValue === c.value;
          return (
            <motion.button
              key={c.value}
              variants={fadeUp}
              onClick={() => handleSelect(c.value)}
              whileHover={{
                scale: 1.04, y: -3,
                boxShadow: selected ? "0 10px 28px rgba(39,190,93,0.22)" : "0 8px 24px rgba(0,0,0,0.10)",
              }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING}
              className={`
                relative flex items-center gap-3 px-5 py-4 rounded-2xl border-2
                font-semibold text-sm select-none overflow-hidden transition-colors duration-200
                ${selected
                  ? "border-[#27BE5D] bg-[#F0FBF4] text-[#27BE5D]"
                  : "border-[#E8E0D5] bg-white text-[#4A3728] hover:border-[#27BE5D]/40 hover:bg-[#F9FEF9]"}
              `}
            >
              <motion.span className="absolute inset-0 rounded-2xl bg-[#27BE5D]/10 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }} whileTap={{ scale: 2.5, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }} />
              <motion.span className="text-xl leading-none"
                animate={selected ? { rotate: [0, -12, 12, 0], scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}>
                {c.emoji}
              </motion.span>
              {c.label}
              <AnimatePresence>
                {selected && (
                  <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }} transition={SPRING}
                    className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#27BE5D]">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Required text area — slides in after a choice is made */}
      <AnimatePresence>
        {requireText && choiceValue && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={SPRING_SOFT}
            className="overflow-hidden"
          >
            <AnimatedTextarea
              autoFocusRef={textRef}
              value={textValue || ""}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={step.textPlaceholder}
              rows={3}
            />
            <div className="flex items-center justify-between mt-5">
              {/* Progressive breadcrumb hint */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordCount >= minWords ? "done" : wordCount >= 2 ? "mid" : "start"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={`text-xs ${wordCount >= minWords ? "text-[#27BE5D]" : "text-[#C4C0B8]"}`}
                >
                  {wordCount >= (minWords * 0.8)
                    ? "Hmm, understandable..."
                    : wordCount >= (minWords * 0.6)
                    ? "Few more.."
                    : "Share a bit more.."}
                </motion.span>
              </AnimatePresence>
              <ContinueBtn onClick={onNext} show={canContinue} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-required: just show continue after tap */}
      {!requireText && (
        <div className="flex justify-end mt-1">
          <ContinueBtn onClick={onNext} show={!!choiceValue} />
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Summary + contact
// ─────────────────────────────────────────────────────────────
function SummaryContactStep({
  step, config, answers, name, email,
  onNameChange, onEmailChange, onSubmit, submitting, error,
}) {
  const questionSteps = config.steps.filter(
    (s) => !["welcome", "summary_contact", "thankyou"].includes(s.type)
  );

  const labelFor = (s) => {
    if (s.type === "choice_with_text") {
      const chosen = s.choices?.find((c) => c.value === answers[s.field]);
      const reason = answers[s.textField];
      if (!chosen && !reason) return null;
      return [chosen?.label, reason].filter(Boolean).join(" — ");
    }
    return answers[s.field] || null;
  };

  const canSubmit = name.trim() && email.trim();

  return (
    <motion.div
      variants={stagger(0.03, 0.07)}
      initial="hidden"
      animate="show"
      className="flex flex-col px-6 md:px-0 max-w-2xl mx-auto w-full py-10 gap-7"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-3xl font-bold text-[#1C1410] mb-1">{step.heading}</h2>
        <p className="text-sm text-[#7A6555]">{step.subheading}</p>
      </motion.div>

      {/* Answer cards */}
      <div className="space-y-3">
        {questionSteps.map((s, i) => {
          const answer = labelFor(s);
          if (!answer) return null;
          return (
            <motion.div
              key={s.field}
              variants={fadeUp}
              whileHover={{ scale: 1.005, x: 3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-[#F9F5EE] border border-[#E8E0D5] px-5 py-4 cursor-default"
            >
              <p className="text-[10px] font-bold text-[#27BE5D] uppercase tracking-widest mb-1.5">
                {s.number} — {s.question?.slice(0, 58)}{s.question?.length > 58 ? "…" : ""}
              </p>
              <p className="text-sm text-[#1C1410] leading-relaxed whitespace-pre-wrap">{answer}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Name + email */}
      <motion.div variants={fadeUp} className="space-y-3 pt-2">
        {[
          { type: "text",  value: name,  onChange: onNameChange,  placeholder: step.namePlaceholder },
          { type: "email", value: email, onChange: onEmailChange, placeholder: step.emailPlaceholder },
        ].map((field, i) => (
          <motion.input
            key={i}
            type={field.type}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
            onKeyDown={i === 1 ? (e) => { if (e.key === "Enter" && canSubmit) onSubmit(); } : undefined}
            className="
              w-full px-5 py-4 rounded-2xl border-2 border-[#E8E0D5]
              focus:border-[#27BE5D] focus:outline-none
              text-base text-[#1C1410] placeholder-[#C4C0B8]
              bg-white transition-colors duration-200 caret-[#27BE5D]
            "
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500 -mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div variants={fadeUp} className="flex items-center justify-between pb-10">
        <p className="text-xs text-[#C4C0B8]">No spam. Ever.</p>
        <ContinueBtn
          onClick={onSubmit}
          show={!!canSubmit}
          label={step.submitLabel || "Submit →"}
          loading={submitting}
        />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP: Thank you
// ─────────────────────────────────────────────────────────────
function ThankYouStep({ step, name }) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6 h-full gap-6 overflow-hidden">
      <ConfettiBurst />

      <motion.div
        className="relative z-10"
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.1 }}
      >
        <VideoPlaceholder />
      </motion.div>

      <motion.div
        variants={stagger(0.1, 0.13)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-bold text-[#1C1410] max-w-md leading-tight"
        >
          {name ? `Thanks, ${name.split(" ")[0]}.` : step.heading}
        </motion.h2>

        <motion.p variants={fadeUp} className="text-lg text-[#7A6555] max-w-sm leading-relaxed">
          {step.subheading}
        </motion.p>

        <motion.div variants={fadeIn}>
          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
          >
            <Link
              href="/"
              className="
                mt-2 inline-block px-7 py-3 rounded-xl
                border border-[#E2D5C3] text-sm font-semibold text-[#4A3728]
                hover:bg-[#F5EDD8] transition-colors
              "
            >
              Back to Houdy&apos;s
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FormRunner — main engine
// ─────────────────────────────────────────────────────────────
export function FormRunner({ config }) {
  const [stepIndex, setStepIndex]     = useState(0);
  const [dir, setDir]                 = useState(1);
  const [answers, setAnswers]         = useState({});
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");

  const steps       = config.steps;
  const currentStep = steps[stepIndex];
  const totalSteps  = steps.length;

  const questionSteps = steps.filter(
    (s) => !["welcome", "summary_contact", "thankyou"].includes(s.type)
  );
  const qIndex  = questionSteps.indexOf(currentStep);
  const progress =
    qIndex >= 0                              ? Math.round(((qIndex) / questionSteps.length) * 100)
    : currentStep.type === "summary_contact" ? 100
    : currentStep.type === "thankyou"        ? 100
    : 0;

  // GA4 helper — no-ops gracefully if gtag isn't loaded yet
  function gtag(...args) {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag(...args);
    }
  }

  function goNext() {
    const next = steps[stepIndex + 1];
    if (next) {
      gtag("event", "survey_step_view", {
        survey_slug:  config.slug,
        step_type:    next.type,
        step_number:  next.number ?? next.type,
      });
    }
    setDir(1);
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }
  function goBack() { setDir(-1); setStepIndex((i) => Math.max(i - 1, 0)); }
  function setAnswer(field, value) {
    setAnswers((p) => ({ ...p, [field]: value }));
    if (field === "own_vs_rent" || field === "financial_comfort") {
      gtag("event", "survey_choice", { survey_slug: config.slug, field, value });
    }
  }

  function toggleLogo(field, value) {
    setAnswers((p) => {
      const current = p[field] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...p, [field]: next };
    });
  }

  const canContinue = useCallback(() => {
    if (!currentStep.required) return true;
    switch (currentStep.type) {
      case "long_text":
        return !!answers[currentStep.field]?.trim();
      case "choice_with_text": {
        const hasChoice = !!answers[currentStep.field];
        if (!hasChoice) return false;
        if (currentStep.requireText) {
          const words = answers[currentStep.textField]?.trim().split(/\s+/).filter(Boolean).length || 0;
          return words >= (currentStep.minWords || 0);
        }
        return true;
      }
      case "logo_select":
        return (answers[currentStep.field] || []).length > 0;
      default:
        return true;
    }
  }, [currentStep, answers]);

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setSubmitError("Please enter your name and email to save your responses.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/forms/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_slug: config.slug,
          name:  name.trim(),
          email: email.trim(),
          answers,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Submission failed.");
      }
      gtag("event", "survey_complete", {
        survey_slug: config.slug,
      });
      goNext();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Global Enter handler — welcome + choice_with_text (when textarea not focused)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || e.shiftKey) return;

      if (currentStep.type === "welcome") {
        e.preventDefault();
        goNext();
        return;
      }

      if (
        (currentStep.type === "choice_with_text" || currentStep.type === "logo_select") &&
        canContinue() &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentStep, canContinue]);

  const showBack   = stepIndex > 0 && currentStep.type !== "thankyou";
  const showChrome = !["welcome", "thankyou"].includes(currentStep.type);

  return (
    <div className="relative flex flex-col bg-white" style={{ minHeight: "100svh" }}>
      {/* Decorative border frame — visible on tablet+ */}
      <motion.div
        className="pointer-events-none fixed inset-3 rounded-3xl border border-[#27BE5D]/20 z-30 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      {/* Mobile: just a top + bottom accent line */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#27BE5D]/30 to-transparent z-30 md:hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
      />
      <motion.div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#27BE5D]/20 to-transparent z-30 md:hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
      />

      {/* ── Top chrome ── */}
      <div className="sticky top-0 z-20 bg-white/96 backdrop-blur-md border-b border-gray-100/80">
        <div className="flex items-center justify-between px-5 py-3">

          {/* Back */}
          <div className="w-20">
            <AnimatePresence>
              {showBack && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  onClick={goBack}
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 text-sm text-[#B0A898] hover:text-[#4A3728] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Logo */}
          <Link href="/" className="font-serif font-bold text-xl text-[#1C1410] tracking-tight">
            Houdy&apos;s
          </Link>

          {/* Step counter */}
          <div className="w-20 flex justify-end">
            <AnimatePresence mode="wait">
              {showChrome && qIndex >= 0 && (
                <motion.span
                  key={qIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-[#C4C0B8] tabular-nums font-medium"
                >
                  {qIndex + 1} / {questionSteps.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        {showChrome && (
          <div className="relative h-[3px] bg-gray-100 w-full overflow-visible">
            <motion.div
              className="h-full bg-[#27BE5D] relative"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Travelling dot on the bar */}
              <motion.span
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#27BE5D] shadow-[0_0_6px_rgba(39,190,93,0.7)]"
                animate={{ opacity: progress > 0 && progress < 100 ? [1, 0.4, 1] : 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={stepIndex}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
            className={`w-full ${
              currentStep.type === "summary_contact"
                ? "max-w-2xl mx-auto"
                : "flex items-center justify-center min-h-[calc(100svh-52px)]"
            }`}
          >
            {currentStep.type === "welcome" && (
              <WelcomeStep step={currentStep} onNext={goNext} />
            )}
            {currentStep.type === "long_text" && (
              <LongTextStep
                step={currentStep}
                value={answers[currentStep.field] || ""}
                onChange={(v) => setAnswer(currentStep.field, v)}
                onNext={goNext}
                canContinue={canContinue()}
              />
            )}
            {currentStep.type === "logo_select" && (
              <LogoSelectStep
                step={currentStep}
                selectedValues={answers[currentStep.field] || []}
                onSelect={(v) => setAnswer(currentStep.field, v ? [v] : [])}
                onNext={goNext}
                canContinue={canContinue()}
              />
            )}
            {currentStep.type === "choice_with_text" && (
              <ChoiceWithTextStep
                step={currentStep}
                choiceValue={answers[currentStep.field] || ""}
                textValue={answers[currentStep.textField] || ""}
                onChoiceChange={(v) => setAnswer(currentStep.field, v)}
                onTextChange={(v) => setAnswer(currentStep.textField, v)}
                onNext={goNext}
                canContinue={canContinue()}
              />
            )}
            {currentStep.type === "summary_contact" && (
              <SummaryContactStep
                step={currentStep}
                config={config}
                answers={answers}
                name={name}
                email={email}
                onNameChange={setName}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
              />
            )}
            {currentStep.type === "thankyou" && (
              <ThankYouStep step={currentStep} name={name} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
