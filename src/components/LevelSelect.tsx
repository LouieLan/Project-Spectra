import React, { useEffect } from 'react';
import { LEVELS } from '../levels';
import { sound } from '../audio';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  completedLevels: number[];
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onSelectLevel,
  onBack,
  completedLevels,
}) => {
  // ESC key to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playSelect();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#1B1B2F] text-[#F5F5F5] flex flex-col justify-between p-8 md:p-14 overflow-y-auto select-none font-sans">
      {/* Header */}
      <div className="flex justify-between items-center z-10 text-xs tracking-[0.25em] text-white/50 uppercase font-mono">
        <button
          id="btn-level-select-back"
          onClick={() => {
            sound.playSelect();
            onBack();
          }}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>KEMBALI KE MENU</span>
        </button>
        <div>PILIH LEVEL (1-{LEVELS.length})</div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8 z-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            PILIH TAHAPAN LEVEL
          </h2>
          <p className="text-xs md:text-sm tracking-wider text-white/60 mt-1 font-mono">
            {LEVELS.length} TAHAPAN PUZZLE-PLATFORMER DENGAN MEKANIK WARNA BERTINGKAT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LEVELS.map((level) => {
            const isCompleted = completedLevels.includes(level.id);

            return (
              <div
                key={level.id}
                id={`card-level-${level.id}`}
                onClick={() => {
                  sound.playSelect();
                  onSelectLevel(level.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isCompleted
                    ? 'bg-white/10 border-[#48D1CC]/40 hover:border-[#48D1CC] hover:shadow-[0_0_20px_rgba(72,209,204,0.2)]'
                    : 'bg-white/5 border-white/10 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                {/* Level Tag & Status */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#48D1CC]">
                    {level.stageLabel}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-[#2ECC71]" />
                  ) : (
                    <span className="text-[10px] font-mono text-white/40">
                      {level.items.length} Item
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#48D1CC] transition-colors mb-4">
                  {level.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
                  <span>Mulai Tantangan</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs font-mono text-white/30 text-center z-10">
        TEKAN ESC UNTUK KEMBALI
      </div>
    </div>
  );
};
