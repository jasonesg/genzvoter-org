"use client";

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// ─── Icon Image References (from winxp_assets) ───────────────────────────────
const icons = {
  user:        '/winxp_assets/windowsIcons/user.png',
  ie:          '/winxp_assets/windowsIcons/ie.png',
  outlook:     '/winxp_assets/windowsIcons/887(32x32).png',
  mine:        '/winxp_assets/minesweeper/mine-icon.png',
  notepad:     '/winxp_assets/windowsIcons/327(32x32).png',
  winamp:      '/winxp_assets/windowsIcons/winamp.png',
  paint:       '/winxp_assets/windowsIcons/680(32x32).png',
  mediaPlayer: '/winxp_assets/windowsIcons/846(32x32).png',
  messenger:   '/winxp_assets/windowsIcons/msn.png',
  documents:   '/winxp_assets/windowsIcons/308(32x32).png',
  recentDocs:  '/winxp_assets/windowsIcons/301(32x32).png',
  pictures:    '/winxp_assets/windowsIcons/307(32x32).png',
  music:       '/winxp_assets/windowsIcons/550(32x32).png',
  computer:    '/winxp_assets/windowsIcons/676(32x32).png',
  controlPanel:'/winxp_assets/windowsIcons/300(32x32).png',
  setAccess:   '/winxp_assets/windowsIcons/227(32x32).png',
  connect:     '/winxp_assets/windowsIcons/309(32x32).png',
  printer:     '/winxp_assets/windowsIcons/549(32x32).png',
  help:        '/winxp_assets/windowsIcons/747(32x32).png',
  search:      '/winxp_assets/windowsIcons/299(32x32).png',
  run:         '/winxp_assets/windowsIcons/743(32x32).png',
  lock:        '/winxp_assets/windowsIcons/546(32x32).png',
  shut:        '/winxp_assets/windowsIcons/310(32x32).png',
  allPrograms: '/winxp_assets/windowsIcons/all-programs.ico',
  empty:       '/winxp_assets/empty.png',
  // 16px sub-menu icons
  menuArrow:   '/winxp_assets/windowsIcons/358(16x16).png',
  menuIe:      '/winxp_assets/windowsIcons/896(16x16).png',
  menuOutlook: '/winxp_assets/windowsIcons/887(16x16).png',
  menuNotepad: '/winxp_assets/windowsIcons/327(16x16).png',
  menuPaint:   '/winxp_assets/windowsIcons/680(16x16).png',
  menuCalc:    '/winxp_assets/windowsIcons/74(16x16).png',
  menuCmd:     '/winxp_assets/windowsIcons/56(16x16).png',
  menuMedia:   '/winxp_assets/windowsIcons/846(16x16).png',
  menuMine:    '/winxp_assets/minesweeper/mine-icon.png',
  menuAccess:  '/winxp_assets/windowsIcons/238(16x16).png',
  menuMagnify: '/winxp_assets/windowsIcons/817(16x16).png',
  menuKeyboard:'/winxp_assets/windowsIcons/58(16x16).png',
  menuSound:   '/winxp_assets/windowsIcons/690(16x16).png',
  menuVolume:  '/winxp_assets/windowsIcons/120(16x16).png',
  menuBackup:  '/winxp_assets/windowsIcons/23(16x16).png',
  menuDefrag:  '/winxp_assets/windowsIcons/374(16x16).png',
  menuSecurity:'/winxp_assets/windowsIcons/214(16x16).png',
  menuSolitaire:'/winxp_assets/windowsIcons/solitaire.png',
  menuFreecell:'/winxp_assets/windowsIcons/freecell.png',
  menuPinball: '/winxp_assets/windowsIcons/pinball.png',
  menuSpider:  '/winxp_assets/windowsIcons/spider.png',
  MSN:         '/winxp_assets/windowsIcons/159(16x16).png',
  connection:  '/winxp_assets/windowsIcons/309(16x16).png',
  networkSetup:'/winxp_assets/windowsIcons/664(16x16).png',
};

