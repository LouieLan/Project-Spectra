import { PlayerProfile } from './types';

const PROFILES_KEY = 'spectra_player_profiles';
const ACTIVE_PLAYER_KEY = 'spectra_active_player_id';

export function loadProfiles(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is PlayerProfile =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          Array.isArray(item.completedLevels)
      )
      .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: PlayerProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

export function loadActivePlayerId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PLAYER_KEY);
  } catch {
    return null;
  }
}

export function saveActivePlayerId(playerId: string | null): void {
  try {
    if (playerId === null) {
      localStorage.removeItem(ACTIVE_PLAYER_KEY);
    } else {
      localStorage.setItem(ACTIVE_PLAYER_KEY, playerId);
    }
  } catch {
    // Ignore storage errors
  }
}

export function normalizePlayerName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function generatePlayerId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loginOrCreateProfile(
  rawName: string,
  currentProfiles: PlayerProfile[]
): {
  profile: PlayerProfile;
  profiles: PlayerProfile[];
  isReturning: boolean;
} {
  const cleanName = normalizePlayerName(rawName);
  const now = Date.now();

  const existing = currentProfiles.find(
    (p) => p.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (existing) {
    const updatedProfile: PlayerProfile = {
      ...existing,
      lastPlayedAt: now,
    };
    const updatedList = [
      updatedProfile,
      ...currentProfiles.filter((p) => p.id !== existing.id),
    ];
    saveProfiles(updatedList);
    saveActivePlayerId(updatedProfile.id);
    return { profile: updatedProfile, profiles: updatedList, isReturning: true };
  }

  const newProfile: PlayerProfile = {
    id: generatePlayerId(),
    name: cleanName,
    completedLevels: [],
    createdAt: now,
    lastPlayedAt: now,
  };
  const updatedList = [newProfile, ...currentProfiles];
  saveProfiles(updatedList);
  saveActivePlayerId(newProfile.id);
  return { profile: newProfile, profiles: updatedList, isReturning: false };
}

export function selectExistingProfile(
  playerId: string,
  currentProfiles: PlayerProfile[]
): {
  profile: PlayerProfile | null;
  profiles: PlayerProfile[];
} {
  const target = currentProfiles.find((p) => p.id === playerId);
  if (!target) return { profile: null, profiles: currentProfiles };

  const updatedProfile: PlayerProfile = {
    ...target,
    lastPlayedAt: Date.now(),
  };
  const updatedList = [
    updatedProfile,
    ...currentProfiles.filter((p) => p.id !== playerId),
  ];
  saveProfiles(updatedList);
  saveActivePlayerId(updatedProfile.id);
  return { profile: updatedProfile, profiles: updatedList };
}

export function markPlayerLevelCompleted(
  playerId: string,
  levelId: number,
  currentProfiles: PlayerProfile[]
): PlayerProfile[] {
  const now = Date.now();
  const updatedList = currentProfiles.map((p) => {
    if (p.id !== playerId) return p;
    const completed = p.completedLevels.includes(levelId)
      ? p.completedLevels
      : [...p.completedLevels, levelId].sort((a, b) => a - b);
    return {
      ...p,
      completedLevels: completed,
      lastPlayedAt: now,
    };
  });
  saveProfiles(updatedList);
  return updatedList;
}

export function resetPlayerProfileProgress(
  playerId: string,
  currentProfiles: PlayerProfile[]
): PlayerProfile[] {
  const updatedList = currentProfiles.map((p) =>
    p.id === playerId
      ? { ...p, completedLevels: [], lastPlayedAt: Date.now() }
      : p
  );
  saveProfiles(updatedList);
  return updatedList;
}

export function deletePlayerProfile(
  playerId: string,
  currentProfiles: PlayerProfile[],
  activePlayerId: string | null
): {
  profiles: PlayerProfile[];
  nextActivePlayerId: string | null;
} {
  const updatedList = currentProfiles.filter((p) => p.id !== playerId);
  saveProfiles(updatedList);
  const nextActivePlayerId = activePlayerId === playerId ? null : activePlayerId;
  if (activePlayerId === playerId) {
    saveActivePlayerId(null);
  }
  return { profiles: updatedList, nextActivePlayerId };
}
