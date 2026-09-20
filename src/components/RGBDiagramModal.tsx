import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { CHARACTER_SPECS, SpectralColor } from '../types';

interface RGBDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RGBDiagramModal: React.FC<RGBDiagramModalProps> = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState<SpectralColor>('white');

  if (!isOpen) return null;

  const currentSpec = CHARACTER_SPECS[selectedColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#1B1B2F] border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#48D1CC]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wide text-white">
                DIAGRAM SPEKTRUM CAHAYA (RGB)
              </h2>
              <p className="text-xs text-white/50 font-mono">
                Sistem Pengurangan Warna & Transformasi Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 overflow-y-auto pr-1">
          {/* Left Column: The RGB Additive Mixing Visual */}
          <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl p-4 border border-white/10">
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
              {/* SVG Additive Color Mixing Diagram */}
              <svg viewBox="0 0 300 300" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <defs>
                  {/* Screen blend mode enables true additive light mixing */}
                  <filter id="additive-glow">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background circle area */}
                <rect width="300" height="300" fill="#0c0c16" rx="16" />

                {/* The 3 Venn Light Circles with Screen Blending (Matching user's image) */}
                <g style={{ mixBlendMode: 'screen' }}>
                  {/* Top Circle: Green (0, 255, 0) */}
                  <circle
                    cx="150"
                    cy="110"
                    r="68"
                    fill="#00FF00"
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedColor('green')}
                  />
                  {/* Bottom-Left Circle: Blue (0, 0, 255) */}
                  <circle
                    cx="108"
                    cy="185"
                    r="68"
                    fill="#0000FF"
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedColor('blue')}
                  />
                  {/* Bottom-Right Circle: Red (255, 0, 0) */}
                  <circle
                    cx="192"
                    cy="185"
                    r="68"
                    fill="#FF0000"
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedColor('red')}
                  />
                </g>

                {/* Overlap Clickable Hotspots / Labels */}
                {/* Green */}
                <text x="150" y="80" textAnchor="middle" fill="#1B1B2F" fontSize="12" fontWeight="bold" fontFamily="monospace">G</text>
                {/* Blue */}
                <text x="85" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">B</text>
                {/* Red */}
                <text x="215" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">R</text>

                {/* Cyan (G+B) */}
                <text x="112" y="142" textAnchor="middle" fill="#1B1B2F" fontSize="11" fontWeight="bold" fontFamily="monospace">CYAN</text>
                {/* Yellow (R+G) */}
                <text x="188" y="142" textAnchor="middle" fill="#1B1B2F" fontSize="11" fontWeight="bold" fontFamily="monospace">YEL</text>
                {/* Magenta (R+B) */}
                <text x="150" y="215" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">MAG</text>

                {/* Center White (R+G+B) */}
                <circle
                  cx="150"
                  cy="160"
                  r="20"
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setSelectedColor('white')}
                />
                <text x="150" y="164" textAnchor="middle" fill="#1B1B2F" fontSize="11" fontWeight="900" fontFamily="monospace">RGB</text>
              </svg>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {(['white', 'cyan', 'yellow', 'magenta', 'red', 'green', 'blue'] as SpectralColor[]).map((col) => {
                const spec = CHARACTER_SPECS[col];
                const isSelected = selectedColor === col;
                return (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className="px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all border"
                    style={{
                      backgroundColor: isSelected ? spec.hex : `${spec.hex}22`,
                      borderColor: spec.hex,
                      color: isSelected && (col === 'white' || col === 'yellow' || col === 'cyan') ? '#1B1B2F' : isSelected ? '#FFFFFF' : spec.hex,
                      boxShadow: isSelected ? `0 0 10px ${spec.hex}` : 'none',
                    }}
                  >
                    {spec.name.replace('Chr_', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Portal Transition Rules for Selected Color */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-7 h-7 rounded-md border"
                    style={{
                      backgroundColor: currentSpec.hex,
                      borderColor: currentSpec.outline || currentSpec.hex,
                    }}
                  />
                  <div>
                    <div className="text-white font-mono font-bold text-sm">
                      {currentSpec.name} ({currentSpec.labelId})
                    </div>
                    <div className="text-[11px] text-white/50 font-mono">
                      Komponen: {currentSpec.hasR ? '🔴 R ' : ''}{currentSpec.hasG ? '🟢 G ' : ''}{currentSpec.hasB ? '🔵 B ' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transition Outcome when entering each Portal */}
              <div className="space-y-2 font-mono text-xs">
                {/* Portal Merah (-R) */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#E63946]/15 border border-[#E63946]/30">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                    <span className="text-[#E63946] font-bold">Portal Merah (-R)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/90">
                    {currentSpec.hasR && (currentSpec.hasG || currentSpec.hasB) ? (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-[#E63946]" />
                        <span className="font-bold text-[#48D1CC]">
                          {selectedColor === 'white' ? 'Chr_Cyan' : selectedColor === 'yellow' ? 'Chr_Hijau' : 'Chr_Biru'}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded text-[10px]">
                        🚫 DIBLOKIR
                      </span>
                    )}
                  </div>
                </div>

                {/* Portal Hijau (-G) */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#2ECC71]/15 border border-[#2ECC71]/30">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]" />
                    <span className="text-[#2ECC71] font-bold">Portal Hijau (-G)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/90">
                    {currentSpec.hasG && (currentSpec.hasR || currentSpec.hasB) ? (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-[#2ECC71]" />
                        <span className="font-bold text-[#C147E9]">
                          {selectedColor === 'white' ? 'Chr_Magenta' : selectedColor === 'yellow' ? 'Chr_Merah' : 'Chr_Biru'}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded text-[10px]">
                        🚫 DIBLOKIR
                      </span>
                    )}
                  </div>
                </div>

                {/* Portal Biru (-B) */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#3498DB]/15 border border-[#3498DB]/30">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3498DB]" />
                    <span className="text-[#3498DB] font-bold">Portal Biru (-B)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/90">
                    {currentSpec.hasB && (currentSpec.hasR || currentSpec.hasG) ? (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-[#3498DB]" />
                        <span className="font-bold text-[#F4D03F]">
                          {selectedColor === 'white' ? 'Chr_Kuning' : selectedColor === 'magenta' ? 'Chr_Merah' : 'Chr_Hijau'}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded text-[10px]">
                        🚫 DIBLOKIR
                      </span>
                    )}
                  </div>
                </div>

                {/* Portal Prisma (Reset to White) */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                    <span className="text-white font-bold">Portal Prisma</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/90">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                    <span className="font-bold text-white">Chr_Putih (RGB)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Game Rule Note */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start space-x-2 text-[11px] text-white/70 font-mono">
              <AlertCircle className="w-4 h-4 text-[#48D1CC] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Aturan Pengambilan Item (Itm_Kotak):</strong>
                <p className="mt-0.5">
                  Item hanya dapat dikoleksi jika warna karakter Anda sama persis dengan warna item tersebut. Lewati portal untuk mengubah warna karakter Anda!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/40">
          <span>ADDITIVE RGB COLOR SYSTEM</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