// ─── All Programs Data ─────────────────────────────────────────────────────
const AllPrograms = [
  { type: 'menu', icon: icons.menuArrow, text: 'Accessories', items: [
    { type: 'menu', icon: icons.menuArrow, text: 'Accessibility', bottom: 'initial', items: [
      { type: 'item', icon: icons.menuAccess, text: 'Accessibility Wizard' },
      { type: 'item', icon: icons.menuMagnify, text: 'Magnifier' },
      { type: 'item', icon: icons.menuKeyboard, text: 'On-Screen Keyboard' },
    ]},
    { type: 'menu', icon: icons.menuArrow, text: 'Entertainment', bottom: 'initial', items: [
      { type: 'item', icon: icons.menuSound, text: 'Sound Recorder' },
      { type: 'item', icon: icons.menuVolume, text: 'Volume Control' },
      { type: 'item', icon: icons.menuMedia, text: 'Windows Media Player' },
    ]},
    { type: 'menu', icon: icons.menuArrow, text: 'System Tools', bottom: 'initial', items: [
      { type: 'item', icon: icons.menuBackup, text: 'Backup' },
      { type: 'item', icon: icons.menuDefrag, text: 'Disk Defragmenter' },
      { type: 'item', icon: icons.menuSecurity, text: 'Security Center' },
    ]},
    { type: 'separator' },
    { type: 'item', icon: icons.menuCmd, text: 'Command Prompt' },
    { type: 'item', icon: icons.menuNotepad, text: 'Notepad' },
    { type: 'item', icon: icons.menuPaint, text: 'Paint' },
    { type: 'item', icon: icons.menuCalc, text: 'Calculator' },
  ]},
  { type: 'menu', icon: icons.menuArrow, text: 'Games', items: [
    { type: 'item', icon: icons.menuFreecell, text: 'FreeCell' },
    { type: 'item', icon: icons.menuMine,     text: 'Minesweeper' },
    { type: 'item', icon: icons.menuPinball,  text: 'Pinball' },
    { type: 'item', icon: icons.menuSolitaire,text: 'Solitaire' },
    { type: 'item', icon: icons.menuSpider,   text: 'Spider Solitaire' },
  ]},
  { type: 'menu', icon: icons.menuArrow, text: 'Startup', items: [
    { type: 'item', icon: icons.empty, text: '(Empty)' },
  ]},
  { type: 'separator' },
  { type: 'item', icon: icons.menuIe,      text: 'Internet Explorer' },
  { type: 'item', icon: icons.menuOutlook, text: 'Outlook Express' },
  { type: 'item', icon: icons.menuMedia,   text: 'Windows Media Player' },
  { type: 'item', icon: icons.messenger,   text: 'Windows Messenger' },
];

const ConnectTo = [
  { type: 'item', icon: icons.MSN,        text: 'MSN' },
  { type: 'item', icon: icons.connection, text: 'Show all connections' },
];

const MyRecentDocuments = [
  { type: 'item', icon: icons.empty, text: '(Empty)' },
];

