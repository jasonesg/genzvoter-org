"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useDragControls, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { StartMenu, ErrorDialog, LogOffDialog, TurnOffDialog } from "../../components/winXPStartMenu";

// ─── Items that show "Application not found" ──────────────────────────────
const ERROR_ITEMS = new Set([
  'My Documents', 'My Pictures', 'My Music',
  'Control Panel', 'Set Program Access and Defaults',
  'Printers and Faxes', 'Help and Support',
]);

// ─── Steam-style window — Classic Win98/XP grey (NOT blue Luna) ───────────
// Matches the reference screenshot: grey gradient titlebar, flat grey buttons
function SteamWindowBase({ title, icon, onPointerDown, children, className }) {
  return (
    <div className={className}>
      {/* Titlebar — same olive colour as body, only minimize + close */}
      <div className="steam__titlebar" onPointerDown={onPointerDown}>
        <div className="steam__title__left">
          <span className="steam__icon">{icon}</span>
          <span className="steam__title__text">{title}</span>
        </div>
        <div className="steam__controls" onPointerDown={e => e.stopPropagation()}>
          <button className="steam__btn steam__btn--minimize" title="Minimize" />
          <button className="steam__btn steam__btn--close" title="Close" />
        </div>
      </div>
      {/* Window content */}
      <div className="steam__content">
        {children}
      </div>
    </div>
  );
}

const SteamWindow = styled(SteamWindowBase)`
  display: flex;
  flex-direction: column;
  /* Unified Steam dark olive — same as the body, no grey border */
  background: #4a5240;
  border: 1px solid #2a2e24;
  box-shadow: 0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
  font-family: Tahoma, 'MS Sans Serif', sans-serif;
  resize: none;

  .steam__titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 25px;
    padding: 0 4px 0 6px;
    background: transparent;
    border-bottom: 1px solid rgba(0,0,0,0.25);
    cursor: grab;
    flex-shrink: 0;
    user-select: none;
    &:active { cursor: grabbing; }
  }

  .steam__title__left {
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;
    flex: 1;
  }
  .steam__icon {
    display: flex;
    align-items: center;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.85;
  }
  .steam__title__text {
    color: rgba(255,255,255,0.75);
    font-size: 11px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .steam__controls {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }
  /* Flat grey square buttons — matches the reference screenshot */
  .steam__btn {
    width: 18px;
    height: 16px;
    border: 1px solid rgba(255,255,255,0.25);
    border-bottom-color: rgba(0,0,0,0.4);
    border-right-color: rgba(0,0,0,0.4);
    border-radius: 0;
    cursor: pointer;
    position: relative;
    background: #9aa090;
    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.2);
    padding: 0;
    &:hover { background: #aab0a0; }
    &:active { background: #808878; box-shadow: inset 1px 1px 0 rgba(0,0,0,0.2); }
  }
  /* Minimize — horizontal bar */
  .steam__btn--minimize:before {
    content: '';
    position: absolute;
    left: 3px;
    bottom: 4px;
    width: 9px;
    height: 2px;
    background: #1a1e16;
  }
  /* Close — X */
  .steam__btn--close:before,
  .steam__btn--close:after {
    content: '';
    position: absolute;
    left: 7px;
    top: 2px;
    width: 2px;
    height: 10px;
    background: #1a1e16;
  }
  .steam__btn--close:before { transform: rotate(45deg); }
  .steam__btn--close:after  { transform: rotate(-45deg); }

  .steam__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
`;

