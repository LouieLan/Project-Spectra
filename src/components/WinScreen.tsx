import React, { useEffect } from 'react';
import { sound } from '../audio';
import { RotateCcw, Menu, Award, LogOut } from 'lucide-react';

interface WinScreenProps {
  playerName?: string;
  onReturnToMenu: () => void;
  onPlayAgain: () => void;
  onSwitchPlayer?: () => void;
}

export const WinScreen: React.FC<WinScreenProps> = ({
  playerName,
  onReturnToMenu,
  onPlayAgain,
  onSwitchPlayer,
}) => {
  useEffect(() => {
    sound.play('level_clear');
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#1B1B2F] text-[#F5F5F5] flex flex-col items-center justify-center p-8 overflow-hidden select-none">
      {/* Decorative RGB glows */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-[#E63946]/20 blur-[90px] -translate-x-32" />
        <div className="w-[500px] h-[500px] rounded-full bg-[#2ECC71]/20 blur-[90px] translate-x-32" />
        <div className="w-[500px] h-[500px] rounded-full bg-[#3498DB]/20 blur-[90px] translate-y-32" />
      </div>

      <div className="z-10 max-w-lg w-full text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(72,209,204,0.3)]">
          <Award className="w-8 h-8 text-[#48D1CC]" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-[#48D1CC]/15 border border-[#48D1CC]/30 text-xs font-mono tracking-widest text-[#48D1CC] mb-3">
          ALL STAGES COMPLETED
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3 uppercase">
          {playerName ? `Selamat, ${playerName}!` : 'Selamat, Semua Level Selesai!'}
        </h1>

        <p className="text-white/60 text-sm md:text-base font-light mb-8 max-w-md">
          {playerName
            ? `Kamu telah berhasil menguasai seluruh spektrum cahaya di seluruh level Spectra.`
            : 'Kamu telah berhasil menguasai pembagian dan penggabungan spektrum cahaya di seluruh level Spectra.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            id="btn_play_again"
            onClick={() => {
              sound.playSelect();
              onPlayAgain();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-[#1B1B2F] font-mono font-bold text-sm tracking-wider hover:bg-white/90 transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="btn_return_menu"
            onClick={() => {
              sound.playSelect();
              onReturnToMenu();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-mono font-bold text-sm tracking-wider hover:bg-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>

          {onSwitchPlayer && (
            <button
              id="btn_switch_player"
              onClick={() => {
                sound.playSelect();
                onSwitchPlayer();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/5 border border-white/15 text-white/80 font-mono font-bold text-sm tracking-wider hover:bg-white/15 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>GANTI PEMAIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