// ─── Recursive SubMenu ─────────────────────────────────────────────────────
function SubMenuItems({ data, onClick, depth = 0 }) {
  const [hoverIndex, setHoverIndex] = useState(-1);
  return (
    <SubMenuContainer depth={depth}>
      {data.map((item, index) => {
        if (item.type === 'separator') return <div key={index} className="sub-separator" />;
        if (item.type === 'menu') return (
          <div
            key={index}
            className={`sub-item ${hoverIndex === index ? 'hover' : ''}`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <img className="sub-img" src={item.icon} alt="" />
            <div className="sub-text">{item.text}</div>
            <div className="sub-arrow-icon">▶</div>
            {hoverIndex === index && item.items && (
              <SubMenuItems data={item.items} onClick={onClick} depth={depth + 1} />
            )}
          </div>
        );
        return (
          <div
            key={index}
            className="sub-item"
            onClick={() => onClick(item.text)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <img className="sub-img" src={item.icon} alt="" />
            <div className="sub-text">{item.text}</div>
          </div>
        );
      })}
    </SubMenuContainer>
  );
}

const SubMenuContainer = styled.div`
  position: absolute;
  left: 100%;
  bottom: ${({ depth }) => depth === 0 ? '-1px' : 'auto'};
  top: ${({ depth }) => depth > 0 ? '0' : 'auto'};
  background-color: white;
  padding: 2px 1px;
  box-shadow: inset 0 0 0 1px #72ade9, 2px 3px 3px rgba(0,0,0,0.5);
  z-index: 100;
  min-width: 160px;
  white-space: nowrap;

  .sub-separator {
    height: 2px;
    margin: 2px 5px;
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%);
    box-shadow: inset 3px 0 #4081ff;
  }
  .sub-item {
    height: 25px;
    display: flex;
    align-items: center;
    padding: 0 10px 0 5px;
    box-shadow: inset 3px 0 #4081ff;
    position: relative;
    cursor: pointer;
    color: black;
    font-size: 11px;
    font-family: Tahoma, sans-serif;
  }
  .sub-item:hover, .sub-item.hover {
    background-color: #1b65cc;
    color: white;
  }
  .sub-img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .sub-text {
    flex: 1;
    white-space: nowrap;
  }
  .sub-arrow-icon {
    font-size: 8px;
    margin-left: 4px;
    color: inherit;
  }
`;

// ─── Main Start Menu ──────────────────────────────────────────────────────
function StartMenuBase({ className, onClose, onMenuItemClick }) {
  const [hovering, setHovering] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    function handleMouseDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [onClose]);

  function handleClick(text) {
    onMenuItemClick(text);
    onClose();
  }

  return (
    <div className={className} ref={menuRef}>
      {/* Header */}
      <header>
        <img className="header__img" src={icons.user} alt="avatar" />
        <span className="header__text">User</span>
      </header>

      {/* Menu body */}
      <section className="menu">
        <hr className="orange-hr" />

        {/* Left column — Programs */}
        <div className="menu__left">
          {/* Pinned top apps */}
          <div className="menu__item" onClick={() => handleClick('Internet Explorer')}>
            <img className="menu__item__img" src={icons.ie} alt="IE" />
            <div className="menu__item__texts">
              <div className="menu__item__text">Internet</div>
              <div className="menu__item__subtext">Internet Explorer</div>
            </div>
          </div>
          <div className="menu__item" onClick={() => handleClick('E-mail')}>
            <img className="menu__item__img" src={icons.outlook} alt="Outlook" />
            <div className="menu__item__texts">
              <div className="menu__item__text">E-mail</div>
              <div className="menu__item__subtext">Outlook Express</div>
            </div>
          </div>
          <div className="menu__separator" />
          {/* Recent apps */}
          {[
            { icon: icons.mine,        text: 'Minesweeper' },
            { icon: icons.notepad,     text: 'Notepad' },
            { icon: icons.winamp,      text: 'Winamp' },
            { icon: icons.paint,       text: 'Paint' },
            { icon: icons.mediaPlayer, text: 'Windows Media Player' },
            { icon: icons.messenger,   text: 'Windows Messenger' },
          ].map(({ icon, text }) => (
            <div key={text} className="menu__item" onClick={() => handleClick(text)}>
              <img className="menu__item__img" src={icon} alt={text} />
              <div className="menu__item__texts">
                <div className="menu__item__text">{text}</div>
              </div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div className="menu__separator" />
          {/* All Programs */}
          <div
            className={`menu__item all-programs ${hovering === 'All Programs' ? 'hover' : ''}`}
            onMouseEnter={() => setHovering('All Programs')}
            onMouseLeave={() => setHovering('')}
          >
            <img className="menu__item__img" style={{ width: 20, height: 20, opacity: 0 }} src={icons.empty} alt="" />
            <div className="menu__item__texts">
              <div className="menu__item__text" style={{ display: 'flex', alignItems: 'center' }}>
                All Programs
                <img src={icons.allPrograms} alt="" style={{ marginLeft: 5, height: 18, verticalAlign: 'middle' }} />
              </div>
            </div>
            {hovering === 'All Programs' && (
              <div style={{ position: 'absolute', left: '100%', bottom: 0, zIndex: 200 }}>
                <SubMenuItems data={AllPrograms} onClick={handleClick} />
              </div>
            )}
          </div>
        </div>

        {/* Right column — Places */}
        <div className="menu__right">
          <div className="menu__item" onClick={() => handleClick('My Documents')}>
            <img className="menu__item__img" src={icons.documents} alt="My Documents" />
            <div className="menu__item__texts"><div className="menu__item__text">My Documents</div></div>
          </div>

          {/* My Recent Documents (with submenu) */}
          <div
            className={`menu__item ${hovering === 'My Recent Documents' ? 'hover' : ''}`}
            onMouseEnter={() => setHovering('My Recent Documents')}
            onMouseLeave={() => setHovering('')}
          >
            <img className="menu__item__img" src={icons.recentDocs} alt="My Recent Documents" />
            <div className="menu__item__texts"><div className="menu__item__text">My Recent Documents</div></div>
            <div className="menu__arrow" style={{ borderLeftColor: hovering === 'My Recent Documents' ? '#fff' : '#00136b' }} />
            {hovering === 'My Recent Documents' && (
              <div style={{ position: 'absolute', left: '100%', bottom: 0, zIndex: 200 }}>
                <SubMenuItems data={MyRecentDocuments} onClick={handleClick} />
              </div>
            )}
          </div>

          {[
            { icon: icons.pictures, text: 'My Pictures' },
            { icon: icons.music,    text: 'My Music' },
            { icon: icons.computer, text: 'My Computer' },
          ].map(({ icon, text }) => (
            <div key={text} className="menu__item" onClick={() => handleClick(text)}>
              <img className="menu__item__img" src={icon} alt={text} />
              <div className="menu__item__texts"><div className="menu__item__text">{text}</div></div>
            </div>
          ))}

          <div className="menu__separator" />

          {[
            { icon: icons.controlPanel, text: 'Control Panel' },
            { icon: icons.setAccess,    text: 'Set Program Access and Defaults' },
          ].map(({ icon, text }) => (
            <div key={text} className="menu__item" onClick={() => handleClick(text)}>
              <img className="menu__item__img" src={icon} alt={text} />
              <div className="menu__item__texts"><div className="menu__item__text">{text}</div></div>
            </div>
          ))}

          {/* Connect To (with submenu) */}
          <div
            className={`menu__item ${hovering === 'Connect To' ? 'hover' : ''}`}
            onMouseEnter={() => setHovering('Connect To')}
            onMouseLeave={() => setHovering('')}
          >
            <img className="menu__item__img" src={icons.connect} alt="Connect To" />
            <div className="menu__item__texts"><div className="menu__item__text">Connect To</div></div>
            <div className="menu__arrow" style={{ borderLeftColor: hovering === 'Connect To' ? '#fff' : '#00136b' }} />
            {hovering === 'Connect To' && (
              <div style={{ position: 'absolute', left: '100%', bottom: 0, zIndex: 200 }}>
                <SubMenuItems data={ConnectTo} onClick={handleClick} />
              </div>
            )}
          </div>

          <div className="menu__item" onClick={() => handleClick('Printers and Faxes')}>
            <img className="menu__item__img" src={icons.printer} alt="Printers and Faxes" />
            <div className="menu__item__texts"><div className="menu__item__text">Printers and Faxes</div></div>
          </div>

          <div className="menu__separator" />

          {[
            { icon: icons.help,   text: 'Help and Support' },
            { icon: icons.search, text: 'Search' },
            { icon: icons.run,    text: 'Run...' },
          ].map(({ icon, text }) => (
            <div key={text} className="menu__item" onClick={() => handleClick(text)}>
              <img className="menu__item__img" src={icon} alt={text} />
              <div className="menu__item__texts"><div className="menu__item__text">{text}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer__item" onClick={() => { handleClick('Log Off'); }}>
          <img className="footer__item__img" src={icons.lock} alt="" />
          <span>Log Off</span>
        </div>
        <div className="footer__item" onClick={() => { handleClick('Turn Off Computer'); }}>
          <img className="footer__item__img" src={icons.shut} alt="" />
          <span>Turn Off Computer</span>
        </div>
      </footer>
    </div>
  );
}

export const StartMenu = styled(StartMenuBase)`
  font-size: 11px;
  line-height: 14px;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4282d6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 1000;
  box-shadow: 2px -2px 5px rgba(0,0,0,0.4);
  width: 380px;

  header {
    position: relative;
    align-self: flex-start;
    display: flex;
    align-items: center;
    color: #fff;
    height: 54px;
    padding: 6px 5px 5px;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: linear-gradient(
      to bottom,
      #1868ce 0%, #0e60cb 12%, #0e60cb 20%, #1164cf 32%,
      #1667cf 33%, #1b6cd3 47%, #1e70d9 54%, #2476dc 60%,
      #297ae0 65%, #3482e3 77%, #3786e5 79%, #428ee9 90%, #4791eb 100%
    );
    overflow: hidden;
  }
  header:before {
    content: '';
    display: block;
    position: absolute;
    top: 1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      to right,
      transparent 0, rgba(255,255,255,0.3) 1%, rgba(255,255,255,0.5) 2%,
      rgba(255,255,255,0.5) 95%, rgba(255,255,255,0.3) 98%,
      rgba(255,255,255,0.2) 99%, transparent 100%
    );
    box-shadow: inset 0 -1px 1px #0e60cb;
  }
  .header__img {
    width: 42px;
    height: 42px;
    margin-right: 5px;
    border-radius: 3px;
    border: 2px solid rgba(222,222,222,0.8);
  }
  .header__text {
    font-size: 14px;
    font-weight: 700;
    text-shadow: 1px 1px rgba(0,0,0,0.7);
  }

  footer {
    display: flex;
    align-self: flex-end;
    align-items: center;
    justify-content: flex-end;
    color: #fff;
    height: 36px;
    width: 100%;
    background: linear-gradient(
      to bottom,
      #4282d6 0%, #3b85e0 3%, #418ae3 5%, #418ae3 17%,
      #3c87e2 21%, #3786e4 26%, #3482e3 29%, #2e7ee1 39%,
      #2374df 49%, #2072db 57%, #196edb 62%, #176bd8 72%,
      #1468d5 75%, #1165d2 83%, #0f61cb 88%
    );
  }
  .footer__item {
    padding: 3px 8px;
    display: flex;
    margin-right: 10px;
    align-items: center;
    cursor: pointer;
    border-radius: 2px;
    &:hover { background-color: rgba(60, 80, 210, 0.5); }
    &:active > * { transform: translate(1px, 1px); }
  }
  .footer__item__img {
    border-radius: 3px;
    margin-right: 4px;
    width: 22px;
    height: 22px;
  }

  .menu {
    display: flex;
    margin: 0 2px;
    position: relative;
    border-top: 1px solid #385de7;
    box-shadow: 0 1px #385de7;
    width: 100%;
  }
  .orange-hr {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: block;
    height: 2px;
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, #da884a 50%, rgba(0,0,0,0) 100%);
    border: 0;
    pointer-events: none;
  }
  .menu__left {
    background-color: #fff;
    padding: 6px 5px 0;
    width: 190px;
    display: flex;
    flex-direction: column;
  }
  .menu__right {
    background-color: #cbe3ff;
    border-left: solid rgba(58,58,255,0.37) 1px;
    padding: 6px 5px 5px;
    width: 190px;
    color: #00136b;
  }
  .menu__separator {
    height: 7.5px;
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%);
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    background-clip: content-box;
    margin: 2px 0;
  }
  .menu__right .menu__separator {
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(135,179,226,0.71) 50%, rgba(0,0,0,0) 100%);
    background-clip: content-box;
  }
  .menu__item {
    padding: 1px 3px;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    cursor: pointer;
    position: relative;
    border-radius: 1px;
    /* Default text color: black for left column, dark blue for right */
    color: #000;
  }
  .menu__left .menu__item {
    height: 34px;
    color: #000;
  }
  .menu__right .menu__item {
    height: 26px;
    line-height: 13px;
    color: #00136b;
  }
  .menu__item:hover, .menu__item.hover {
    color: white !important;
    background-color: #2f71cd;
  }
  .menu__item:hover .menu__item__subtext, .menu__item.hover .menu__item__subtext {
    color: white !important;
  }
  .menu__item__texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  /* Default: normal weight for all items */
  .menu__item__text {
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
    color: inherit;
  }
  /* Bold only for pinned top 2 items (Internet, E-mail) */
  .menu__left .menu__item:nth-child(1) .menu__item__text,
  .menu__left .menu__item:nth-child(2) .menu__item__text {
    font-weight: bold;
  }
  /* Bold for all right-column items (My Documents etc.) */
  .menu__right .menu__item__text {
    font-weight: bold;
  }
  .menu__right .menu__item__img {
    margin-right: 5px;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .menu__left .menu__item__img {
    margin-right: 5px;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }
  .menu__item__subtext {
    color: rgba(0,0,0,0.4);
    line-height: 12px;
    font-weight: normal;
    font-size: 10px;
  }
  /* All Programs text is bold */
  .all-programs .menu__item__text {
    font-weight: bold;
  }
  .menu__arrow {
    border: 3.5px solid transparent;
    border-right: 0;
    border-left-color: #00136b;
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }
  .menu__item:hover .menu__arrow,
  .menu__item.hover .menu__arrow {
    border-left-color: white;
  }
`;

// ─── Error Dialog (Application not found) ─────────────────────────────────
function ErrorDialogBase({ className, onClose }) {
  return (
    <div className={className}>
      <div className="dialog__titlebar">
        <div className="dialog__title">
          <span className="title__icon">C:\</span>
        </div>
        <button className="dialog__close" onClick={onClose}>✕</button>
      </div>
      <div className="dialog__body">
        <div className="dialog__icon">✕</div>
        <div className="dialog__message">
          <div className="dialog__path">C:\</div>
          <div>Application not found</div>
        </div>
      </div>
      <div className="dialog__footer">
        <button className="dialog__ok" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export const ErrorDialog = styled(ErrorDialogBase)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 310px;
  background-color: #ece9d8;
  border: 1px solid #0054e3;
  border-top: 3px solid #0054e3;
  font-family: Tahoma, sans-serif;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.5);

  .dialog__titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    padding: 0 4px 0 8px;
    background: linear-gradient(to bottom, #0058ee 0%, #3593ff 4%, #288eff 6%, #127dff 8%, #036ffc 10%, #0262ee 14%, #0057e5 20%, #0054e3 24%, #0055eb 56%, #005bf5 66%, #026afe 76%, #0062ef 86%, #0052d6 92%, #0040ab 94%, #003092 100%);
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
  .dialog__title {
    display: flex;
    align-items: center;
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px #000;
  }
  .title__icon {
    font-size: 11px;
    font-weight: bold;
  }
  .dialog__close {
    width: 21px;
    height: 21px;
    background: radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, white 100%);
    border: 1px solid white;
    border-radius: 3px;
    color: white;
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-weight: bold;
    box-shadow: inset 0 -1px 2px 1px #da4600;
    &:hover { filter: brightness(120%); }
    &:active { filter: brightness(90%); }
  }
  .dialog__body {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    gap: 14px;
  }
  .dialog__icon {
    width: 32px;
    height: 32px;
    background: #cc0000;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dialog__message {
    font-size: 11px;
    color: #000;
    line-height: 1.5;
  }
  .dialog__path {
    font-weight: bold;
    margin-bottom: 2px;
  }
  .dialog__footer {
    display: flex;
    justify-content: center;
    padding: 0 0 14px;
  }
  .dialog__ok {
    min-width: 75px;
    height: 23px;
    background: linear-gradient(to bottom, #f0efe7 0%, #dbd9c8 100%);
    border: 1px solid #888171;
    border-top-color: #fff;
    border-left-color: #fff;
    font-family: Tahoma, sans-serif;
    font-size: 11px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #ece9d8, inset 0 0 0 1px #ece9d8;
    &:hover { background: linear-gradient(to bottom, #dfd3c1 0%, #c9c3b0 100%); }
    &:active { border-color: #888171; border-top-color: #888171; border-left-color: #888171; }
    &:focus { outline: 1px dotted #000; outline-offset: -4px; }
  }
`;

// ─── Log Off Dialog ───────────────────────────────────────────────────────
function LogOffDialogBase({ className, onClose }) {
  return (
    <div className="logoff__overlay">
      <div className={className}>
        <div className="logoff__header">
          <span className="logoff__title">Log Off Windows</span>
        </div>
        <div className="logoff__body">
          <p>Are you sure you want to log off?</p>
          <div className="logoff__buttons">
            <button className="logoff__btn" onClick={onClose}>Switch User</button>
            <button className="logoff__btn" onClick={onClose}>Log Off</button>
            <button className="logoff__btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LogOffDialog = styled(LogOffDialogBase)`
  background-color: #ece9d8;
  border: 1px solid #0054e3;
  width: 350px;
  font-family: Tahoma, sans-serif;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.5);

  &.logoff__overlay {
    /* handled at outer div level via inline style */
  }
  .logoff__header {
    height: 26px;
    background: linear-gradient(to bottom, #0058ee 0%, #0054e3 100%);
    display: flex;
    align-items: center;
    padding: 0 8px;
  }
  .logoff__title {
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px #000;
  }
  .logoff__body {
    padding: 20px;
    font-size: 11px;
  }
  .logoff__buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 14px;
  }
  .logoff__btn {
    min-width: 80px;
    height: 23px;
    background: linear-gradient(to bottom, #f0efe7 0%, #dbd9c8 100%);
    border: 1px solid #888171;
    font-family: Tahoma, sans-serif;
    font-size: 11px;
    cursor: pointer;
    &:hover { background: linear-gradient(to bottom, #dfd3c1 0%, #c9c3b0 100%); }
  }
`;

// ─── Turn Off Dialog ──────────────────────────────────────────────────────
function TurnOffDialogBase({ className, onClose }) {
  return (
    <div className="turnoff__overlay">
      <div className={className}>
        <div className="turnoff__header">
          <span>Turn off computer</span>
        </div>
        <div className="turnoff__body">
          <p>What do you want the computer to do?</p>
          <div className="turnoff__buttons">
            <button className="turnoff__btn" onClick={onClose}>Stand By</button>
            <button className="turnoff__btn" onClick={onClose}>Turn Off</button>
            <button className="turnoff__btn" onClick={onClose}>Restart</button>
            <button className="turnoff__btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TurnOffDialog = styled(TurnOffDialogBase)`
  background-color: #ece9d8;
  border: 1px solid #0054e3;
  width: 380px;
  font-family: Tahoma, sans-serif;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.5);

  .turnoff__header {
    height: 26px;
    background: linear-gradient(to bottom, #0058ee 0%, #0054e3 100%);
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px #000;
  }
  .turnoff__body {
    padding: 20px;
    font-size: 11px;
  }
  .turnoff__buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .turnoff__btn {
    min-width: 80px;
    height: 23px;
    background: linear-gradient(to bottom, #f0efe7 0%, #dbd9c8 100%);
    border: 1px solid #888171;
    font-family: Tahoma, sans-serif;
    font-size: 11px;
    cursor: pointer;
    &:hover { background: linear-gradient(to bottom, #dfd3c1 0%, #c9c3b0 100%); }
  }
`;