// ─── Steam-style button (matching the reference screenshot) ───────────────
const SteamButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 5px 12px;
  font-size: 11px;
  font-family: Tahoma, 'MS Sans Serif', sans-serif;
  color: #d8ded3;
  background: linear-gradient(to bottom, #626d56 0%, #46513e 100%);
  border: 1px solid #1a1e16;
  border-top-color: #8a9a72;
  border-left-color: #7a8a64;
  border-radius: 2px;
  box-shadow: inset 1px 1px 0 rgba(162,172,151,0.4), inset -1px -1px 0 rgba(0,0,0,0.2);
  cursor: pointer;
  letter-spacing: 0.02em;
  text-decoration: none;

  &:hover {
    background: linear-gradient(to bottom, #6c785e 0%, #4d5945 100%);
    color: white;
  }
  &:active {
    background: linear-gradient(to bottom, #46513e 0%, #3b4334 100%);
    box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
  }
`;

// ─── WinXP Taskbar (exact gradient from original) ─────────────────────────
const Taskbar = styled.div`
  height: 30px;
  background: linear-gradient(
    to bottom,
    #1f2f86 0, #3165c4 3%, #3682e5 6%, #4490e6 10%, #3883e5 12%,
    #2b71e0 15%, #2663da 18%, #235bd6 20%, #2258d5 23%, #2157d6 38%,
    #245ddb 54%, #2562df 86%, #245fdc 89%, #2158d4 92%, #1d4ec0 95%, #1941a5 98%
  );
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  z-index: 50;
  flex-shrink: 0;
  font-family: Tahoma, sans-serif;
  border-top: 1px solid #1230a0;

  .taskbar__right {
    background: linear-gradient(
      to bottom,
      #0c59b9 1%, #139ee9 6%, #18b5f2 10%, #139beb 14%, #1290e8 19%,
      #0d8dea 63%, #0d9ff1 81%, #0f9eed 88%, #119be9 91%, #1392e2 94%, #137ed7 97%, #095bc9 100%
    );
    border-left: 1px solid #1042af;
    box-shadow: inset 1px 0 1px #18bbff;
    padding: 0 8px;
    margin-left: auto;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 4px;
  }
  .taskbar__left {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding-left: 2px;
  }
  .taskbar__window {
    max-width: 160px;
    color: #fff;
    border-radius: 2px;
    margin: 3px 2px;
    padding: 0 8px;
    height: 22px;
    font-size: 11px;
    background: linear-gradient(to bottom, #2060c8 0%, #1a4eb0 100%);
    border: 1px solid #1a3e80;
    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.15), inset 0 0 2px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-family: Tahoma, sans-serif;
    font-weight: bold;
    text-shadow: 1px 1px rgba(0,0,0,0.5);
  }
  .taskbar__time {
    color: #fff;
    font-size: 11px;
    white-space: nowrap;
    font-family: Tahoma, sans-serif;
  }
`;

// ─── Start Button — using the actual start.png from winxp assets ──────────
// The original uses an image, not SVG, with the exact green button look
const StartButtonWrapper = styled.button`
  height: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;

  &:active img { filter: brightness(85%); }

  img {
    height: 28px;
    width: auto;
    display: block;
  }
`;

// ─── Main Clock ───────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function update() {
      const d = new Date();
      let h = d.getHours(), m = d.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTime(`${h}:${m.toString().padStart(2,'0')} ${ampm}`);
    }
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);
  return <span className="taskbar__time">{time}</span>;
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function GetStartedPage() {
  const [showOptions, setShowOptions]     = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog]   = useState(null);
  const [showBalloon, setShowBalloon]     = useState(true);
  const [paintActive, setPaintActive]     = useState(true);
  const [myComputerActive, setMyComputerActive] = useState(false);

  const dragControls = useDragControls();
  const paintDragControls = useDragControls();
  const myComputerDragControls = useDragControls();
  const containerRef = useRef(null);
  const MODAL_W = 480;
  const MODAL_H = 450;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Paint window starts top-left offset so it doesn't perfectly overlap the Flea window
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cx = useMotionValue(40);
  const cy = useMotionValue(40);
  useLayoutEffect(() => {
    // No longer need to snap on first load because CSS perfectly centers it!
    // x and y motions represent offset from the CSS centered position.
  }, []); // runs once before first paint

  function handleMenuItemClick(text) {
    if (text === 'My Computer') {
      setMyComputerActive(true);
    } else if (text === 'Paint') {
      setPaintActive(true);
    } else if (ERROR_ITEMS.has(text)) {
      setActiveDialog('error');
    } else if (text === 'Log Off') {
      setActiveDialog('logoff');
    } else if (text === 'Turn Off Computer') {
      setActiveDialog('turnoff');
    }
  }

  function closeDialog() { setActiveDialog(null); }

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden select-none"
      ref={containerRef}
      style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}
    >
      {/* ── DESKTOP AREA ── */}
      <div
        className="flex-1 w-full relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000')" }}
      >
        {/* Desktop icons — left column */}
        <div className="absolute top-0 left-0 p-3 flex flex-col gap-5">
          <Link href="/" draggable={false} className="flex flex-col items-center gap-1 w-[58px] group cursor-default">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/winxp_assets/windowsIcons/back.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.5))' }} onError={e => e.target.style.display='none'} />
            </div>
            <span className="text-white text-[10px] text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-[#316ac5]/80 px-0.5 rounded-sm">Back to Hub</span>
          </Link>
          <div className="flex flex-col items-center gap-1 w-[58px] group cursor-default" onClick={() => setMyComputerActive(true)}>
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/winxp_assets/windowsIcons/676(32x32).png" alt="" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.5))' }} />
            </div>
            <span className="text-white text-[10px] text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-[#316ac5]/80 px-0.5 rounded-sm">My Computer</span>
          </div>
        </div>

        {/* ── MY COMPUTER WINDOW ── */}
        {myComputerActive && (
        <motion.div
          drag
          dragControls={myComputerDragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={containerRef}
          className="absolute will-change-transform"
          style={{ x: cx, y: cy, width: 620, height: 420, cursor: 'default', touchAction: 'none', zIndex: 9,
            display: 'flex', flexDirection: 'column',
            border: '3px solid #0054e3', borderTopLeftRadius: 8, borderTopRightRadius: 8,
            boxShadow: '2px 2px 6px rgba(0,0,0,0.5)', overflow: 'hidden', backgroundColor: '#ece9d8'
          }}
        >
          {/* My Computer Titlebar */}
          <div
            onPointerDown={e => myComputerDragControls.start(e)}
            style={{
              background: 'linear-gradient(to right, #0054e3 0%, #27c1ff 100%)',
              height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 4px 0 5px', cursor: 'grab', userSelect: 'none', flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <img src="/winxp_assets/windowsIcons/676(32x32).png" alt="" style={{width: 14, height: 14, objectFit: 'contain'}} />
              <span style={{ color: 'white', fontSize: 11, fontWeight: 'bold', fontFamily: 'Tahoma,sans-serif', textShadow: '1px 1px #000' }}>
                My Computer
              </span>
            </div>
            <div style={{ display: 'flex', gap: 2 }} onPointerDown={e => e.stopPropagation()}>
              <button title="Minimize"
                style={{ width: 21, height: 21, padding: 0, fontSize: 11, lineHeight: 1, border: '1px solid white', borderRadius: 3, background: 'linear-gradient(to bottom, #4282d6, #1468d5)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }}
              ><span style={{ position: 'relative', top: -3 }}>_</span></button>
              <button title="Maximize"
                style={{ width: 21, height: 21, padding: 0, fontSize: 15, lineHeight: 1, border: '1px solid white', borderRadius: 3, background: 'linear-gradient(to bottom, #4282d6, #1468d5)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }}
              ><span style={{ position: 'relative', top: -1 }}>□</span></button>
              <button title="Close" onClick={() => setMyComputerActive(false)}
                style={{ width: 21, height: 21, padding: 0, fontSize: 11, lineHeight: 1, fontWeight: 'bold', border: '1px solid white', borderRadius: 3, background: 'radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, white 100%)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px 1px #da4600' }}
              >✕</button>
            </div>
          </div>
          {/* Menu bar */}
          <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', borderTop: '1px solid #fff', display: 'flex', gap: 2, padding: '2px 4px', flexShrink: 0 }}>
            {['File','Edit','View','Favorites','Tools','Help'].map(m => (
              <span key={m} style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', padding: '1px 5px', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background='#316ac5', e.currentTarget.style.color='white')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent', e.currentTarget.style.color='black')}>
                {m}
              </span>
            ))}
          </div>
          <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', borderTop: '1px solid #fff', padding: '4px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Tahoma,sans-serif', fontSize: 11, color: '#000' }}>
               <span style={{ color: '#aaa' }}>Back ▼</span>
             </div>
             <div style={{ borderLeft: '1px solid #aca899', borderRight: '1px solid #fff', height: 20 }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Tahoma,sans-serif', fontSize: 11, color: '#000' }}>
               <img src="/winxp_assets/windowsIcons/299(32x32).png" alt="" style={{width: 16, height: 16}} /> Search
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Tahoma,sans-serif', fontSize: 11, color: '#000' }}>
               <img src="/winxp_assets/windowsIcons/747(32x32).png" alt="" style={{width: 16, height: 16}} /> Folders
             </div>
          </div>
          <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', borderTop: '1px solid #fff', padding: '3px 4px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
             <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#aca899', marginRight: 8 }}>Address</span>
             <div style={{ flex: 1, background: 'white', border: '1px solid #7f9db9', display: 'flex', alignItems: 'center', padding: '1px 4px', gap: 4 }}>
                <img src="/winxp_assets/windowsIcons/676(32x32).png" alt="" style={{width: 14, height: 14}} />
                <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>My Computer</span>
             </div>
             <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 2, background: '#316ac5', color: 'white', padding: '2px 6px', borderRadius: 2, fontSize: 11, fontFamily: 'Tahoma,sans-serif' }}>
                <span style={{ fontWeight: 'bold' }}>→</span> Go
             </div>
          </div>
          {/* Main content body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#fff' }}>
            <div style={{ width: 180, background: 'linear-gradient(to bottom, #7ba2e7 0%, #6375d6 100%)', borderRight: '1px solid #aca899', padding: 10, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
               {/* Left Sidebar Pane */}
               <div style={{ background: 'white', borderRadius: 3, overflow: 'hidden', boxShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: 'linear-gradient(to right, #f2f5fd, #d1dcfb)', padding: '4px 8px', fontWeight: 'bold', fontSize: 11, color: '#0c327d', fontFamily: 'Tahoma,sans-serif' }}>System Tasks</div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/299(32x32).png" style={{width: 14}}/> View system information</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/300(32x32).png" style={{width: 14}}/> Add or remove programs</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/300(32x32).png" style={{width: 14}}/> Change a setting</div>
                  </div>
               </div>
               <div style={{ background: 'white', borderRadius: 3, overflow: 'hidden', boxShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: 'linear-gradient(to right, #f2f5fd, #d1dcfb)', padding: '4px 8px', fontWeight: 'bold', fontSize: 11, color: '#0c327d', fontFamily: 'Tahoma,sans-serif' }}>Other Places</div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/309(32x32).png" style={{width: 14}}/> My Network Places</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/308(32x32).png" style={{width: 14}}/> My Documents</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#0c327d', cursor: 'pointer' }}><img src="/winxp_assets/windowsIcons/300(32x32).png" style={{width: 14}}/> Control Panel</div>
                  </div>
               </div>
            </div>
            <div style={{ flex: 1, padding: 15, overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column', gap: 15 }}>
               {/* Right Main Pane */}
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000', marginBottom: 5, paddingBottom: 2, borderBottom: '1px solid #7ba2e7' }}>Files Stored on This Computer</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <img src="/winxp_assets/windowsIcons/308(32x32).png" alt="" style={{width: 32, height: 32}} />
                        <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>Shared Documents</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <img src="/winxp_assets/windowsIcons/308(32x32).png" alt="" style={{width: 32, height: 32}} />
                        <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>User's Documents</span>
                     </div>
                  </div>
               </div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000', marginBottom: 5, paddingBottom: 2, borderBottom: '1px solid #7ba2e7' }}>Hard Disk Drives</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <img src="/winxp_assets/windowsIcons/drive.png" alt="" style={{width: 32, height: 32}} onError={(e) => { e.target.src='/winxp_assets/windowsIcons/318(32x32).png'; }} />
                        <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>Local Disk (C:)</span>
                     </div>
                  </div>
               </div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000', marginBottom: 5, paddingBottom: 2, borderBottom: '1px solid #7ba2e7' }}>Devices with Removable Storage</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <img src="/winxp_assets/windowsIcons/disc.png" alt="" style={{width: 32, height: 32}} onError={(e) => { e.target.src='/winxp_assets/windowsIcons/546(32x32).png'; }} />
                        <span style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>CD Drive (D:)</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* ── PAINT WINDOW ── */}
        {paintActive && (
        <motion.div
          drag
          dragControls={paintDragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={containerRef}
          className="absolute will-change-transform flex flex-col overflow-hidden"
          style={{ x: px, y: py, width: 480, height: 420, cursor: 'default', touchAction: 'none', zIndex: 8,
            left: '50%', top: '50%', marginLeft: -300, marginTop: -240,
            border: '3px solid #0054e3', borderTopLeftRadius: 8, borderTopRightRadius: 8,
            boxShadow: '2px 2px 6px rgba(0,0,0,0.5)', backgroundColor: '#c0c0c0'
          }}
        >
          {/* Titlebar */}
          <div
            onPointerDown={e => paintDragControls.start(e)}
            style={{
              background: 'linear-gradient(to right, #0054e3 0%, #27c1ff 100%)',
              height: 25, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 4px 0 3px', cursor: 'grab', userSelect: 'none', flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <img src="/winxp_assets/windowsIcons/680(32x32).png" alt="Paint" style={{width: 14, height: 14, objectFit: 'contain'}} />
              <span style={{ color: 'white', fontSize: 11, fontWeight: 'bold', fontFamily: 'Tahoma,sans-serif', textShadow: '1px 1px #000' }}>
                Untitled - Paint
              </span>
            </div>
            <div style={{ display: 'flex', gap: 2 }} onPointerDown={e => e.stopPropagation()}>
              <button title="Minimize"
                style={{ width: 21, height: 21, padding: 0, fontSize: 11, lineHeight: 1, border: '1px solid white', borderRadius: 3, background: 'linear-gradient(to bottom, #4282d6, #1468d5)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }}
              ><span style={{ position: 'relative', top: -3 }}>_</span></button>
              <button title="Maximize"
                style={{ width: 21, height: 21, padding: 0, fontSize: 15, lineHeight: 1, border: '1px solid white', borderRadius: 3, background: 'linear-gradient(to bottom, #4282d6, #1468d5)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }}
              ><span style={{ position: 'relative', top: -1 }}>□</span></button>
              <button title="Close"
                onClick={() => setPaintActive(false)}
                style={{ width: 21, height: 21, padding: 0, fontSize: 11, lineHeight: 1, fontWeight: 'bold', border: '1px solid white', borderRadius: 3, background: 'radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, white 100%)', color: 'white', cursor: 'pointer', fontFamily: 'Tahoma,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -1px 2px 1px #da4600' }}
              >✕</button>
            </div>
          </div>
          {/* Menu bar */}
          <div style={{ background: '#c0c0c0', borderBottom: '1px solid #ACA899', display: 'flex', gap: 0, padding: '1px 2px', flexShrink: 0 }}>
            {['File','Edit','View','Image','Colors','Help','Extras'].map((m) => (
              <span key={m} style={{ fontSize: 11, fontFamily: 'Tahoma,sans-serif', padding: '1px 5px', cursor: 'default', color: '#000' }}
                onMouseEnter={e => (e.currentTarget.style.background='#316ac5', e.currentTarget.style.color='white')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent', e.currentTarget.style.color='#000')}>
                <span style={{textDecoration: 'underline'}}>{m[0]}</span>{m.slice(1)}
              </span>
            ))}
          </div>
          {/* Body: tools + canvas */}
          <div style={{ display: 'flex', background: '#c0c0c0', flex: 1, overflow: 'hidden' }}>
            {/* Tool sidebar */}
            <div style={{ width: 56, background: '#c0c0c0', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'min-content min-content', gap: 0, borderTop: '1px solid white', borderLeft: '1px solid white', borderBottom: '1px solid #808080', borderRight: '1px solid #808080' }}>
                {[
                  /* 1. Free-form select */ <svg viewBox="0 0 16 16" width="16" height="16"><polygon points="8,1 12,4 10,10 4,11 2,6" fill="none" stroke="black" strokeWidth="1" strokeDasharray="1,1"/></svg>,
                  /* 2. Select */           <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="3" width="12" height="10" fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2"/></svg>,
                  /* 3. Eraser */           <svg viewBox="0 0 16 16" width="16" height="16"><polygon points="3,10 8,5 12,9 7,14" fill="white" stroke="black" strokeWidth="1"/><polygon points="3,10 7,14 6,15 2,11" fill="gray" stroke="black" strokeWidth="1"/></svg>,
                  /* 4. Fill */             <svg viewBox="0 0 16 16" width="16" height="16"><path d="M11,4 L13,6 L6,13 L4,11 Z" fill="none" stroke="black" strokeWidth="1"/><path d="M4,11 L6,13 C4,14 2,13 1,12 C1,11 2,11 4,11 Z" fill="blue"/><line x1="12" y1="5" x2="15" y2="8" stroke="black" strokeWidth="1"/></svg>,
                  /* 5. Pick Color */       <svg viewBox="0 0 16 16" width="16" height="16"><polygon points="1,15 5,14 13,6 10,3 2,11" fill="none" stroke="black" strokeWidth="1"/><line x1="2" y1="11" x2="5" y2="14" stroke="black" strokeWidth="1"/></svg>,
                  /* 6. Magnifier */        <svg viewBox="0 0 16 16" width="16" height="16"><circle cx="6" cy="6" r="4" fill="none" stroke="black" strokeWidth="1"/><line x1="9" y1="9" x2="14" y2="14" stroke="black" strokeWidth="2"/></svg>,
                  /* 7. Pencil */           <svg viewBox="0 0 16 16" width="16" height="16"><polygon points="2,14 5,14 14,5 11,2 2,11" fill="none" stroke="black" strokeWidth="1"/><polygon points="2,14 5,14 2,11" fill="black"/></svg>,
                  /* 8. Brush */            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M12,2 C14,2 14,4 12,6 L6,14 L3,14 L5,6 Z" fill="none" stroke="black" strokeWidth="1"/><circle cx="4" cy="14" r="1.5" fill="black"/></svg>,
                  /* 9. Airbrush */         <svg viewBox="0 0 16 16" width="16" height="16"><rect x="5" y="6" width="6" height="8" fill="none" stroke="black" strokeWidth="1"/><path d="M6,6 L8,2 L10,6" fill="gray" stroke="black" strokeWidth="1"/><circle cx="3" cy="3" r="0.5" fill="black"/><circle cx="5" cy="2" r="0.5" fill="black"/><circle cx="2" cy="5" r="0.5" fill="black"/></svg>,
                  /* 10. Text */            <span style={{fontWeight:'bold', fontFamily:'serif', fontSize:14, lineHeight:1, color:'black'}}>A</span>,
                  /* 11. Line */            <svg viewBox="0 0 16 16" width="16" height="16"><line x1="2" y1="14" x2="14" y2="2" stroke="black" strokeWidth="1"/></svg>,
                  /* 12. Curve */           <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2,12 Q8,16 10,8 T14,2" fill="none" stroke="black" strokeWidth="1"/></svg>,
                  /* 13. Rectangle */       <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="3" width="12" height="10" fill="none" stroke="black" strokeWidth="1"/></svg>,
                  /* 14. Polygon */         <svg viewBox="0 0 16 16" width="16" height="16"><polygon points="8,1 14,7 10,14 4,12 2,5" fill="none" stroke="black" strokeWidth="1"/></svg>,
                  /* 15. Ellipse */         <svg viewBox="0 0 16 16" width="16" height="16"><ellipse cx="8" cy="8" rx="6" ry="4" fill="none" stroke="black" strokeWidth="1"/></svg>,
                  /* 16. Rounded Rect */    <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="3" width="12" height="10" rx="3" fill="none" stroke="black" strokeWidth="1"/></svg>
                ].map((iconPath, i) => (
                  <div key={i} style={{ width: 25, height: 25, background: i===6?'#ece9d8':'#c0c0c0', borderTop: i===6?'1px solid #808080':'1px solid #ece9d8', borderLeft: i===6?'1px solid #808080':'1px solid #ece9d8', borderBottom: i===6?'1px solid white':'1px solid #808080', borderRight: i===6?'1px solid white':'1px solid #808080', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {iconPath}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 4, width: 42, height: 44, borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderBottom: '1px solid white', borderRight: '1px solid white' }}></div>
            </div>
            {/* Canvas area */}
            <div style={{ flex: 1, overflow: 'hidden', background: '#808080', padding: '3px 0 0 3px', position: 'relative' }}>
              <div style={{ width: 280, height: 200, background: 'white', cursor: 'crosshair', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -4, top: '50%', width: 3, height: 3, background: '#000080', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', bottom: -4, left: '50%', width: 3, height: 3, background: '#000080', transform: 'translateX(-50%)' }} />
                <div style={{ position: 'absolute', right: -4, bottom: -4, width: 3, height: 3, background: '#000080' }} />
              </div>
            </div>
          </div>
          {/* Color palette block */}
          <div style={{ background: '#c0c0c0', padding: '4px', display: 'flex', gap: 4, flexShrink: 0, borderTop: '1px solid white' }}>
            {/* Active colors swatch */}
            <div style={{ position: 'relative', width: 28, height: 30, flexShrink: 0, borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderBottom: '1px solid white', borderRight: '1px solid white', background: '#c0c0c0' }}>
              <div style={{ position: 'absolute', left: 7, top: 9, width: 14, height: 14, background: 'white', borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderBottom: '1px solid white', borderRight: '1px solid white' }} />
              <div style={{ position: 'absolute', left: 3, top: 5, width: 14, height: 14, background: 'black', borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderBottom: '1px solid white', borderRight: '1px solid white' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 1 }}>
              {[
                '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808040','#004040','#0080ff','#004080','#4000ff','#804000',
                '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80','#80ffff','#8080ff','#ff0080','#ff8040'
              ].map(c => (
                <div key={c} style={{ width: 14, height: 14, background: c, borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderBottom: '1px solid white', borderRight: '1px solid white', cursor: 'pointer', flexShrink: 0 }} />
              ))}
            </div>
          </div>
          {/* Status bar */}
          <div style={{ background: '#ece9d8', borderTop: '1px solid white', padding: '2px 4px', display: 'flex', alignItems: 'center', flexShrink: 0, height: 20 }}>
            <div style={{ borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderRight: '1px solid white', borderBottom: '1px solid white', padding: '1px 3px', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
               <span style={{ fontSize: 10, fontFamily: 'Tahoma,sans-serif', color: '#000' }}>For Help, click Help Topics on the Help Menu.</span>
            </div>
            <div style={{ width: 120, borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderRight: '1px solid white', borderBottom: '1px solid white', marginLeft: 2, height: '100%' }}></div>
            <div style={{ width: 120, borderTop: '1px solid #808080', borderLeft: '1px solid #808080', borderRight: '1px solid white', borderBottom: '1px solid white', marginLeft: 2, height: '100%' }}></div>
          </div>
        </motion.div>
        )}

        {/* ── DRAGGABLE FLEA WINDOW ──
            useMotionValue keeps x/y outside React state — toggling
            content inside never causes a position reset. ── */}
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={containerRef}
          className="absolute will-change-transform"
          style={{ 
            x, y, width: MODAL_W, cursor: 'default', touchAction: 'none', zIndex: 10,
            left: '50%', top: '50%', marginLeft: -(MODAL_W/2), marginTop: -(MODAL_H/2 + 15)
          }}
        >
          <SteamWindow
            title="Flea App"
            icon={
              <svg width="13" height="13" viewBox="0 0 100 60" fill="white">
                <circle cx="20" cy="30" r="14" stroke="white" strokeWidth="8" fill="none" />
                <circle cx="70" cy="15" r="14" stroke="white" strokeWidth="8" fill="none" />
                <line x1="30" y1="24" x2="58" y2="10" stroke="white" strokeWidth="12" strokeLinecap="round" />
                <circle cx="65" cy="45" r="6" stroke="white" strokeWidth="6" fill="none" />
                <line x1="30" y1="35" x2="59" y2="45" stroke="white" strokeWidth="8" strokeLinecap="round" />
              </svg>
            }
            onPointerDown={(e) => dragControls.start(e)}
          >
            {/* ── STEAM CONTENT ── */}
            <div
              style={{
                background: '#4a5240',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px 32px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle scanlines */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1,
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              }} />

              {/* Flea Logo */}
              <div className="relative z-10 flex items-center gap-4 mb-6 select-none pointer-events-none w-full justify-center">
                {/* Puzzle-piece icon matching the Flea logo */}
                <svg width="70" height="70" viewBox="0 0 120 120" fill="none" style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.45))', flexShrink: 0 }}>
                  {/* Classic puzzle piece: tab on top, tab on right, notch on bottom, notch on left */}
                  <path
                    fillRule="evenodd"
                    d="
                      M20 20
                      L46 20
                      C46 20 44 10 50 6 C56 2 62 8 62 14 C62 17 60 20 60 20
                      L100 20
                      L100 46
                      C100 46 110 44 114 50 C118 56 112 62 106 62 C103 62 100 60 100 60
                      L100 100
                      L74 100
                      C74 100 76 110 70 114 C64 118 58 112 58 106 C58 103 60 100 60 100
                      L20 100
                      L20 74
                      C20 74 10 76 6 70 C2 64 8 58 14 58 C17 58 20 60 20 60
                      Z
                    "
                    fill="#3a9fd4"
                  />
                </svg>
                {/* 'Flea' in bold italic serif — matching the reference logo */}
                <div className="flex flex-col">
                  <span style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 1,
                    fontFamily: 'Tahoma, sans-serif',
                  }}>WELCOME TO</span>
                  <span style={{
                    color: 'white',
                    fontSize: 52,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    lineHeight: 1,
                    fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif',
                    textShadow: '1px 2px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.01em',
                  }}>Flea</span>
                </div>
              </div>

              {/* Bullet features */}
              <div className="relative z-10 w-full flex flex-col gap-1 mb-6" style={{ color: '#a8b0a1', fontSize: 13, fontFamily: 'Tahoma, sans-serif' }}>
                {[
                  'Buy, Sell, Trade grailed pieces',
                  'Connect with authenticated buyers',
                  '99.9% authentication guarantee',
                  'The absolute rarest Chrome, Supreme, YSL grails on market.',
                  'Chat with Flea sellers for early access',
                ].map(t => (
                  <p key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    <span style={{ fontSize: 9 }}>»</span> {t}
                  </p>
                ))}
              </div>

              {/* Buttons */}
              <div className="relative z-10 w-full flex flex-col gap-2">
                <SteamButton type="button">
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }} fill="currentColor">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Continue with Google account
                </SteamButton>

                {/* Other Options — no animation on the wrapper to avoid layout shifts */}
                <SteamButton type="button" onClick={() => setShowOptions(o => !o)}>
                  Other login options
                  <span style={{
                    display: 'inline-block',
                    fontSize: 9,
                    transform: showOptions ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    marginLeft: 4,
                  }}>▼</span>
                </SteamButton>

                {showOptions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
                      <SteamButton as="div" style={{ cursor: 'pointer' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                        </svg>
                        Developer Login (Mock Auth)
                      </SteamButton>
                    </Link>
                    <a href="/designer-dashboard" style={{ textDecoration: 'none', display: 'block' }}>
                      <SteamButton as="div" style={{ cursor: 'pointer' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Designer Login (Dash Mockup)
                      </SteamButton>
                    </a>
                  </div>
                )}
              </div>

              {/* Footer branding — VALVE stamp only */}
              <div className="relative z-10 w-full flex items-center justify-start mt-8 px-1 select-none"
                   style={{ opacity: 0.25, color: '#e0e0e0' }}>
                <span style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: '0.05em', border: '2px solid currentColor', padding: '2px 5px', lineHeight: 1, fontFamily: 'Tahoma, sans-serif' }}>HOUDYS</span>
              </div>
            </div>
          </SteamWindow>
        </motion.div>

        {/* ── DIALOGS ── */}
        {activeDialog === 'error' && <ErrorDialog onClose={closeDialog} />}
        {activeDialog === 'logoff' && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, background: 'rgba(0,0,0,0.3)' }}>
            <LogOffDialog onClose={closeDialog} />
          </div>
        )}
        {activeDialog === 'turnoff' && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, background: 'rgba(0,0,0,0.3)' }}>
            <TurnOffDialog onClose={closeDialog} />
          </div>
        )}
      </div>

      {/* ── TASKBAR ── */}
      <Taskbar>
        {/* Start button + popup */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'stretch' }}>
          <StartButtonWrapper onClick={() => setStartMenuOpen(o => !o)}>
            {/* Use the actual start.png from the winXP assets */}
            <img
              src="/winxp_assets/windowsIcons/start.png"
              alt="start"
              style={{ height: 30, width: 'auto' }}
              onError={e => {
                // Fallback: render text start button if image missing
                e.target.style.display = 'none';
                e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
              }}
            />
            {/* Fallback start button (hidden by default) */}
            <span style={{
              display: 'none',
              alignItems: 'center',
              gap: 3,
              padding: '0 8px',
              background: 'linear-gradient(to bottom, #3ba242 0%, #258129 100%)',
              height: '100%',
              borderRadius: '0 8px 8px 0',
              color: 'white',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: 13,
              fontFamily: 'Tahoma, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
            }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 87.6 87.6">
                <path d="M14.6 15l26-4v28l-26 2v-26zm29-4l38-5v34l-38 3v-32zm-29 34l26-2v27l-26-4v-21zm29-2l38-3v33l-38-6v-24z" fill="#fff" />
              </svg>
              start
            </span>
          </StartButtonWrapper>

          <AnimatePresence>
            {startMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.08 }}
                style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 200 }}
              >
                <StartMenu
                  onClose={() => setStartMenuOpen(false)}
                  onMenuItemClick={handleMenuItemClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active windows area */}
        <div className="taskbar__left">
          <div className="taskbar__window">
            <svg width="12" height="12" viewBox="0 0 100 60" fill="white">
              <circle cx="20" cy="30" r="14" stroke="white" strokeWidth="8" fill="none" />
              <circle cx="70" cy="15" r="14" stroke="white" strokeWidth="8" fill="none" />
              <line x1="30" y1="24" x2="58" y2="10" stroke="white" strokeWidth="12" strokeLinecap="round" />
              <circle cx="65" cy="45" r="6" stroke="white" strokeWidth="6" fill="none" />
              <line x1="30" y1="35" x2="59" y2="45" stroke="white" strokeWidth="8" strokeLinecap="round" />
            </svg>
            Flea App
          </div>
          {paintActive && (
            <div className="taskbar__window">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20.71 4.04a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0L9 10.25l2.75 2.75L20.71 4.04z" />
                <path d="M7 11L3 21l5-1 5-5-6-4z" />
              </svg>
              Untitled - Paint
            </div>
          )}
          {myComputerActive && (
            <div className="taskbar__window">
              <img src="/winxp_assets/windowsIcons/676(32x32).png" style={{width: 12, height: 12}} alt="" />
              My Computer
            </div>
          )}
        </div>

        {/* System tray */}
        <div className="taskbar__right" style={{ position: 'relative' }}>
          {/* Antivirus balloon tooltip */}
          {showBalloon && (
            <div style={{
                position: 'absolute', bottom: 36, right: 4,
                background: '#ffffe1', border: '1px solid #000000',
                borderRadius: 4, padding: '6px 10px 6px 8px',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                width: 240, zIndex: 200, fontFamily: 'Tahoma,sans-serif',
              }}>
                <button onClick={() => setShowBalloon(false)}
                  style={{ position: 'absolute', top: 3, right: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, lineHeight: 1, color: '#666' }}>✕</button>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  {/* Red shield */}
                  <svg width="18" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="#cc0000" />
                    <path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="white" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2, color: '#000' }}>Your computer might be at risk</div>
                    <div style={{ fontSize: 10, color: '#000', lineHeight: 1.4 }}>Antivirus software might not be installed. Click this balloon to fix this problem.</div>
                  </div>
                </div>
                {/* Balloon tail pointing down-right */}
                <div style={{ position: 'absolute', bottom: -8, right: 18, width: 0, height: 0,
                  borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
                  borderTop: '8px solid #000000' }} />
                <div style={{ position: 'absolute', bottom: -6, right: 19, width: 0, height: 0,
                  borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                  borderTop: '7px solid #ffffe1' }} />
              </div>
          )}
          {/* Network icon */}
          <img src="/winxp_assets/windowsIcons/690(16x16).png" alt="" style={{ width: 15, height: 15 }} onError={e => e.target.style.display='none'} />
          {/* Volume icon */}
          <img src="/winxp_assets/windowsIcons/394(16x16).png" alt="" style={{ width: 15, height: 15 }} onError={e => e.target.style.display='none'} />
          {/* Antivirus red shield */}
          <svg width="15" height="15" viewBox="0 0 24 24" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setShowBalloon(v => !v)}>
            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="#cc0000" />
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="white" />
          </svg>
          <Clock />
        </div>
      </Taskbar>
    </div>
  );
}
