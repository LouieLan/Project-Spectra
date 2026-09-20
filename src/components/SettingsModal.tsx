import React, { useEffect } from 'react';
import { GameSettings } from '../types';
import { sound } from '../audio';
import { X, Volume2, Sliders } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (updater: (prev: GameSettings) => GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playSelect();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleMasterChange = (val: number) => {
    onUpdateSettings((s) => ({ ...s, masterVolume: val }));
    sound.updateVolumes(val, settings.sfxVolume, 0);
  };

  const handleSfxChange = (val: number) => {
    onUpdateSettings((s) => ({ ...s, sfxVolume: val }));
    sound.updateVolumes(settings.masterVolume, val, 0);
    sound.playSelect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-md bg-[#1B1B2F] border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center space-x-2.5">
            <Sliders size={20} className="text-[#48D1CC]" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
              PENGATURAN
            </h2>
          </div>
          <button
            id="btn-settings-close-x"
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="space-y-5">
          <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#48D1CC] uppercase">
            <Volume2 size={15} />
            <span>PENGATURAN SUARA</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-white/80 mb-1.5">
                <span>VOLUME UTAMA</span>
                <span>{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                id="input-master-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleMasterChange(parseFloat(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-white/80 mb-1.5">
                <span>EFEK SUARA (SFX)</span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                id="input-sfx-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
                className="w-full accent-[#E63946] h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
