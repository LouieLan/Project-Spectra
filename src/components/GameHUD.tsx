import React, { useState, useEffect } from 'react';
import { LevelData, SpectralColor, ActiveCharacter } from '../types';
import { input } from '../input';
import { RotateCcw, Menu, Volume2, VolumeX, Gamepad2 } from 'lucide-react';

interface GameHUDProps {
  level: LevelData;
  playerName?: string;
  activeColor?: SpectralColor;
  characters?: ActiveCharacter[];
  collectedItemIds: string[];
  onRestart: () => void;
  onOpenMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  playerName,
  collectedItemIds,
  onRestart,
  onOpenMenu,
  isMuted,
  onToggleMute,
}) => {
  const [gamepadName, setGamepadName] = useState<string | null>(
    () => input.getGamepadStatus().name
  );

  useEffect(() => {
    return input.subscribeGamepad((status) => {
      setGamepadName(status.connected ? status.name : null);
    });
  }, []);

  const collectedCount = collectedItemIds.length;
  const totalItems = level.items.length;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none font-sans z-30">
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full">
        {/* Top Left: Clean Item Counter */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <div
            id="UI_TeksItem"
            className="flex items-center space-x-2.5 bg-[#070709]/85 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-lg shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <span className="text-white/90 font-mono text-xs md:text-sm tracking-widest uppercase">
              ITEM {collectedCount}/{totalItems}
            </span>
          </div>

          {gamepadName && (
            <div
              className="hidden sm:flex items-center space-x-1.5 bg-[#070709]/85 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-[#48D1CC] font-mono text-xs shadow-md"
              title={`Stik terhubung: ${gamepadName}`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="max-w-[110px] truncate">Stik Aktif</span>
            </div>
          )}
        </div>

        {/* Top Right: Level & Action Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Level Indicator */}
          <div
            id="UI_TeksLevel"
            className="bg-[#070709]/85 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-lg text-white/90 font-mono text-xs md:text-sm tracking-widest uppercase shadow-md max-w-[240px] truncate"
          >
            {playerName ? `${playerName} · LEVEL ${level.id}` : `LEVEL ${level.id}`}
          </div>

          {/* Reset Button */}
          <button
            id="btn-hud-restart"
            onClick={onRestart}
            className="p-2 rounded-lg bg-[#070709]/80 hover:bg-[#1A1A24] text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-md"
            title="Reset Level (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            id="btn-hud-audio"
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-[#070709]/80 hover:bg-[#1A1A24] text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>

          {/* Menu Button */}
          <button
            id="btn-hud-menu"
            onClick={onOpenMenu}
            className="p-2 rounded-lg bg-[#070709]/80 hover:bg-[#1A1A24] text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-md"
            title="Menu Utama"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
