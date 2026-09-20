import React from 'react';
import { sound } from '../audio';
import { ArrowRight, RotateCcw, Grid } from 'lucide-react';

interface StageClearModalProps {
  stageLabel: string;
  stageTitle: string;
  isLastStage: boolean;
  onNextStage: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stageLabel,
  stageTitle,
  isLastStage,
  onNextStage,
  onReplay,
  onLevelSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-md bg-[#1B1B2F] border border-white/20 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        {/* Spectral glow dots */}
        <div className="flex justify-center items-center space-x-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-[#E63946] shadow-[0_0_10px_#E63946]" />
          <span className="w-3 h-3 rounded-full bg-[#2ECC71] shadow-[0_0_10px_#2ECC71]" />
          <span className="w-3 h-3 rounded-full bg-[#3498DB] shadow-[0_0_10px_#3498DB]" />
        </div>

        <div className="text-xs font-mono font-bold tracking-widest text-[#48D1CC] uppercase">
          {stageLabel} SELESAI
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mt-1 mb-2 uppercase">
          {stageTitle}
        </h2>

        <p className="text-xs font-mono text-white/60 uppercase mb-6 tracking-wide">
          Seluruh item berhasil dikumpulkan & Zona Finish tercapai!
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isLastStage ? (
            <button
              id="btn-stage-clear-next"
              onClick={() => {
                sound.playSelect();
                onNextStage();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg bg-white text-[#1B1B2F] font-bold text-xs tracking-wider uppercase hover:bg-white/90 transition-all cursor-pointer shadow-md"
            >
              <span>LEVEL BERIKUTNYA</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              id="btn-stage-clear-finish"
              onClick={() => {
                sound.playSelect();
                onNextStage();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg bg-[#48D1CC] text-[#1B1B2F] font-bold text-xs tracking-wider uppercase hover:bg-[#48D1CC]/90 transition-all cursor-pointer shadow-md"
            >
              <span>LIHAT HASIL AKHIR</span>
              <ArrowRight size={16} />
            </button>
          )}

          <button
            id="btn-stage-clear-replay"
            onClick={() => {
              sound.playSelect();
              onReplay();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-white/5 border border-white/15 text-white font-medium text-xs tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>ULANGI LEVEL INI</span>
          </button>

          <button
            id="btn-stage-clear-level-select"
            onClick={() => {
              sound.playSelect();
              onLevelSelect();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-white/5 border border-white/15 text-white/70 font-medium text-xs tracking-wider uppercase hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Grid size={15} />
            <span>PILIH LEVEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
