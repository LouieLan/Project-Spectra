import React, { useState, useEffect } from 'react';
import { sound } from '../audio';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenRGBDiagram: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const menuItems = [
    { label: 'PLAY', action: onStartGame },
    { label: 'LEVEL SELECT', action: onOpenLevelSelect },
    { label: 'SETTINGS', action: onOpenSettings },
    {
      label: 'QUIT',
      action: () => {
        setShowQuitConfirm(true);
      },
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showQuitConfirm) {
        if (e.key === 'Escape') {
          setShowQuitConfirm(false);
          sound.playSelect();
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + menuItems.length) % menuItems.length;
          sound.playHover();
          return next;
        });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % menuItems.length;
          sound.playHover();
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sound.playSelect();
        menuItems[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, showQuitConfirm, menuItems]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#070709] text-white flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28 py-10 overflow-hidden select-none font-sans">
      {/* Background subtle noise and atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_35%,rgba(35,45,65,0.18)_0%,rgba(7,7,9,0.95)_70%)] pointer-events-none" />

      {/* RIGHT SIDE: CHROMATIC VENN DIAGRAM (RED, GREEN, BLUE OPTICAL LENSES) */}
      <div
        className="absolute right-[-4%] md:right-[2%] top-[8%] md:top-[12%] w-[420px] sm:w-[540px] md:w-[680px] lg:w-[780px] aspect-square pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          {/* Green Lens (Top) */}
          <div
            className="absolute top-[8%] left-[28%] w-[58%] h-[58%] rounded-full opacity-65 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(46, 160, 67, 0.75) 0%, rgba(35, 134, 54, 0.45) 55%, rgba(18, 70, 30, 0.05) 85%, transparent 100%)',
            }}
          />

          {/* Red Lens (Left) */}
          <div
            className="absolute top-[22%] left-[8%] w-[58%] h-[58%] rounded-full opacity-65 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(200, 38, 55, 0.75) 0%, rgba(160, 24, 40, 0.45) 55%, rgba(90, 10, 20, 0.05) 85%, transparent 100%)',
            }}
          />

          {/* Blue Lens (Right / Bottom) */}
          <div
            className="absolute top-[22%] right-[8%] w-[58%] h-[58%] rounded-full opacity-65 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(30, 95, 210, 0.75) 0%, rgba(20, 75, 175, 0.45) 55%, rgba(10, 35, 95, 0.05) 85%, transparent 100%)',
            }}
          />

          {/* Center Luminous Spectral Fusion Overlay */}
          <div
            className="absolute top-[28%] left-[28%] w-[44%] h-[44%] rounded-full opacity-40 mix-blend-screen blur-[14px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(72, 209, 204, 0.4) 45%, transparent 75%)',
            }}
          />
        </div>
      </div>

      {/* CENTER-LEFT: TITLE & MENU NAVIGATION */}
      <main className="relative z-20 max-w-2xl pl-2 md:pl-6">
        {/* Main Title: SPECTRA in high-contrast serif display */}
        <h1 className="font-serif-display font-normal text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] text-white leading-none mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)]">
          SPECTRA
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.26em] text-[#8C8C96] uppercase mb-5 sm:mb-7">
          A STUDY IN CHROMATIC DIVISION AND RETURN
        </p>

        {/* Hairline Divider */}
        <div className="w-full max-w-[420px] h-[1px] bg-white/20 mb-8 sm:mb-10" />

        {/* Menu Navigation List */}
        <nav className="flex flex-col space-y-4 sm:space-y-5" aria-label="Main Navigation">
          {menuItems.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={item.label}
                id={`btn-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  sound.playSelect();
                  item.action();
                }}
                onMouseEnter={() => {
                  if (selectedIndex !== idx) {
                    setSelectedIndex(idx);
                    sound.playHover();
                  }
                }}
                className="group flex items-center text-left cursor-pointer transition-all duration-150 focus:outline-none"
              >
                {/* 3 Chromatic Dots (Red, Green, Blue) */}
                <div
                  className={`flex items-center space-x-1.5 mr-3 sm:mr-4 transition-opacity duration-150 ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_rgba(255,59,48,0.7)]" />
                  <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_6px_rgba(52,199,89,0.7)]" />
                  <span className="w-2 h-2 rounded-full bg-[#007AFF] shadow-[0_0_6px_rgba(0,122,255,0.7)]" />
                </div>

                {/* Label text with underline when selected */}
                <span
                  className={`font-mono text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase transition-colors duration-150 ${
                    isSelected
                      ? 'text-white border-b border-white pb-0.5'
                      : 'text-[#6B6B76] group-hover:text-[#A0A0AA]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </main>

      {/* Minimalist Quit Confirmation Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0D0D12] border border-white/20 p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="font-serif-display text-2xl text-white tracking-wider mb-2">
              QUIT SPECTRA
            </h3>
            <p className="font-mono text-xs text-[#8A8A96] tracking-[0.15em] mb-6">
              ARE YOU SURE YOU WANT TO QUIT?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                id="btn-quit-cancel"
                onClick={() => {
                  sound.playSelect();
                  setShowQuitConfirm(false);
                }}
                className="font-mono text-xs tracking-[0.2em] px-4 py-2 text-[#8A8A96] hover:text-white border border-white/10 hover:border-white/30 transition-colors uppercase"
              >
                CANCEL
              </button>
              <button
                id="btn-quit-confirm"
                onClick={() => {
                  sound.playSelect();
                  setShowQuitConfirm(false);
                  window.location.reload();
                }}
                className="font-mono text-xs tracking-[0.2em] px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-colors uppercase"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
