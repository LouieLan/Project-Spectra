import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LEVELS } from '../levels';
import { sound } from '../audio';
import { ArrowLeft, Check, Lock, Play, RotateCcw } from 'lucide-react';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  completedLevels: number[];
  onResetProgress?: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onSelectLevel,
  onBack,
  completedLevels,
  onResetProgress,
}) => {
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const totalLevels = LEVELS.length;
  const completedCount = completedLevels.filter((id) => id >= 1 && id <= totalLevels).length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  // Next active level to continue
  const nextActiveLevel = useMemo(() => {
    return (
      LEVELS.find(
        (lvl) =>
          (lvl.id === 1 || completedLevels.includes(lvl.id - 1)) &&
          !completedLevels.includes(lvl.id)
      ) || LEVELS[0]
    );
  }, [completedLevels]);

  const isLevelUnlocked = useCallback(
    (lvlId: number) => {
      if (lvlId === 1) return true;
      return completedLevels.includes(lvlId - 1);
    },
    [completedLevels]
  );

  const handleSelect = useCallback(
    (lvlId: number) => {
      if (!isLevelUnlocked(lvlId)) {
        sound.playLocked();
        setShakingId(lvlId);
        setLockedNotice(`Level ${lvlId} terkunci — selesaikan Level ${lvlId - 1} terlebih dahulu`);
        setTimeout(() => setShakingId(null), 500);
        return;
      }
      sound.playSelect();
      onSelectLevel(lvlId);
    },
    [isLevelUnlocked, onSelectLevel]
  );

  // Clear notice after 3s
  useEffect(() => {
    if (lockedNotice) {
      const t = setTimeout(() => setLockedNotice(null), 3000);
      return () => clearTimeout(t);
    }
  }, [lockedNotice]);

  // Keyboard navigation: Arrows, Enter, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResetConfirm) {
        if (e.key === 'Escape') {
          setShowResetConfirm(false);
          sound.playSelect();
        }
        return;
      }

      if (e.key === 'Escape') {
        sound.playSelect();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, showResetConfirm]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#08090C] text-[#F3F4F6] flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-y-auto select-none font-sans">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            id="btn-level-select-back"
            onClick={() => {
              sound.playSelect();
              onBack();
            }}
            className="flex items-center space-x-2 text-xs font-mono tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={14} />
            <span>KEMBALI KE MENU</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs font-mono text-white/70">
                PROGRES: <strong className="text-white">{completedCount}</strong>/{totalLevels} SELESAI
              </span>
            </div>
            {onResetProgress && completedCount > 0 && (
              <button
                id="btn-level-select-reset-progress"
                onClick={() => {
                  sound.playSelect();
                  setShowResetConfirm(true);
                }}
                className="text-[11px] font-mono text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                title="Reset progres permainan"
              >
                Reset
              </button>
            )}
          </div>
        </header>

        {/* Minimal Hairline Progress Bar */}
        <div className="w-full h-1 bg-white/10 mt-2 mb-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Title & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white uppercase font-serif-display">
              PILIH TAHAPAN LEVEL
            </h1>
            <p className="text-xs font-mono text-white/40 mt-1">
              Selesaikan level sebelumnya untuk membuka tahapan berikutnya
            </p>
          </div>

          {/* Quick Continue Button */}
          {nextActiveLevel && isLevelUnlocked(nextActiveLevel.id) && (
            <button
              id="btn-quick-play-next"
              onClick={() => handleSelect(nextActiveLevel.id)}
              className="flex items-center space-x-2.5 px-4 py-2 rounded-lg bg-white text-[#08090C] hover:bg-white/90 text-xs font-mono font-medium tracking-wider uppercase transition-all cursor-pointer w-fit shadow-sm"
            >
              <Play size={12} className="fill-current" />
              <span>
                LANJUTKAN: LV {nextActiveLevel.id} • {nextActiveLevel.title}
              </span>
            </button>
          )}
        </div>

        {/* Locked Notice Alert */}
        {lockedNotice && (
          <div className="mb-6 py-2 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-mono flex items-center space-x-2 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>{lockedNotice}</span>
          </div>
        )}

        {/* Minimalist 15-Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {LEVELS.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = isLevelUnlocked(level.id);
            const isActive = isUnlocked && !isCompleted;
            const isFinale = level.id === 15;
            const isShaking = shakingId === level.id;

            return (
              <button
                key={level.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(level.id, el);
                  else cardRefs.current.delete(level.id);
                }}
                id={`card-level-${level.id}`}
                onClick={() => handleSelect(level.id)}
                onMouseEnter={() => {
                  if (isUnlocked) sound.playHover();
                }}
                disabled={false}
                className={`relative text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between h-28 focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer ${
                  isShaking ? 'animate-bounce border-red-400' : ''
                } ${
                  isActive
                    ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.06)]'
                    : isCompleted
                    ? 'bg-white/[0.04] border-white/15 text-white/90 hover:bg-white/[0.08] hover:border-white/30'
                    : 'bg-transparent border-white/5 text-white/30 cursor-not-allowed hover:border-white/10'
                }`}
              >
                {/* Top Row: Number & Status Indicator */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono tracking-wider ${
                      isActive ? 'text-white font-bold' : isCompleted ? 'text-white/70' : 'text-white/30'
                    }`}
                  >
                    {String(level.id).padStart(2, '0')}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center text-emerald-400" title="Selesai">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                  ) : isActive ? (
                    <span className="flex h-2 w-2 relative" title="Aktif">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  ) : (
                    <Lock size={12} className="text-white/20" />
                  )}
                </div>

                {/* Level Title */}
                <div className="my-auto pr-1">
                  <div
                    className={`text-sm leading-snug font-medium line-clamp-1 ${
                      isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/30'
                    }`}
                  >
                    {level.title}
                  </div>
                  {isFinale && (
                    <span className="text-[9px] font-mono tracking-widest text-amber-300/80 uppercase block mt-0.5">
                      FINALE
                    </span>
                  )}
                </div>

                {/* Bottom Row: State text */}
                <div className="text-[10px] font-mono">
                  {isActive ? (
                    <span className="text-white font-medium">Mulai Main →</span>
                  ) : isCompleted ? (
                    <span className="text-white/40">Ulangi</span>
                  ) : (
                    <span className="text-white/20">Butuh Lv {level.id - 1}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-8 pb-2 text-xs font-mono text-white/30 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/5 mt-8">
        <span>TEKAN ESC UNTUK KEMBALI</span>
        <span className="text-[11px] text-white/30">
          Selesaikan tiap level untuk membuka level berikutnya
        </span>
      </footer>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121318] border border-white/15 p-6 max-w-sm w-full text-center rounded-xl shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 mx-auto flex items-center justify-center mb-3">
              <RotateCcw size={16} />
            </div>
            <h2 className="text-base font-medium text-white mb-1.5 uppercase font-serif-display">
              Reset Seluruh Progres?
            </h2>
            <p className="font-mono text-xs text-white/50 mb-5 leading-relaxed">
              Seluruh riwayat level yang selesai akan dihapus. Hanya Level 1 yang akan terbuka.
            </p>
            <div className="flex justify-center space-x-3 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playSelect();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-white/60 hover:text-white border border-white/10 rounded-lg cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onResetProgress) onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-white text-[#08090C] font-semibold rounded-lg hover:bg-white/90 cursor-pointer transition-colors"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
