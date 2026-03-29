"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useDragControls } from "framer-motion";

/* ─── Flea puzzle icon ─────────────────────────────────────────────────── */
function PuzzleIcon({ size = 14, color = "rgba(255,255,255,0.8)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path
        fillRule="evenodd"
        d="M20 20 L46 20 C46 20 44 10 50 6 C56 2 62 8 62 14 C62 17 60 20 60 20
           L100 20 L100 46 C100 46 110 44 114 50 C118 56 112 62 106 62 C103 62 100 60 100 60
           L100 100 L74 100 C74 100 76 110 70 114 C64 118 58 112 58 106 C58 103 60 100 60 100
           L20 100 L20 74 C20 74 10 76 6 70 C2 64 8 58 14 58 C17 58 20 60 20 60 Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Nav items ────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Marketplace", desc: "Browse & buy grailed streetwear" },
  { label: "Sellers",     desc: "Connect with authenticated sellers" },
  { label: "Live Drops",  desc: "Browse and reserve upcoming drop exclusives" },
  { label: "Auth Center", desc: "99.9% Flea authentication guarantee" },
  { label: "Settings",    desc: "Manage your Flea account preferences" },
  { label: "News",        desc: "Latest drops & Flea community updates" },
];

/* ─── Shared button style ──────────────────────────────────────────────── */
const TitleBtn = ({ children, onClick, title }) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: 18, height: 16, padding: 0,
      border: "1px solid rgba(255,255,255,0.25)",
      borderBottomColor: "rgba(0,0,0,0.4)",
      borderRightColor: "rgba(0,0,0,0.4)",
      background: "#9aa090",
      cursor: "pointer", fontSize: 9,
      color: "#1a1e16",
      display: "flex", alignItems: "center", justifyContent: "center",
      lineHeight: 1,
    }}
  >{children}</button>
);

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function DesignerDashboard() {
  const desktopRef = useRef(null);
  const dragControls = useDragControls();

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}
    >
      {/* ── DESKTOP ───────────────────────────────────────────────────── */}
      <div
        ref={desktopRef}
        className="flex-1 w-full relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          /* Flex-center the window — no JS position math needed */
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Back-to-login desktop icon */}
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 20 }}>
          <Link
            href="/get-started"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, width: 58, textDecoration: "none", cursor: "default",
            }}
          >
            <img
              src="/winxp_assets/windowsIcons/back.png" alt=""
              style={{ width: 32, height: 32, objectFit: "contain",
                filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))" }}
              onError={e => (e.target.style.display = "none")}
            />
            <span style={{
              color: "#fff", fontSize: 10, textAlign: "center", lineHeight: 1.2,
              textShadow: "0 1px 2px rgba(0,0,0,0.9)",
            }}>Back to Login</span>
          </Link>
        </div>

        {/* ── DRAGGABLE FLEA APP WINDOW ─────────────────────────────── */}
        {/* The window lives inside the flex-centered desktop, so its
            natural starting position IS the center — no JS calc needed.
            Drag moves it within the desktop via dragConstraints. */}
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={desktopRef}
          dragElastic={0}
          style={{
            cursor: "default",
            touchAction: "none",
            willChange: "transform",
            zIndex: 10,
            /* Window chrome */
            background: "#4a5240",
            border: "1px solid #2a2e24",
            boxShadow: "0 6px 32px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            /* Responsive width — grows with content, caps at 580px */
            width: "min(580px, 90vw)",
            /* Height is driven purely by content — no fixed H */
          }}
        >
          {/* Titlebar ───────────────────────────────────────────────── */}
          <div
            onPointerDown={e => dragControls.start(e)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              height: 24, padding: "0 4px 0 6px",
              borderBottom: "1px solid rgba(0,0,0,0.25)",
              cursor: "grab", flexShrink: 0, userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, overflow: "hidden" }}>
              <PuzzleIcon size={13} color="rgba(255,255,255,0.75)" />
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "bold", whiteSpace: "nowrap" }}>
                Flea App
              </span>
            </div>
            <div
              style={{ display: "flex", gap: 2 }}
              onPointerDown={e => e.stopPropagation()}
            >
              <TitleBtn title="Minimize">─</TitleBtn>
              <TitleBtn title="Close">✕</TitleBtn>
            </div>
          </div>

          {/* Scanline texture */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.07,
            backgroundImage: "repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.3) 2px,rgba(0,0,0,0.3) 4px)",
            zIndex: 0,
          }} />

          {/* Nav rows — height grows with content automatically */}
          <div style={{ padding: "12px 20px 0", position: "relative", zIndex: 1 }}>
            {NAV_ITEMS.map(({ label, desc }, i) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "8px 0",
                  borderBottom: i < NAV_ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.18)" : "none",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Label pill */}
                <div style={{
                  width: 110, flexShrink: 0,
                  padding: "4px 8px",
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(0,0,0,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 11, fontWeight: "bold", textAlign: "center",
                  boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.07)",
                }}>
                  {label}
                </div>
                {/* Description — wraps naturally, drives row height */}
                <span style={{ color: "#a8b0a1", fontSize: 12, flex: 1, lineHeight: 1.4 }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "relative", zIndex: 1,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "10px 20px", marginTop: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.28, color: "#e0e0e0" }}>
              <span style={{
                fontSize: 11, fontWeight: "bold", letterSpacing: "0.05em",
                border: "2px solid currentColor", padding: "1px 4px", lineHeight: 1,
              }}>HOUDYS</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <PuzzleIcon size={15} color="currentColor" />
                <span style={{ fontSize: 9, fontWeight: "bold", letterSpacing: "0.08em", fontStyle: "italic" }}>
                  FLEA APP
                </span>
              </div>
            </div>
            <a href="/get-started" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "3px 18px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(0,0,0,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 11, cursor: "pointer",
                  fontFamily: "Tahoma, sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.2)")}
              >
                Close
              </button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── TASKBAR ─────────────────────────────────────────────────────── */}
      <div style={{
        height: 30, flexShrink: 0,
        background: "linear-gradient(to bottom,#1f2f86 0,#3165c4 3%,#3682e5 6%,#4490e6 10%,#3883e5 12%,#2b71e0 15%,#2663da 18%,#235bd6 20%,#2258d5 23%,#2157d6 38%,#245ddb 54%,#2562df 86%,#245fdc 89%,#2158d4 92%,#1d4ec0 95%,#1941a5 98%)",
        display: "flex", alignItems: "stretch",
        borderTop: "1px solid #1230a0",
        position: "relative", zIndex: 50,
      }}>
        <a href="/get-started" style={{ textDecoration: "none", height: "100%", display: "flex", alignItems: "stretch" }}>
          <img
            src="/winxp_assets/windowsIcons/start.png" alt="start"
            style={{ height: 30, width: "auto", display: "block" }}
            onError={e => (e.target.style.display = "none")}
          />
        </a>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 2px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            color: "#fff", borderRadius: 2, margin: "3px 2px", padding: "0 8px", height: 22,
            fontSize: 11, fontStyle: "italic", fontWeight: "bold",
            background: "linear-gradient(to bottom,#2060c8 0%,#1a4eb0 100%)",
            border: "1px solid #1a3e80",
            boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.15)",
            textShadow: "1px 1px rgba(0,0,0,0.5)",
          }}>
            <PuzzleIcon size={11} color="white" />
            Flea App
          </div>
        </div>
        <div style={{
          background: "linear-gradient(to bottom,#0c59b9 1%,#139ee9 6%,#18b5f2 10%,#139beb 14%,#1290e8 19%,#0d8dea 63%,#0d9ff1 81%,#0f9eed 88%,#119be9 91%,#1392e2 94%,#137ed7 97%,#095bc9 100%)",
          borderLeft: "1px solid #1042af", padding: "0 10px",
          display: "flex", alignItems: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 11, whiteSpace: "nowrap" }}>
            {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
