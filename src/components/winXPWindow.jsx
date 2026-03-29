"use client";

import React from 'react';
import styled from 'styled-components';

function HeaderButtonsBase({
  onMaximize,
  onMinimize,
  onClose,
  maximized,
  resizable = false,
  className,
}) {
  return (
    <div className={className}>
      <button
        type="button"
        className="header__button header__button--minimize"
        onMouseUp={onMinimize}
      />
      <button
        type="button"
        className={`header__button ${
          maximized ? 'header__button--maximized' : 'header__button--maximize'
        } ${resizable ? '' : 'header__button--disable'}`}
        onMouseUp={onMaximize}
      />
      <button
        type="button"
        className="header__button header__button--close"
        onMouseUp={onClose}
      />
    </div>
  );
}

const HeaderButtons = styled(HeaderButtonsBase)`
  opacity: ${({ isFocus }) => (isFocus ? 1 : 0.6)};
  height: 22px;
  display: flex;
  align-items: center;
  margin-top: -1px;
  margin-right: 1px;
  .header__button {
    margin-right: 1px;
    position: relative;
    width: 22px;
    height: 22px;
    border: 1px solid #fff;
    border-radius: 3px;
    &:hover {
      filter: brightness(120%);
    }
    &:hover:active {
      filter: brightness(90%);
    }
  }
  .header__button--minimize {
    box-shadow: inset 0 -1px 2px 1px #4646ff;
    background-image: radial-gradient(
      circle at 90% 90%,
      #0054e9 0%,
      #2263d5 55%,
      #4479e4 70%,
      #a3bbec 90%,
      white 100%
    );
    &:before {
      content: '';
      position: absolute;
      left: 4px;
      top: 13px;
      height: 3px;
      width: 8px;
      background-color: white;
    }
  }
  .header__button--maximize {
    box-shadow: inset 0 -1px 2px 1px #4646ff;
    background-image: radial-gradient(
      circle at 90% 90%,
      #0054e9 0%,
      #2263d5 55%,
      #4479e4 70%,
      #a3bbec 90%,
      white 100%
    );
    &:before {
      content: '';
      position: absolute;
      display: block;
      left: 4px;
      top: 4px;
      box-shadow: inset 0 3px white, inset 0 0 0 1px white;
      height: 12px;
      width: 12px;
    }
  }
  .header__button--maximized {
    box-shadow: inset 0 -1px 2px 1px #4646ff;
    background-image: radial-gradient(
      circle at 90% 90%,
      #0054e9 0%,
      #2263d5 55%,
      #4479e4 70%,
      #a3bbec 90%,
      white 100%
    );
    &:before {
      content: '';
      position: absolute;
      display: block;
      left: 7px;
      top: 4px;
      box-shadow: inset 0 2px white, inset 0 0 0 1px white;
      height: 8px;
      width: 8px;
    }
    &:after {
      content: '';
      position: absolute;
      display: block;
      left: 4px;
      top: 7px;
      box-shadow: inset 0 2px white, inset 0 0 0 1px white, 1px -1px #136dff;
      height: 8px;
      width: 8px;
      background-color: #136dff;
    }
  }
  .header__button--close {
    box-shadow: inset 0 -1px 2px 1px #da4600;
    background-image: radial-gradient(
      circle at 90% 90%,
      #cc4600 0%,
      #dc6527 55%,
      #cd7546 70%,
      #ffccb2 90%,
      white 100%
    );
    &:before {
      content: '';
      position: absolute;
      left: 9px;
      top: 2px;
      transform: rotate(45deg);
      height: 16px;
      width: 2px;
      background-color: white;
    }
    &:after {
      content: '';
      position: absolute;
      left: 9px;
      top: 2px;
      transform: rotate(-45deg);
      height: 16px;
      width: 2px;
      background-color: white;
    }
  }
  .header__button--disable {
    outline: none;
    opacity: 0.5;
    &:hover {
      filter: brightness(100%);
    }
  }
`;

function WindowBase({
  title,
  icon,
  children,
  className,
  onDoubleClickHeader,
  dragRef,
}) {
  return (
    <div className={className}>
      <div className="header__bg" />
      <header
        className="app__header"
        ref={dragRef}
        onDoubleClick={onDoubleClickHeader}
      >
        <div className="app__header__icon">
          {icon}
        </div>
        <div className="app__header__title">{title}</div>
        <HeaderButtons
          isFocus={true}
          maximized={false}
          resizable={false}
          onMinimize={() => {}}
          onMaximize={() => {}}
          onClose={() => {}}
        />
      </header>
      <div className="app__content">
        {children}
      </div>
    </div>
  );
}

