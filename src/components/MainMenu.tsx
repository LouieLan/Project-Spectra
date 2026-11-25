import React, { useState, useEffect } from 'react';
import { sound } from '../audio';
import { LEVELS } from '../levels';

interface MainMenuProps {
  playerName: string;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenRGBDiagram: () => void;
  onSwitchPlayer: () => void;
  completedLevels?: number[];
}

export const MainMenu: React.FC<MainMenuProps> = ({
  playerName,
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
  onSwitchPlayer,
  completedLevels = [],
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const completedCount = completedLevels.filter((id) => id >= 1 && id <= LEVELS.length).length;
  const nextTargetLevel = LEVELS.find(
    (lvl) => (lvl.id === 1 || completedLevels.includes(lvl.id - 1)) && !completedLevels.includes(lvl.id)
  );

  const playLabel =
    completedCount === 0
      ? 'PLAY'
      : completedCount >= LEVELS.length
      ? 'PLAY AGAIN'
      : `CONTINUE (LVL ${nextTargetLevel?.id || 1})`;

  const menuItems = [
    { label: playLabel, action: onStartGame },
    { label: 'LEVEL SELECT', action: onOpenLevelSelect },
    { label: 'SETTINGS', action: onOpenSettings },
    { label: 'KELUAR / GANTI PEMAIN', action: onSwitchPlayer },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [selectedIndex, menuItems]);

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

        {/* Subtitle & Active Player Metadata */}
        <p className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.26em] text-[#8C8C96] uppercase mb-3">
          A STUDY IN CHROMATIC DIVISION AND RETURN
        </p>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-300 mb-5 sm:mb-7 tabular-nums">
          <span>
            Pemain: <strong className="text-white font-semibold">{playerName}</strong>
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-400">
            {completedCount}/{LEVELS.length} level selesai
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <button
            id="btn-menu-inline-switch-player"
            type="button"
            onClick={() => {
              sound.playSelect();
              onSwitchPlayer();
            }}
            className="text-slate-300 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Keluar
          </button>
        </div>

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

    </div>
  );
};
