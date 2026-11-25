import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile } from '../types';
import { LEVELS } from '../levels';
import { sound } from '../audio';
import { normalizePlayerName } from '../playerStorage';
import { ArrowRight, Trash2, UserPlus, Users } from 'lucide-react';

interface PlayerSelectScreenProps {
  profiles: PlayerProfile[];
  onSubmitName: (name: string) => void;
  onSelectProfile: (playerId: string) => void;
  onDeleteProfile: (playerId: string) => void;
}

export const PlayerSelectScreen: React.FC<PlayerSelectScreenProps> = ({
  profiles,
  onSubmitName,
  onSelectProfile,
  onDeleteProfile,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalLevels = LEVELS.length;
  const normalizedTyped = normalizePlayerName(nameInput);
  const matchingProfile = normalizedTyped
    ? profiles.find((p) => p.name.toLowerCase() === normalizedTyped.toLowerCase())
    : undefined;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedTyped) {
      sound.playLocked();
      setError('Silakan masukkan nama pemain terlebih dahulu.');
      inputRef.current?.focus();
      return;
    }
    if (normalizedTyped.length < 2) {
      sound.playLocked();
      setError('Nama pemain minimal 2 karakter.');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    sound.playSelect();
    onSubmitName(normalizedTyped);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#070709] text-[#F8FAFC] flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-10 overflow-y-auto select-none font-sans">
      {/* Subtle atmospheric glow matching MainMenu */}
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_at_80%_35%,rgba(35,45,65,0.18)_0%,rgba(7,7,9,0.96)_72%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle right-side chromatic lens backdrop */}
      <div
        className="fixed right-[-8%] md:right-[2%] top-[10%] w-[360px] sm:w-[480px] md:w-[620px] aspect-square pointer-events-none opacity-45"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute top-[8%] left-[28%] w-[58%] h-[58%] rounded-full opacity-55 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(46, 160, 67, 0.65) 0%, rgba(35, 134, 54, 0.35) 55%, transparent 85%)',
            }}
          />
          <div
            className="absolute top-[22%] left-[8%] w-[58%] h-[58%] rounded-full opacity-55 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(200, 38, 55, 0.65) 0%, rgba(160, 24, 40, 0.35) 55%, transparent 85%)',
            }}
          />
          <div
            className="absolute top-[22%] right-[8%] w-[58%] h-[58%] rounded-full opacity-55 mix-blend-screen blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(30, 95, 210, 0.65) 0%, rgba(20, 75, 175, 0.35) 55%, transparent 85%)',
            }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-4xl w-full mx-auto">
        {/* Brand Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-serif-display font-normal text-5xl sm:text-6xl md:text-7xl tracking-[0.06em] text-white leading-none mb-3">
            SPECTRA
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Satu perangkat untuk banyak pemain. Masukkan nama untuk menyimpan atau melanjutkan progres level kamu sendiri.
          </p>
        </div>

        {/* Two-column responsive layout when profiles exist, balanced single column otherwise */}
        <div
          className={`grid gap-8 sm:gap-12 items-start ${
            profiles.length > 0 ? 'lg:grid-cols-12' : 'max-w-md'
          }`}
        >
          {/* Left Column: Name Input Form */}
          <section
            aria-label="Input nama pemain"
            className={profiles.length > 0 ? 'lg:col-span-5' : 'w-full'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="input-player-name"
                  className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-300 mb-2"
                >
                  <UserPlus size={14} className="text-slate-400" />
                  <span>Nama Pemain</span>
                </label>

                <input
                  ref={inputRef}
                  id="input-player-name"
                  type="text"
                  value={nameInput}
                  maxLength={24}
                  autoComplete="off"
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ketik nama kamu..."
                  className="w-full h-12 px-4 rounded-lg bg-[#10121A] border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors"
                />

                {/* Inline feedback: error or existing profile detection */}
                {error && (
                  <p role="alert" className="mt-2 text-xs text-rose-400 font-mono">
                    {error}
                  </p>
                )}

                {!error && matchingProfile && (
                  <p className="mt-2 text-xs text-[#48D1CC] font-mono tabular-nums">
                    Profil ditemukan · {matchingProfile.completedLevels.length}/{totalLevels} level selesai akan dilanjutkan
                  </p>
                )}
              </div>

              <button
                id="btn-player-enter"
                type="submit"
                className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-white text-[#070709] font-mono text-xs font-bold tracking-[0.18em] uppercase hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#070709] transition-colors cursor-pointer"
              >
                <span>{matchingProfile ? 'Lanjutkan Progres' : 'Mulai Bermain'}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </section>

          {/* Right Column: Saved Player Profiles on this Device */}
          {profiles.length > 0 && (
            <section
              aria-label="Daftar pemain tersimpan"
              className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-300">
                  <Users size={14} className="text-slate-400" />
                  <span>Pemain Tersimpan ({profiles.length})</span>
                </h2>
                <span className="text-xs text-slate-500">Pilih untuk masuk</span>
              </div>

              <div className="divide-y divide-white/10 border-t border-b border-white/10 max-h-[320px] overflow-y-auto">
                {profiles.map((profile) => {
                  const completedCount = profile.completedLevels.filter(
                    (id) => id >= 1 && id <= totalLevels
                  ).length;
                  const nextLevel = Math.min(totalLevels, completedCount + 1);
                  const isAllDone = completedCount >= totalLevels;
                  const isConfirmingDelete = confirmDeleteId === profile.id;

                  return (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between gap-3 py-3 group"
                    >
                      <button
                        id={`btn-select-profile-${profile.id}`}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          onSelectProfile(profile.id);
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className="flex-1 min-w-0 text-left py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm sm:text-base font-medium text-white truncate">
                            {profile.name}
                          </span>
                          <span className="text-xs font-mono text-slate-400 group-hover:text-white transition-colors shrink-0 whitespace-nowrap">
                            Masuk →
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5 tabular-nums">
                          <span>
                            {completedCount}/{totalLevels} selesai
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {isAllDone ? 'Tamat' : `Level aktif ${nextLevel}`}
                          </span>
                        </div>
                      </button>

                      {/* Delete Profile Action */}
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              onDeleteProfile(profile.id);
                              setConfirmDeleteId(null);
                            }}
                            className="min-h-[36px] px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono cursor-pointer transition-colors"
                          >
                            Hapus
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playSelect();
                              setConfirmDeleteId(null);
                            }}
                            className="min-h-[36px] px-2 py-1 rounded text-slate-400 hover:text-white text-xs font-mono cursor-pointer transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playSelect();
                            setConfirmDeleteId(profile.id);
                          }}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 transition-colors cursor-pointer shrink-0"
                          title={`Hapus profil ${profile.name}`}
                          aria-label={`Hapus profil ${profile.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
