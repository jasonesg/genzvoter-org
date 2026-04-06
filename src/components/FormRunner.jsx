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
              "radial-gradient(circle, rgba(196,96,42,0.11) 0%, transparent 68%)",
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
      color: ["#C4602A","#F5EDD8","#1C1410","#E2D5C3","#D4A574"][i % 5],
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
// Animated textarea with expanding underline
// ─────────────────────────────────────────────────────────────
function AnimatedTextarea({ value, onChange, onKeyDown, placeholder, rows = 4, autoFocusRef }) {
  const [focused, setFocused] = useState(false);
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
          py-3 pb-4 leading-relaxed caret-[#C4602A]
        "
      />
      {/* Track */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8E0D5]" />
      {/* Animated fill */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#C4602A] rounded-full origin-left"
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0.4 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Continue button — springs in/out with canContinue
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
        >
          <motion.button
            onClick={onClick}
            disabled={loading}
            whileHover={{ scale: 1.04, y: -2, boxShadow: "0 10px 28px rgba(196,96,42,0.28)" }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            className="
              px-7 py-3 rounded-xl bg-[#C4602A] text-white
              text-sm font-bold uppercase tracking-widest
              shadow-md shadow-[#C4602A]/20
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
        {step.eyebrow && (
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5EDD8] border border-[#E2D5C3] text-xs text-[#7A6555] font-medium"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#C4602A]"
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
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 16px 36px rgba(196,96,42,0.30)" }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="
              mt-1 px-10 py-4 rounded-2xl bg-[#C4602A] text-white
              text-base font-bold tracking-wide
              shadow-lg shadow-[#C4602A]/25
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
          className="text-xs font-semibold text-[#C4602A] uppercase tracking-widest"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          →
        </motion.span>
      </motion.div>

      {/* Question */}
      <motion.h2
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-[#1C1410] leading-snug"
      >
        {step.question}
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
// STEP: Choice + optional text (Q7)
// ─────────────────────────────────────────────────────────────
function ChoiceWithTextStep({ step, choiceValue, onChoiceChange, onNext }) {
  // Auto-advance 320ms after a card is tapped — gives the selection animation
  // time to play before the step slides away.
  function handleSelect(value) {
    onChoiceChange(value);
    setTimeout(onNext, 320);
  }

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
        <span className="text-xs font-semibold text-[#C4602A] uppercase tracking-widest">→</span>
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

      {/* Choice cards — tap to select + auto-advance */}
      <motion.div variants={stagger(0.06, 0.07)} className="flex flex-wrap gap-3">
        {step.choices.map((c) => {
          const selected = choiceValue === c.value;
          return (
            <motion.button
              key={c.value}
              variants={fadeUp}
              onClick={() => handleSelect(c.value)}
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
              className={`
                relative flex items-center gap-3 px-5 py-4 rounded-2xl border-2
                font-semibold text-sm select-none
                ${selected
                  ? "border-[#C4602A] bg-[#FFF5F0] text-[#C4602A]"
                  : "border-[#E8E0D5] bg-white text-[#4A3728]"}
              `}
            >
              <span className="text-xl leading-none">{c.emoji}</span>
              {c.label}
              <AnimatePresence>
                {selected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={SPRING}
                    className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#C4602A]"
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
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
              <p className="text-[10px] font-bold text-[#C4602A] uppercase tracking-widest mb-1.5">
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
              focus:border-[#C4602A] focus:outline-none
              text-base text-[#1C1410] placeholder-[#C4C0B8]
              bg-white transition-colors duration-200 caret-[#C4602A]
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

      <motion.span
        className="text-7xl relative z-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.1 }}
      >
        {step.emoji}
      </motion.span>

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
              Back to Houdys
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
    // Track choice selections
    if (field === "own_vs_rent") {
      gtag("event", "survey_choice", {
        survey_slug: config.slug,
        field,
        value,
      });
    }
  }

  const canContinue = useCallback(() => {
    if (!currentStep.required) return true;
    switch (currentStep.type) {
      case "long_text":       return !!answers[currentStep.field]?.trim();
      case "choice_with_text": return !!answers[currentStep.field];
      default: return true;
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

      // For choice_with_text: advance only when a choice is selected
      // and the focus is NOT inside a textarea (textarea handles its own Enter)
      if (
        currentStep.type === "choice_with_text" &&
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
          <Link href="/" className="font-bold text-[15px] text-[#1C1410] tracking-tight">
            Houdys
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
          <div className="h-[3px] bg-gray-100 w-full">
            <motion.div
              className="h-full bg-[#C4602A]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
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