export const WinXPWindow = styled(WindowBase)`
  display: flex;
  position: relative;
  padding: 3px;
  background-color: #0831d9;
  flex-direction: column;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 2px 4px 10px rgba(0,0,0,0.5);

  .header__bg {
    background: linear-gradient(to bottom,#0058ee 0%,#3593ff 4%,#288eff 6%,#127dff 8%,#036ffc 10%,#0262ee 14%,#0057e5 20%,#0054e3 24%,#0055eb 56%,#005bf5 66%,#026afe 76%,#0062ef 86%,#0052d6 92%,#0040ab 94%,#003092 100%);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 28px;
    pointer-events: none;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
  }
  .header__bg:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    opacity: 1;
    background: linear-gradient(to right, #1638e6 0%, transparent 100%);
    top: 0;
    bottom: 0;
    width: 15px;
  }
  .header__bg:after {
    content: '';
    opacity: 1;
    display: block;
    position: absolute;
    right: 0;
    background: linear-gradient(to left, #1638e6 0%, transparent 100%);
    top: 0;
    bottom: 0;
    width: 15px;
  }

  .app__header {
    display: flex;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    font-size: 12px;
    font-family: 'Noto Sans', sans-serif;
    text-shadow: 1px 1px #000;
    color: white;
    cursor: grab;
    position: absolute;
    left: 3px;
    right: 3px;
    align-items: center;
    &:active {
      cursor: grabbing;
    }
  }

  .app__header__icon {
    width: 15px;
    height: 15px;
    margin-left: 1px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .app__header__title {
    flex: 1;
    pointer-events: none;
    padding-right: 5px;
    letter-spacing: 0.5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .app__content {
    flex: 1;
    position: relative;
    margin-top: 25px;
    background-color: #ECE9D8; /* Classic WinXP inner window color */
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const WinXPTaskBarContainer = styled.footer`
  height: 30px;
  background: linear-gradient(
    to bottom,
    #1f2f86 0,
    #3165c4 3%,
    #3682e5 6%,
    #4490e6 10%,
    #3883e5 12%,
    #2b71e0 15%,
    #2663da 18%,
    #235bd6 20%,
    #2258d5 23%,
    #2157d6 38%,
    #245ddb 54%,
    #2562df 86%,
    #245fdc 89%,
    #2158d4 92%,
    #1d4ec0 95%,
    #1941a5 98%
  );
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  z-index: 50;

  .footer__items.left {
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .footer__items.right {
    background-color: #0b77e9;
    flex-shrink: 0;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      #0c59b9 1%,
      #139ee9 6%,
      #18b5f2 10%,
      #139beb 14%,
      #1290e8 19%,
      #0d8dea 63%,
      #0d9ff1 81%,
      #0f9eed 88%,
      #119be9 91%,
      #1392e2 94%,
      #137ed7 97%,
      #095bc9 100%
    );
    border-left: 1px solid #1042af;
    box-shadow: inset 1px 0 1px #18bbff;
    padding: 0 10px;
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
  
  .footer__start {
    height: 100%;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    &:hover {
      filter: brightness(105%);
    }
    &:active {
      filter: brightness(85%);
    }
  }

  .footer__window {
    flex: 1;
    max-width: 150px;
    color: #fff;
    border-radius: 2px;
    margin-top: 2px;
    padding: 0 8px;
    height: 22px;
    font-size: 11px;
    background-color: #3c81f3;
    box-shadow: inset -1px 0px rgba(0, 0, 0, 0.3),
      inset 1px 1px 1px rgba(255, 255, 255, 0.2);
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .footer__icon {
    height: 15px;
    width: 15px;
  }
  .footer__text {
    position: absolute;
    left: 27px;
    right: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer__window.focus {
    background-color: #1e52b7;
    box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.2),
      inset 1px 0 1px rgba(0, 0, 0, 0.7);
  }

  .footer__time {
    margin: 0 5px;
    color: #fff;
    font-size: 11px;
    font-weight: lighter;
    text-shadow: none;
    margin-left: 6px;
  }
`;
