import { CHARACTER_SPECS, PortalType, SpectralColor } from './types';

export type PortalInteractionType = 'split' | 'pass_through' | 'blocked';

export interface PortalInteractionResult {
  action: PortalInteractionType;
  stuckColor?: SpectralColor; // Component blocked and left behind at entrance (e.g. 'red')
  passedColor?: SpectralColor; // Component that passes through to the other side (e.g. 'cyan')
  nextColor?: SpectralColor; // Resulting color for pass_through
  reason?: string;
}

export interface PortalTransitionResult {
  canPass: boolean;
  nextColor: SpectralColor;
  reason?: string;
}

/**
 * Evaluates portal interaction according to RGB split/recombination logic.
 *
 * Rules:
 * - Portal_Merah: Blocks component R.
 *     Putih (RGB) -> SPLIT into Merah (stuck at entrance) + Cyan (passes through)
 *     Kuning (RG) -> SPLIT into Merah (stuck) + Hijau (passes through)
 *     Magenta (RB)-> SPLIT into Merah (stuck) + Biru (passes through)
 *     Merah (R)   -> BLOCKED (solid wall)
 *     All others (Cyan, Hijau, Biru) have no R -> PASS THROUGH freely
 *
 * - Portal_Hijau: Blocks component G.
 *     Putih (RGB) -> SPLIT into Hijau (stuck) + Magenta (passes through)
 *     Kuning (RG) -> SPLIT into Hijau (stuck) + Merah (passes through)
 *     Cyan (GB)   -> SPLIT into Hijau (stuck) + Biru (passes through)
 *     Hijau (G)   -> BLOCKED (solid wall)
 *     All others (Magenta, Merah, Biru) have no G -> PASS THROUGH freely
 *
 * - Portal_Biru: Blocks component B.
 *     Putih (RGB) -> SPLIT into Biru (stuck) + Kuning (passes through)
 *     Cyan (GB)   -> SPLIT into Biru (stuck) + Hijau (passes through)
 *     Magenta (RB)-> SPLIT into Biru (stuck) + Merah (passes through)
 *     Biru (B)    -> BLOCKED (solid wall)
 *     All others (Kuning, Merah, Hijau) have no B -> PASS THROUGH freely
 */
export function evaluatePortalInteraction(
  currentColor: SpectralColor,
  portalType: PortalType
): PortalInteractionResult {
  // Portal Merah: Blocks component R
  if (portalType === 'red') {
    switch (currentColor) {
      case 'white':
        return { action: 'split', stuckColor: 'red', passedColor: 'cyan' };
      case 'yellow':
        return { action: 'split', stuckColor: 'red', passedColor: 'green' };
      case 'magenta':
        return { action: 'split', stuckColor: 'red', passedColor: 'blue' };
      case 'red':
        return { action: 'blocked', reason: 'Merah tidak bisa melewati portal warna merah' };
      default:
        // Cyan, Hijau, Biru tidak punya komponen Merah -> bebas lewat tanpa perubahan
        return { action: 'pass_through', nextColor: currentColor };
    }
  }

  // Portal Hijau: Blocks component G
  if (portalType === 'green') {
    switch (currentColor) {
      case 'white':
        return { action: 'split', stuckColor: 'green', passedColor: 'magenta' };
      case 'yellow':
        return { action: 'split', stuckColor: 'green', passedColor: 'red' };
      case 'cyan':
        return { action: 'split', stuckColor: 'green', passedColor: 'blue' };
      case 'green':
        return { action: 'blocked', reason: 'Hijau tidak bisa melewati portal warna hijau' };
      default:
        // Magenta, Merah, Biru tidak punya komponen Hijau -> bebas lewat tanpa perubahan
        return { action: 'pass_through', nextColor: currentColor };
    }
  }

  // Portal Biru: Blocks component B
  if (portalType === 'blue') {
    switch (currentColor) {
      case 'white':
        return { action: 'split', stuckColor: 'blue', passedColor: 'yellow' };
      case 'cyan':
        return { action: 'split', stuckColor: 'blue', passedColor: 'green' };
      case 'magenta':
        return { action: 'split', stuckColor: 'blue', passedColor: 'red' };
      case 'blue':
        return { action: 'blocked', reason: 'Biru tidak bisa melewati portal warna biru' };
      default:
        // Kuning, Merah, Hijau tidak punya komponen Biru -> bebas lewat tanpa perubahan
        return { action: 'pass_through', nextColor: currentColor };
    }
  }

  return { action: 'blocked', reason: 'Portal tidak dikenali' };
}

/**
 * Backward-compatible helper for legacy checks
 */
export function evaluatePortalTransition(
  currentColor: SpectralColor,
  portalType: PortalType
): PortalTransitionResult {
  const result = evaluatePortalInteraction(currentColor, portalType);
  if (result.action === 'blocked') {
    return { canPass: false, nextColor: currentColor, reason: result.reason };
  }
  if (result.action === 'split') {
    return { canPass: true, nextColor: result.passedColor! };
  }
  return { canPass: true, nextColor: result.nextColor || currentColor };
}

/**
 * Combines two spectral colors additively (e.g. Red + Cyan = White, Red + Green = Yellow).
 */
export function combineColors(colorA: SpectralColor, colorB: SpectralColor): SpectralColor {
  const specA = CHARACTER_SPECS[colorA];
  const specB = CHARACTER_SPECS[colorB];
  const r = specA.hasR || specB.hasR;
  const g = specA.hasG || specB.hasG;
  const b = specA.hasB || specB.hasB;

  if (r && g && b) return 'white';
  if (r && g && !b) return 'yellow';
  if (r && !g && b) return 'magenta';
  if (!r && g && b) return 'cyan';
  if (r && !g && !b) return 'red';
  if (!r && g && !b) return 'green';
  if (!r && !g && b) return 'blue';
  return 'white';
}

/**
 * Checks if an item can be collected based on current active character color.
 * Rule: Itm_Kotak can ONLY be collected if WarnaAktif = WarnaDibutuhkan.
 */
export function canCollectItem(charColor: SpectralColor, itemColor: SpectralColor): boolean {
  return charColor === itemColor;
}

export function getColorName(color: SpectralColor): string {
  return CHARACTER_SPECS[color]?.name || color;
}
