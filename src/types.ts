export type ScreenType = 'menu' | 'level_select' | 'playing' | 'win_screen' | 'settings';

export type SpectralColor = 'white' | 'red' | 'green' | 'blue' | 'cyan' | 'yellow' | 'magenta';

export interface SpectralCharacterInfo {
  name: 'Chr_Putih' | 'Chr_Kuning' | 'Chr_Magenta' | 'Chr_Cyan' | 'Chr_Merah' | 'Chr_Hijau' | 'Chr_Biru';
  color: SpectralColor;
  labelId: string;
  hasR: boolean;
  hasG: boolean;
  hasB: boolean;
  hex: string;
  outline?: string;
  width: number;
  height: number;
}

export const CHARACTER_SPECS: Record<SpectralColor, SpectralCharacterInfo> = {
  white: {
    name: 'Chr_Putih',
    color: 'white',
    labelId: 'Putih (R+G+B)',
    hasR: true,
    hasG: true,
    hasB: true,
    hex: '#F5F5F5',
    outline: '#CCCCCC',
    width: 36,
    height: 36,
  },
  yellow: {
    name: 'Chr_Kuning',
    color: 'yellow',
    labelId: 'Kuning (R+G)',
    hasR: true,
    hasG: true,
    hasB: false,
    hex: '#F4D03F',
    width: 32,
    height: 32,
  },
  magenta: {
    name: 'Chr_Magenta',
    color: 'magenta',
    labelId: 'Magenta (R+B)',
    hasR: true,
    hasG: false,
    hasB: true,
    hex: '#C147E9',
    width: 32,
    height: 32,
  },
  cyan: {
    name: 'Chr_Cyan',
    color: 'cyan',
    labelId: 'Cyan (G+B)',
    hasR: false,
    hasG: true,
    hasB: true,
    hex: '#48D1CC',
    width: 32,
    height: 32,
  },
  red: {
    name: 'Chr_Merah',
    color: 'red',
    labelId: 'Merah (R)',
    hasR: true,
    hasG: false,
    hasB: false,
    hex: '#E63946',
    width: 32,
    height: 32,
  },
  green: {
    name: 'Chr_Hijau',
    color: 'green',
    labelId: 'Hijau (G)',
    hasR: false,
    hasG: true,
    hasB: false,
    hex: '#2ECC71',
    width: 32,
    height: 32,
  },
  blue: {
    name: 'Chr_Biru',
    color: 'blue',
    labelId: 'Biru (B)',
    hasR: false,
    hasG: false,
    hasB: true,
    hex: '#3498DB',
    width: 32,
    height: 32,
  },
};

export type PrimaryColor = 'red' | 'green' | 'blue';

export interface PrimarySpawn {
  color: PrimaryColor;
  x: number;
  y: number;
  groupId?: string;
  locked?: boolean;
}

export interface ActiveCharacter {
  id: string;
  name: 'Chr_Putih' | 'Chr_Kuning' | 'Chr_Magenta' | 'Chr_Cyan' | 'Chr_Merah' | 'Chr_Hijau' | 'Chr_Biru';
  color: SpectralColor;
  hasR: boolean;
  hasG: boolean;
  hasB: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  canMergeCooldown?: number;
  coyoteTimer?: number;
  // Spectrum GDevelop object variables:
  terkunci?: boolean;
  groupId?: string;
  isMaster?: boolean;
  primaryType?: 'red' | 'green' | 'blue';
  // Smooth Merge & Split Tween state
  isTweening?: boolean;
  tweenStartX?: number;
  tweenStartY?: number;
  tweenTargetX?: number;
  tweenTargetY?: number;
  tweenTime?: number;
  tweenDuration?: number;
}

export type PortalType = 'red' | 'green' | 'blue';

export interface Portal {
  id: string;
  type: PortalType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface ItemBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  warnaDibutuhkan: SpectralColor;
  collected: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  isHurdle?: boolean; // Platform vertikal penyelaras warna (bisa dilompati)
}

export interface HazardSpike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FinishZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelData {
  id: number;
  name: string; // e.g. "Level_1"
  title: string;
  stageLabel: string;
  subtitle?: string;
  hintText?: string;
  width?: number; // Total stage horizontal length (for camera tracking)
  height?: number;
  playerStart: { x: number; y: number };
  spawns?: PrimarySpawn[];
  platforms: Platform[];
  portals: Portal[];
  items: ItemBox[];
  spikes: HazardSpike[];
  finishZone: FinishZone;
}

export interface PlayerState {
  activeCharacter: ActiveCharacter;
  collectedItemIds: string[];
  totalItems: number;
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  neonGlow: boolean;
  particles: boolean;
  touchControls: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}
