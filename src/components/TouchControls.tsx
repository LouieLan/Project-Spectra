import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { input } from '../input';

interface TouchControlsProps {
  visible: boolean;
  onReset?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  visible,
  onReset,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-x-0 bottom-8 px-6 pointer-events-none flex justify-between items-end z-30 select-none md:hidden">
      {/* Directional buttons (Left & Right) */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <button
          id="btn-touch-left"
          onTouchStart={(e) => {
            e.preventDefault();
            input.setLeft(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            input.setLeft(false);
          }}
          onMouseDown={() => input.setLeft(true)}
          onMouseUp={() => input.setLeft(false)}
          onMouseLeave={() => input.setLeft(false)}
          className="w-14 h-14 rounded-full bg-[#1B1B2F]/85 border border-white/30 active:bg-white/30 backdrop-blur-md flex items-center justify-center text-white/90 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Gerak Kiri"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          id="btn-touch-right"
          onTouchStart={(e) => {
            e.preventDefault();
            input.setRight(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            input.setRight(false);
          }}
          onMouseDown={() => input.setRight(true)}
          onMouseUp={() => input.setRight(false)}
          onMouseLeave={() => input.setRight(false)}
          className="w-14 h-14 rounded-full bg-[#1B1B2F]/85 border border-white/30 active:bg-white/30 backdrop-blur-md flex items-center justify-center text-white/90 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Gerak Kanan"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Action buttons (Reset & Instant Jump) */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        {onReset && (
          <button
            id="btn-touch-reset"
            onClick={onReset}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 active:bg-white/25 backdrop-blur-md flex flex-col items-center justify-center text-white/70 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Reset (R)"
          >
            <RotateCcw size={18} />
            <span className="text-[8px] font-mono font-bold mt-0.5">R</span>
          </button>
        )}

        <button
          id="btn-touch-jump"
          onTouchStart={(e) => {
            e.preventDefault();
            input.triggerJump();
          }}
          onClick={() => input.triggerJump()}
          onMouseDown={() => input.triggerJump()}
          className="w-16 h-16 rounded-full bg-[#E63946]/40 border border-[#E63946]/80 active:bg-[#E63946]/70 backdrop-blur-md flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-xl cursor-pointer"
          title="Lompat (Spasi)"
        >
          <ArrowUp size={28} className="text-white" />
          <span className="text-[9px] font-mono text-white font-black">LOMPAT</span>
        </button>
      </div>
    </div>
  );
};

