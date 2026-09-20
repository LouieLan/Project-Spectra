import React, { useEffect } from 'react';
import { sound } from '../audio';
import { Play, RotateCcw, Grid, Sliders, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onLevelSelect,
  onSettings,
  onMainMenu,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playSelect();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-sm bg-[#1B1B2F] border border-white/20 rounded-2xl p-6 md:p-8 text-center shadow-2xl">
        <div className="text-[11px] font-mono font-bold tracking-widest text-[#48D1CC] uppercase">
          SPECTRUM CLONE
        </div>
        <h2 className="text-2xl font-black text-white mt-1 mb-6 uppercase">
          JEDA PERMAINAN
        </h2>

        <div className="space-y-2.5">
          <button
            id="btn-pause-resume"
            onClick={() => {
              sound.playSelect();
              onResume();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-white text-[#1B1B2F] font-bold text-xs tracking-wider uppercase hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Play size={15} />
            <span>LANJUTKAN [ESC]</span>
          </button>

          <button
            id="btn-pause-restart"
            onClick={() => {
              sound.playSelect();
              onRestart();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>RESET LEVEL [R]</span>
          </button>

          <button
            id="btn-pause-level-select"
            onClick={() => {
              sound.playSelect();
              onLevelSelect();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Grid size={15} />
            <span>PILIH LEVEL</span>
          </button>

          <button
            id="btn-pause-settings"
            onClick={() => {
              sound.playSelect();
              onSettings();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Sliders size={15} />
            <span>PENGATURAN</span>
          </button>

          <button
            id="btn-pause-main-menu"
            onClick={() => {
              sound.playSelect();
              onMainMenu();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Home size={15} />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
