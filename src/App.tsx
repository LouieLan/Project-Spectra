import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameSettings, LevelData, ScreenType, SpectralColor, ActiveCharacter, PlayerProfile } from './types';
import { LEVELS } from './levels';
import { sound } from './audio';
import { input } from './input';
import {
  loadProfiles,
  loadActivePlayerId,
  saveActivePlayerId,
  loginOrCreateProfile,
  selectExistingProfile,
  markPlayerLevelCompleted,
  resetPlayerProfileProgress,
  deletePlayerProfile,
} from './playerStorage';
import { PlayerSelectScreen } from './components/PlayerSelectScreen';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { CanvasRenderer } from './components/CanvasRenderer';
import { GameHUD } from './components/GameHUD';
import { PauseModal } from './components/PauseModal';
import { StageClearModal } from './components/StageClearModal';
import { SettingsModal } from './components/SettingsModal';
import { TouchControls } from './components/TouchControls';
import { WinScreen } from './components/WinScreen';
import { RGBDiagramModal } from './components/RGBDiagramModal';

export default function App() {
  // Multi-player local profiles persisted in localStorage
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => loadProfiles());
  const [activePlayerId, setActivePlayerId] = useState<string | null>(() => {
    const savedId = loadActivePlayerId();
    const list = loadProfiles();
    return savedId && list.some((p) => p.id === savedId) ? savedId : null;
  });

  const activePlayer = useMemo(
    () => profiles.find((p) => p.id === activePlayerId) || null,
    [profiles, activePlayerId]
  );

  const completedLevels = useMemo(
    () => (activePlayer ? activePlayer.completedLevels : []),
    [activePlayer]
  );

  const [screen, setScreen] = useState<ScreenType>(() =>
    activePlayer ? 'menu' : 'player_select'
  );
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStageClear, setIsStageClear] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showRGBModal, setShowRGBModal] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  // Active Spectral Character Color (Chr_Putih, Chr_Merah, etc.)
  const [activeColor, setActiveColor] = useState<SpectralColor>('white');
  // Multi-character list for color split mechanics
  const [characters, setCharacters] = useState<ActiveCharacter[]>([]);
  // Collected Item IDs for current level
  const [collectedItemIds, setCollectedItemIds] = useState<string[]>([]);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    masterVolume: 0.8,
    sfxVolume: 0.8,
    musicVolume: 0.45,
    neonGlow: true,
    particles: true,
    touchControls: true,
  });

  // Current level data
  const currentLevel: LevelData =
    LEVELS.find((lvl) => lvl.id === currentLevelId) || LEVELS[0];

  // Reset state for new or reloaded level
  const resetLevelState = useCallback((_lvl: LevelData) => {
    setActiveColor('white');
    setCharacters([]);
    setCollectedItemIds([]);
    setIsPaused(false);
    setIsStageClear(false);
  }, []);

  // Listen to level switch
  useEffect(() => {
    resetLevelState(currentLevel);
  }, [currentLevelId, resetLevelState, currentLevel]);

  // Restart current level
  const handleRestart = useCallback(() => {
    input.reset();
    sound.playSelect();
    setIsPaused(false);
    setIsStageClear(false);
    setActiveColor('white');
    setCharacters([]);
    setCollectedItemIds([]);
    setResetKey((k) => k + 1);
  }, []);

  // Characters updated callback from CanvasRenderer
  const handleCharactersUpdated = useCallback((chars: ActiveCharacter[]) => {
    setCharacters(chars);
  }, []);

  // Sync InputManager between menu navigation mode and active gameplay mode for gamepad
  useEffect(() => {
    const isMenuMode =
      screen !== 'playing' ||
      !activePlayer ||
      isPaused ||
      isStageClear ||
      showSettingsModal ||
      showRGBModal;
    input.setMenuMode(isMenuMode);
  }, [screen, activePlayer, isPaused, isStageClear, showSettingsModal, showRGBModal]);

  // Global shortcut listeners ([R] to restart, [Esc] to pause)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'playing') return;

      if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      } else if (e.key === 'Escape') {
        if (showRGBModal) {
          setShowRGBModal(false);
        } else if (showSettingsModal) {
          setShowSettingsModal(false);
        } else if (!isStageClear) {
          setIsPaused((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [screen, handleRestart, showRGBModal, showSettingsModal, isStageClear]);

  // Level unlock validator: Level 1 is always unlocked; higher levels require previous level completion
  const isLevelUnlocked = useCallback((lvlId: number) => {
    if (lvlId <= 1) return true;
    return completedLevels.includes(lvlId - 1);
  }, [completedLevels]);

  // Start / Resume game from Menu
  const handleStartGame = () => {
    input.reset();
    // Start at next uncompleted unlocked level, or level 1 if all are completed
    let targetLevel = 1;
    for (let i = 1; i <= LEVELS.length; i++) {
      if (!completedLevels.includes(i)) {
        targetLevel = i;
        break;
      }
    }
    setCurrentLevelId(targetLevel);
    setActiveColor('white');
    setCollectedItemIds([]);
    setResetKey((k) => k + 1);
    setScreen('playing');
  };

  // Level select start (guarded by level unlock progress check)
  const handleSelectLevel = (lvlId: number) => {
    if (!isLevelUnlocked(lvlId)) {
      sound.playLocked();
      return;
    }
    input.reset();
    setCurrentLevelId(lvlId);
    setActiveColor('white');
    setCollectedItemIds([]);
    setResetKey((k) => k + 1);
    setScreen('playing');
  };

  // Player profile handlers (multi-player on single device)
  const handleSubmitPlayerName = useCallback(
    (name: string) => {
      const { profile, profiles: updated } = loginOrCreateProfile(name, profiles);
      setProfiles(updated);
      setActivePlayerId(profile.id);
      setIsPaused(false);
      setIsStageClear(false);
      setScreen('menu');
    },
    [profiles]
  );

  const handleSelectExistingProfile = useCallback(
    (playerId: string) => {
      const { profile, profiles: updated } = selectExistingProfile(playerId, profiles);
      if (!profile) return;
      setProfiles(updated);
      setActivePlayerId(profile.id);
      setIsPaused(false);
      setIsStageClear(false);
      setScreen('menu');
    },
    [profiles]
  );

  const handleDeleteProfile = useCallback(
    (playerId: string) => {
      const { profiles: updated, nextActivePlayerId } = deletePlayerProfile(
        playerId,
        profiles,
        activePlayerId
      );
      setProfiles(updated);
      setActivePlayerId(nextActivePlayerId);
    },
    [profiles, activePlayerId]
  );

  const handleSwitchPlayer = useCallback(() => {
    input.reset();
    saveActivePlayerId(null);
    setActivePlayerId(null);
    setIsPaused(false);
    setIsStageClear(false);
    setActiveColor('white');
    setCharacters([]);
    setCollectedItemIds([]);
    setScreen('player_select');
  }, []);

  // Reset active player's game progress
  const handleResetProgress = useCallback(() => {
    if (!activePlayerId) return;
    setProfiles((prev) => resetPlayerProfileProgress(activePlayerId, prev));
    sound.playSelect();
  }, [activePlayerId]);

  // Color change callback from portal interaction
  const handleColorChanged = useCallback((newColor: SpectralColor) => {
    setActiveColor(newColor);
  }, []);

  // Item collection callback
  const handleItemCollected = useCallback((itemId: string) => {
    setCollectedItemIds((prev) => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
  }, []);

  // Stage clear handler
  const handleStageComplete = useCallback(() => {
    if (activePlayerId) {
      setProfiles((prev) => markPlayerLevelCompleted(activePlayerId, currentLevelId, prev));
    }

    if (currentLevelId >= LEVELS.length) {
      setScreen('win_screen');
    } else {
      setIsStageClear(true);
    }
  }, [activePlayerId, currentLevelId]);

  // Next level progression
  const handleNextStage = () => {
    input.reset();
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      setCurrentLevelId(nextId);
      setActiveColor('white');
      setCollectedItemIds([]);
      setResetKey((k) => k + 1);
      setIsStageClear(false);
    } else {
      setScreen('win_screen');
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      sound.updateVolumes(settings.masterVolume, settings.sfxVolume, settings.musicVolume);
    } else {
      setIsMuted(true);
      sound.updateVolumes(0, 0, 0);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#070709] text-[#F5F5F5] overflow-hidden select-none font-sans">
      {/* 0. INPUT NAMA / PILIH PEMAIN */}
      {(screen === 'player_select' || !activePlayer) && (
        <PlayerSelectScreen
          profiles={profiles}
          onSubmitName={handleSubmitPlayerName}
          onSelectProfile={handleSelectExistingProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}

      {/* 1. MENU UTAMA */}
      {screen === 'menu' && activePlayer && (
        <MainMenu
          playerName={activePlayer.name}
          onStartGame={handleStartGame}
          onOpenLevelSelect={() => {
            sound.playSelect();
            setScreen('level_select');
          }}
          onOpenSettings={() => {
            sound.playSelect();
            setShowSettingsModal(true);
          }}
          onOpenRGBDiagram={() => {
            sound.playSelect();
            setShowRGBModal(true);
          }}
          onSwitchPlayer={handleSwitchPlayer}
          completedLevels={completedLevels}
        />
      )}

      {/* 2. PILIH LEVEL */}
      {screen === 'level_select' && activePlayer && (
        <LevelSelect
          playerName={activePlayer.name}
          completedLevels={completedLevels}
          onSelectLevel={handleSelectLevel}
          onResetProgress={handleResetProgress}
          onSwitchPlayer={handleSwitchPlayer}
          onBack={() => {
            sound.playSelect();
            setScreen('menu');
          }}
        />
      )}

      {/* 3. PLAYING SCREEN */}
      {screen === 'playing' && activePlayer && (
        <div className="relative w-full h-full">
          <CanvasRenderer
            level={currentLevel}
            activeColor={activeColor}
            onColorChanged={handleColorChanged}
            onCharactersUpdated={handleCharactersUpdated}
            collectedItemIds={collectedItemIds}
            onItemCollected={handleItemCollected}
            onStageComplete={handleStageComplete}
            onRespawn={handleRestart}
            neonGlow={settings.neonGlow}
            particlesEnabled={settings.particles}
            resetKey={resetKey}
            isPaused={isPaused}
            isStageClear={isStageClear}
          />

          <GameHUD
            level={currentLevel}
            playerName={activePlayer.name}
            activeColor={activeColor}
            characters={characters}
            collectedItemIds={collectedItemIds}
            onRestart={handleRestart}
            onOpenMenu={() => {
              sound.playSelect();
              setIsPaused(true);
            }}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          <TouchControls
            visible={settings.touchControls}
            onReset={handleRestart}
          />

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              playerName={activePlayer.name}
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
              onLevelSelect={() => {
                setIsPaused(false);
                setScreen('level_select');
              }}
              onSettings={() => setShowSettingsModal(true)}
              onMainMenu={() => {
                setIsPaused(false);
                setScreen('menu');
              }}
              onSwitchPlayer={handleSwitchPlayer}
            />
          )}

          {/* Stage Complete Modal */}
          {isStageClear && (
            <StageClearModal
              stageLabel={currentLevel.stageLabel}
              stageTitle={currentLevel.title}
              isLastStage={currentLevelId >= LEVELS.length}
              onNextStage={handleNextStage}
              onReplay={handleRestart}
              onLevelSelect={() => {
                setIsStageClear(false);
                setScreen('level_select');
              }}
            />
          )}
        </div>
      )}

      {/* 4. LAYAR MENANG */}
      {screen === 'win_screen' && activePlayer && (
        <WinScreen
          playerName={activePlayer.name}
          onReturnToMenu={() => {
            sound.playSelect();
            setScreen('menu');
          }}
          onPlayAgain={() => {
            sound.playSelect();
            handleStartGame();
          }}
          onSwitchPlayer={handleSwitchPlayer}
        />
      )}

      {/* RGB Spectrum Diagram Modal */}
      {showRGBModal && (
        <RGBDiagramModal
          activeColor={activeColor}
          onClose={() => setShowRGBModal(false)}
        />
      )}

      {/* Settings Modal (accessible anywhere) */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </main>
  );
}
