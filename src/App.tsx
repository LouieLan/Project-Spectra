import React, { useState, useEffect, useCallback } from 'react';
import { GameSettings, LevelData, ScreenType, SpectralColor, ActiveCharacter } from './types';
import { LEVELS } from './levels';
import { sound } from './audio';
import { input } from './input';
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
  const [screen, setScreen] = useState<ScreenType>('menu');
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

  // Completed levels persisted in localStorage
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('spectrum_clone_completed_levels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  // Start game from Menu
  const handleStartGame = () => {
    input.reset();
    setCurrentLevelId(1);
    setActiveColor('white');
    setCollectedItemIds([]);
    setResetKey((k) => k + 1);
    setScreen('playing');
  };

  // Level select start
  const handleSelectLevel = (lvlId: number) => {
    input.reset();
    setCurrentLevelId(lvlId);
    setActiveColor('white');
    setCollectedItemIds([]);
    setResetKey((k) => k + 1);
    setScreen('playing');
  };

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
    setCompletedLevels((prev) => {
      if (prev.includes(currentLevelId)) return prev;
      const updated = [...prev, currentLevelId];
      try {
        localStorage.setItem('spectrum_clone_completed_levels', JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });

    if (currentLevelId >= LEVELS.length) {
      // Completed all 7 levels -> Show Layar_Menang (WinScreen)
      setScreen('win_screen');
    } else {
      setIsStageClear(true);
    }
  }, [currentLevelId]);

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
      {/* 1. MENU UTAMA */}
      {screen === 'menu' && (
        <MainMenu
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
        />
      )}

      {/* 2. PILIH LEVEL */}
      {screen === 'level_select' && (
        <LevelSelect
          completedLevels={completedLevels}
          onSelectLevel={handleSelectLevel}
          onBack={() => {
            sound.playSelect();
            setScreen('menu');
          }}
        />
      )}

      {/* 3. PLAYING SCREEN (Level 1 s/d 7) */}
      {screen === 'playing' && (
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

      {/* 4. LAYAR MENANG (All 7 Levels Complete) */}
      {screen === 'win_screen' && (
        <WinScreen
          onReturnToMenu={() => {
            sound.playSelect();
            setScreen('menu');
          }}
          onPlayAgain={() => {
            sound.playSelect();
            handleStartGame();
          }}
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
