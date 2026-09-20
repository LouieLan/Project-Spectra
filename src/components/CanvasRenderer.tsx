import React, { useRef, useEffect, useCallback } from 'react';
import { LevelData, Particle, SpectralColor, CHARACTER_SPECS, ActiveCharacter } from '../types';
import { input } from '../input';
import { sound } from '../audio';
import { evaluatePortalInteraction, combineColors, canCollectItem } from '../colorLogic';

interface CanvasRendererProps {
  level: LevelData;
  activeColor: SpectralColor;
  onColorChanged: (newColor: SpectralColor) => void;
  onCharactersUpdated?: (characters: ActiveCharacter[]) => void;
  collectedItemIds: string[];
  onItemCollected: (itemId: string, currentCount: number, totalCount: number) => void;
  onStageComplete: () => void;
  onRespawn?: () => void;
  neonGlow: boolean;
  particlesEnabled: boolean;
  resetKey: number;
  isPaused?: boolean;
  isStageClear?: boolean;
}

const VIRTUAL_WIDTH = 1280;
const VIRTUAL_HEIGHT = 720;

// Official Spectrum Color Palette
export const PALETTE = {
  bg: '#1B1B2F',
  wallNeutral: '#7F8C8D',
  hazardSpike: '#922B21',
  white: '#F5F5F5',
  whiteOutline: '#CCCCCC',
  red: '#E63946',
  green: '#2ECC71',
  blue: '#3498DB',
  yellow: '#F4D03F', // Red + Green
  cyan: '#48D1CC',   // Green + Blue
  magenta: '#C147E9',// Red + Blue
};

// Rounded rectangle helper
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  level,
  onColorChanged,
  onCharactersUpdated,
  collectedItemIds,
  onItemCollected,
  onStageComplete,
  onRespawn,
  neonGlow,
  particlesEnabled,
  resetKey,
  isPaused = false,
  isStageClear = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Multi-character list (All active characters move simultaneously with the same controls)
  const charactersRef = useRef<ActiveCharacter[]>([]);

  const collectedIdsRef = useRef<string[]>(collectedItemIds);
  collectedIdsRef.current = collectedItemIds;

  // Track if stage finish has already been triggered to avoid multiple audio/particle calls
  const hasFinishedRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;
  const isStageClearRef = useRef<boolean>(isStageClear);
  isStageClearRef.current = isStageClear;

  // Particle pool
  const particlesRef = useRef<Particle[]>([]);
  // Portal collision cooldown to prevent oscillation
  const portalCooldownRef = useRef<{ [key: string]: number }>({});
  // Item & finish rejection feedback cooldowns
  const itemRejectTimers = useRef<{ [key: string]: number }>({});

  // Camera tracking & dynamic zoom
  const cameraRef = useRef<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1.45 });

  // Spawn particle helper
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, speed = 120) => {
    if (!particlesEnabled) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vel = (Math.random() * 0.8 + 0.2) * speed;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        decay: Math.random() * 1.5 + 1.2,
      });
    }
  }, [particlesEnabled]);

  // Notify parent component about characters & active color
  const notifyCharactersUpdated = useCallback(() => {
    if (onCharactersUpdated) {
      onCharactersUpdated([...charactersRef.current]);
    }
    if (charactersRef.current.length > 0) {
      onColorChanged(charactersRef.current[0].color);
    }
  }, [onCharactersUpdated, onColorChanged]);

  // Reset physics position to spawn (Initial single white character)
  const resetPhysicsState = useCallback(() => {
    const spec = CHARACTER_SPECS['white'];
    const initialChar: ActiveCharacter = {
      id: `char_white_${Date.now()}`,
      name: 'Chr_Putih',
      color: 'white',
      hasR: true,
      hasG: true,
      hasB: true,
      x: level.playerStart.x - spec.width / 2,
      y: level.playerStart.y - spec.height / 2,
      vx: 0,
      vy: 0,
      width: spec.width,
      height: spec.height,
      isGrounded: false,
      canMergeCooldown: 0,
    };
    charactersRef.current = [initialChar];
    particlesRef.current = [];
    portalCooldownRef.current = {};
    hasFinishedRef.current = false;

    // Reset camera framing immediately onto player spawn
    const initZoom = 1.45;
    const viewW = VIRTUAL_WIDTH / initZoom;
    const viewH = VIRTUAL_HEIGHT / initZoom;
    const stageW = level.width || 1500;
    const stageH = level.height || 720;
    cameraRef.current = {
      x: Math.max(0, Math.min(stageW - viewW, level.playerStart.x - viewW / 2)),
      y: Math.max(0, Math.min(stageH - viewH, level.playerStart.y - viewH / 2 + 20)),
      zoom: initZoom,
    };

    notifyCharactersUpdated();
  }, [level.playerStart, level.width, level.height, notifyCharactersUpdated]);

  const resetPhysicsStateRef = useRef(resetPhysicsState);
  useEffect(() => {
    resetPhysicsStateRef.current = resetPhysicsState;
  });

  // Handle level change or resetKey ONLY
  useEffect(() => {
    resetPhysicsStateRef.current();
  }, [level.id, resetKey]);

  // Main game loop (RAF)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);

      const dt = Math.min((now - lastTime) / 1000, 0.05); // Cap delta time at 50ms
      lastTime = now;

      const stageW = level.width || 1500;
      const stageH = level.height || 720;

      const fz = level.finishZone;
      const allItemsCollected = collectedIdsRef.current.length >= level.items.length;
      const isWhiteRecombined = charactersRef.current.length === 1 && charactersRef.current[0].color === 'white';
      const isFinishOpen = allItemsCollected && isWhiteRecombined;

      // Only simulate inputs, physics, hazards, and collisions when active
      if (!isPausedRef.current && !isStageClearRef.current) {
        // 1. Update Cooldowns & Timers
      Object.keys(portalCooldownRef.current).forEach((k) => {
        if (portalCooldownRef.current[k] > 0) {
          portalCooldownRef.current[k] -= dt;
        }
      });
      Object.keys(itemRejectTimers.current).forEach((k) => {
        if (itemRejectTimers.current[k] > 0) {
          itemRejectTimers.current[k] -= dt;
        }
      });

      // Update character merge cooldowns
      charactersRef.current.forEach((c) => {
        if (c.canMergeCooldown && c.canMergeCooldown > 0) {
          c.canMergeCooldown -= dt;
        }
      });

      // 2. Physics & Movement for ALL characters (SIMULTANEOUS WEIGHTIER CONTROL)
      // Tuned parameters for grounded, weightier platforming feel:
      const MOVE_SPEED = 180;
      const JUMP_SPEED = -500;
      const GRAVITY = 1250;

      const wantJump = input.isJumpRequested();
      input.update(dt);

      // Process physics for each character simultaneously
      charactersRef.current.forEach((char) => {
        // Horizontal velocity input applied to ALL characters
        if (input.left && !input.right) {
          char.vx = -MOVE_SPEED;
        } else if (input.right && !input.left) {
          char.vx = MOVE_SPEED;
        } else {
          char.vx *= char.isGrounded ? 0.75 : 0.92;
          if (Math.abs(char.vx) < 5) char.vx = 0;
        }

        // Jump logic: any character on the ground executes jump
        if (wantJump && char.isGrounded) {
          char.vy = JUMP_SPEED;
          char.isGrounded = false;
          spawnParticles(char.x + char.width / 2, char.y + char.height, '#FFFFFF', 6, 70);
        }

        // Apply gravity
        char.vy += GRAVITY * dt;
        if (char.vy > 850) char.vy = 850;

        // Horizontal movement & Solid Platforms Collision (including Hurdles)
        const oldX = char.x;
        char.x += char.vx * dt;

        level.platforms.forEach((plat) => {
          if (
            char.x < plat.x + plat.width &&
            char.x + char.width > plat.x &&
            char.y < plat.y + plat.height &&
            char.y + char.height > plat.y
          ) {
            // Must have substantial vertical overlap to be treated as a side wall collision
            // (prevents floor platform from ejecting characters horizontally)
            const penetrationY = char.y + char.height - plat.y;
            const topClearance = plat.y + plat.height - char.y;
            if (penetrationY > 5 && topClearance > 5) {
              if (char.vx > 0 && oldX + char.width <= plat.x + 6) {
                char.x = plat.x - char.width;
                char.vx = 0;
              } else if (char.vx < 0 && oldX >= plat.x + plat.width - 6) {
                char.x = plat.x + plat.width;
                char.vx = 0;
              }
            }
          }
        });

        // Portal Barrier Collision on X axis
        level.portals.forEach((portal) => {
          const interaction = evaluatePortalInteraction(char.color, portal.type);
          if (interaction.action === 'blocked') {
            if (
              char.x < portal.x + portal.width &&
              char.x + char.width > portal.x &&
              char.y < portal.y + portal.height &&
              char.y + char.height > portal.y
            ) {
              const penetrationY = char.y + char.height - portal.y;
              const topClearance = portal.y + portal.height - char.y;
              if (penetrationY > 5 && topClearance > 5) {
                if (char.vx > 0 && oldX + char.width <= portal.x + 6) {
                  char.x = portal.x - char.width;
                  char.vx = 0;
                } else if (char.vx < 0 && oldX >= portal.x + portal.width - 6) {
                  char.x = portal.x + portal.width;
                  char.vx = 0;
                }
              }
              const cdKey = `block_${char.id}_${portal.id}`;
              if ((portalCooldownRef.current[cdKey] || 0) <= 0) {
                sound.playMismatch();
                portalCooldownRef.current[cdKey] = 0.4;
              }
            }
          }
        });

        // Finish Zone Solid Barrier on X axis when OFF (!isFinishOpen)
        // Rule: "Jadikan finish line off bisa menjadi tempat untuk merge (solid)"
        if (!isFinishOpen) {
          if (
            char.x < fz.x + fz.width &&
            char.x + char.width > fz.x &&
            char.y < fz.y + fz.height &&
            char.y + char.height > fz.y
          ) {
            const penetrationY = char.y + char.height - fz.y;
            const topClearance = fz.y + fz.height - char.y;
            if (penetrationY > 5 && topClearance > 5) {
              if (char.vx > 0 && oldX + char.width <= fz.x + 8) {
                char.x = fz.x - char.width;
                char.vx = 0;
              } else if (char.vx < 0 && oldX >= fz.x + fz.width - 8) {
                char.x = fz.x + fz.width;
                char.vx = 0;
              }
            }
          }
        }

        // Vertical movement & Solid Platforms Collision (including Hurdles)
        const oldY = char.y;
        char.y += char.vy * dt;
        char.isGrounded = false;

        level.platforms.forEach((plat) => {
          if (
            char.x < plat.x + plat.width &&
            char.x + char.width > plat.x &&
            char.y < plat.y + plat.height &&
            char.y + char.height > plat.y
          ) {
            if (char.vy > 0 && oldY + char.height <= plat.y + 14) {
              char.y = plat.y - char.height;
              char.vy = 0;
              char.isGrounded = true;
            } else if (char.vy < 0 && oldY >= plat.y + plat.height - 14) {
              char.y = plat.y + plat.height;
              char.vy = 0;
            }
          }
        });

        // Portal Barrier Collision on Y axis
        level.portals.forEach((portal) => {
          const interaction = evaluatePortalInteraction(char.color, portal.type);
          if (interaction.action === 'blocked') {
            if (
              char.x < portal.x + portal.width &&
              char.x + char.width > portal.x &&
              char.y < portal.y + portal.height &&
              char.y + char.height > portal.y
            ) {
              if (char.vy > 0 && oldY + char.height <= portal.y + 14) {
                char.y = portal.y - char.height;
                char.vy = 0;
                char.isGrounded = true;
              } else if (char.vy < 0 && oldY >= portal.y + portal.height - 14) {
                char.y = portal.y + portal.height;
                char.vy = 0;
              }
            }
          }
        });

        // Finish Zone Top/Bottom Platform on Y axis when OFF (!isFinishOpen)
        if (!isFinishOpen) {
          if (
            char.x < fz.x + fz.width &&
            char.x + char.width > fz.x &&
            char.y < fz.y + fz.height &&
            char.y + char.height > fz.y
          ) {
            if (char.vy > 0 && oldY + char.height <= fz.y + 14) {
              char.y = fz.y - char.height;
              char.vy = 0;
              char.isGrounded = true;
            } else if (char.vy < 0 && oldY >= fz.y + fz.height - 14) {
              char.y = fz.y + fz.height;
              char.vy = 0;
            }
          }
        }

        // Stage bounds
        if (char.x < 0) {
          char.x = 0;
          char.vx = 0;
        }
        if (char.x + char.width > stageW) {
          char.x = stageW - char.width;
          char.vx = 0;
        }
      });

      // 3. Portal Interactions (SPLIT & PASS-THROUGH)
      for (let i = 0; i < charactersRef.current.length; i++) {
        const char = charactersRef.current[i];
        if (!char) continue;

        level.portals.forEach((portal) => {
          const interaction = evaluatePortalInteraction(char.color, portal.type);
          const cdKey = `portal_${char.id}_${portal.id}`;

          const isOverlapping =
            char.x + char.width > portal.x + 4 &&
            char.x < portal.x + portal.width - 4 &&
            char.y + char.height > portal.y + 6 &&
            char.y < portal.y + portal.height - 6;

          if (isOverlapping && (portalCooldownRef.current[cdKey] || 0) <= 0) {
            // SPLIT: separates character into two active colors
            if (interaction.action === 'split') {
              portalCooldownRef.current[cdKey] = 0.6;

              const stuckColor = interaction.stuckColor!;
              const passedColor = interaction.passedColor!;
              const stuckSpec = CHARACTER_SPECS[stuckColor];
              const passedSpec = CHARACTER_SPECS[passedColor];

              const enteringFromLeft =
                char.vx > 0 || (char.vx === 0 && char.x + char.width / 2 <= portal.x + portal.width / 2);
              let stuckX: number;
              let passedX: number;
              let passedVx: number;
              let stuckVx: number;

              if (enteringFromLeft) {
                // Warna yang sama dengan portal (stuckColor) berada di BELAKANG / TIDAK MELEWATI portal
                stuckX = portal.x - stuckSpec.width - 8;
                stuckVx = 0;
                // Komponen warna pelengkap (passedColor) MELEWATI portal ke sisi depan
                passedX = portal.x + portal.width + 10;
                passedVx = Math.max(char.vx, 110);
              } else {
                // Masuk dari kanan ke kiri
                stuckX = portal.x + portal.width + 8;
                stuckVx = 0;
                passedX = portal.x - passedSpec.width - 10;
                passedVx = Math.min(char.vx, -110);
              }

              // Selaraskan posisi kaki agar kedua karakter mendarat sempurna di lantai
              const groundFootY = char.y + char.height;
              const stuckY = groundFootY - stuckSpec.height;
              const passedY = groundFootY - passedSpec.height;

              // Create stuck character (warna yang sama dengan portal, tetap di sisi belakang / tidak lewat)
              const stuckChar: ActiveCharacter = {
                id: `char_${stuckColor}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: stuckSpec.name,
                color: stuckColor,
                hasR: stuckSpec.hasR,
                hasG: stuckSpec.hasG,
                hasB: stuckSpec.hasB,
                x: stuckX,
                y: stuckY,
                vx: stuckVx,
                vy: char.vy,
                width: stuckSpec.width,
                height: stuckSpec.height,
                isGrounded: char.isGrounded,
                canMergeCooldown: 0.6,
              };

              // Modify current character to become the passed character (yang berhasil melewati portal)
              char.color = passedColor;
              char.name = passedSpec.name;
              char.hasR = passedSpec.hasR;
              char.hasG = passedSpec.hasG;
              char.hasB = passedSpec.hasB;
              char.x = passedX;
              char.y = passedY;
              char.vx = passedVx;
              char.width = passedSpec.width;
              char.height = passedSpec.height;
              char.canMergeCooldown = 0.6;

              // Prevent immediate re-trigger on this portal for both characters
              const passedCdKey = `portal_${char.id}_${portal.id}`;
              const stuckCdKey = `portal_${stuckChar.id}_${portal.id}`;
              portalCooldownRef.current[passedCdKey] = 0.8;
              portalCooldownRef.current[stuckCdKey] = 0.8;

              // Insert stuck character into list so BOTH exist and move simultaneously
              charactersRef.current.push(stuckChar);

              sound.playPortalEnter(portal.type);
              spawnParticles(portal.x + portal.width / 2, portal.y + portal.height / 2, passedSpec.hex, 25, 180);
              spawnParticles(stuckX + stuckSpec.width / 2, stuckY + stuckSpec.height / 2, stuckSpec.hex, 15, 120);

              notifyCharactersUpdated();
            }
          }
        });
      }

      // 4. Recombination (Merging) when two characters touch each other
      for (let i = 0; i < charactersRef.current.length; i++) {
        for (let j = i + 1; j < charactersRef.current.length; j++) {
          const c1 = charactersRef.current[i];
          const c2 = charactersRef.current[j];
          if (!c1 || !c2) continue;

          if ((c1.canMergeCooldown || 0) <= 0 && (c2.canMergeCooldown || 0) <= 0) {
            // Check AABB overlap between characters
            if (
              c1.x < c2.x + c2.width &&
              c1.x + c1.width > c2.x &&
              c1.y < c2.y + c2.height &&
              c1.y + c1.height > c2.y
            ) {
              const mergedColor = combineColors(c1.color, c2.color);
              const mergedSpec = CHARACTER_SPECS[mergedColor];

              // Smoothly center the merged character between both characters
              const centerMidX = (c1.x + c1.width / 2 + c2.x + c2.width / 2) / 2;
              // Preserve the bottom feet position so the character expands UPWARDS,
              // completely preventing it from sinking into the floor or platform
              const groundFootY = Math.max(c1.y + c1.height, c2.y + c2.height);

              // Merge c2 into c1
              c1.color = mergedColor;
              c1.name = mergedSpec.name;
              c1.hasR = mergedSpec.hasR;
              c1.hasG = mergedSpec.hasG;
              c1.hasB = mergedSpec.hasB;
              c1.width = mergedSpec.width;
              c1.height = mergedSpec.height;
              c1.x = centerMidX - mergedSpec.width / 2;
              c1.y = groundFootY - mergedSpec.height;
              c1.vx = (c1.vx + c2.vx) / 2;
              c1.vy = Math.min(c1.vy, c2.vy);
              c1.isGrounded = c1.isGrounded || c2.isGrounded;
              c1.canMergeCooldown = 0.6;

              // Immediately push out from any hurdle or solid platform if the larger size overlaps
              level.platforms.forEach((plat) => {
                if (
                  c1.x < plat.x + plat.width &&
                  c1.x + c1.width > plat.x &&
                  c1.y < plat.y + plat.height &&
                  c1.y + c1.height > plat.y
                ) {
                  if (plat.isHurdle) {
                    if (centerMidX < plat.x + plat.width / 2) {
                      c1.x = plat.x - c1.width;
                    } else {
                      c1.x = plat.x + plat.width;
                    }
                  } else {
                    if (groundFootY <= plat.y + 12) {
                      c1.y = plat.y - c1.height;
                    }
                  }
                }
              });

              // Give cooldown on portals for this merged character to prevent instant re-split if merging near portal
              level.portals.forEach((portal) => {
                portalCooldownRef.current[`portal_${c1.id}_${portal.id}`] = 0.6;
              });

              // Remove c2
              charactersRef.current.splice(j, 1);
              j--;

              sound.playSynthesis();
              spawnParticles(c1.x + c1.width / 2, c1.y + c1.height / 2, mergedSpec.hex, 30, 200);

              notifyCharactersUpdated();
            }
          }
        }
      }

      // 5. Hazard Spikes & Pit Fall
      // Rule: "ketika salah satu dari warna menyentuh duri maka semua akan respawn"
      let triggerRespawn = false;
      for (let i = 0; i < charactersRef.current.length; i++) {
        const char = charactersRef.current[i];
        const inPit = char.y > stageH + 70;

        let hitSpike = false;
        level.spikes.forEach((spike) => {
          if (
            char.x + 5 < spike.x + spike.width &&
            char.x + char.width - 5 > spike.x &&
            char.y + 5 < spike.y + spike.height &&
            char.y + char.height > spike.y + 3
          ) {
            hitSpike = true;
          }
        });

        if (inPit || hitSpike) {
          triggerRespawn = true;
          spawnParticles(char.x + char.width / 2, char.y + char.height / 2, '#E63946', 30, 220);
          break;
        }
      }

      if (triggerRespawn) {
        sound.play('collision');
        resetPhysicsState();
        if (onRespawn) onRespawn();
        return;
      }

      // 6. Collectible Items (`Itm_Kotak`) collision
      level.items.forEach((item) => {
        if (collectedIdsRef.current.includes(item.id)) return;

        charactersRef.current.forEach((char) => {
          if (collectedIdsRef.current.includes(item.id)) return;

          if (
            char.x < item.x + item.width &&
            char.x + char.width > item.x &&
            char.y < item.y + item.height &&
            char.y + char.height > item.y
          ) {
            if (canCollectItem(char.color, item.warnaDibutuhkan)) {
              // Successfully collected
              const newCollectedCount = collectedIdsRef.current.length + 1;
              onItemCollected(item.id, newCollectedCount, level.items.length);
              sound.playCollectBall(newCollectedCount);

              const spec = CHARACTER_SPECS[item.warnaDibutuhkan];
              spawnParticles(item.x + item.width / 2, item.y + item.height / 2, spec.hex, 20, 160);
            } else {
              const cdKey = `item_mismatch_${item.id}_${char.id}`;
              if ((itemRejectTimers.current[cdKey] || 0) <= 0) {
                itemRejectTimers.current[cdKey] = 0.5;
                sound.playMismatch();
              }
            }
          }
        });
      });

      // 7. Finish Zone collision (`Zona_Finish`)
      // Rule: Finish line terbuka jika:
      // - Seluruh item telah dikumpulkan
      // - Karakter telah disatukan kembali menjadi WARNA PUTIH!
      // Saat OFF: Gerbang bersifat SOLID (menjadi tembok penahan / tempat merge karakter)
      charactersRef.current.forEach((char) => {
        const touchesFinish =
          char.x + char.width >= fz.x &&
          char.x <= fz.x + fz.width &&
          char.y + char.height >= fz.y &&
          char.y <= fz.y + fz.height;

        if (touchesFinish && isFinishOpen) {
          if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            sound.play('finish');
            spawnParticles(fz.x + fz.width / 2, fz.y + fz.height / 2, '#FFFFFF', 45, 250);
            onStageComplete();
          }
        }
      });
      }

      // 8. Update Particles & Floating texts
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      // ==========================================
      // CAMERA TRACKING & VIEWPORT UPDATE
      // ==========================================
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      charactersRef.current.forEach((c) => {
        minX = Math.min(minX, c.x);
        maxX = Math.max(maxX, c.x + c.width);
        minY = Math.min(minY, c.y);
        maxY = Math.max(maxY, c.y + c.height);
      });
      if (charactersRef.current.length === 0) {
        minX = level.playerStart.x;
        maxX = level.playerStart.x;
        minY = level.playerStart.y;
        maxY = level.playerStart.y;
      }

      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const spreadX = maxX - minX;

      // Dynamic zoom: 1.45 default, eases down slightly if split characters separate
      const targetZoom = Math.max(1.22, Math.min(1.45, 1.45 - (spreadX / 1100) * 0.23));
      cameraRef.current.zoom += (targetZoom - cameraRef.current.zoom) * Math.min(1, dt * 5);

      const currentZoom = cameraRef.current.zoom;
      const viewWidth = VIRTUAL_WIDTH / currentZoom;
      const viewHeight = VIRTUAL_HEIGHT / currentZoom;

      const desiredCamX = Math.max(0, Math.min(stageW - viewWidth, midX - viewWidth / 2));
      const desiredCamY = Math.max(0, Math.min(stageH - viewHeight, midY - viewHeight / 2 + 15));

      cameraRef.current.x += (desiredCamX - cameraRef.current.x) * Math.min(1, dt * 7);
      cameraRef.current.y += (desiredCamY - cameraRef.current.y) * Math.min(1, dt * 7);

      // ==========================================
      // RENDERING SECTION (WITH CAMERA TRANSFORM)
      // ==========================================
      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // A. Dark Minimalist Background (`#1B1B2F`)
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // Apply camera viewport
      ctx.save();
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

      // Subtle atmospheric world grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.028)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x <= stageW; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, stageH);
        ctx.stroke();
      }
      for (let y = 0; y <= stageH; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(stageW, y);
        ctx.stroke();
      }

      // B. Render Solid Platforms & Hurdle Platforms
      level.platforms.forEach((plat) => {
        ctx.save();
        if (plat.isHurdle) {
          // Vertical alignment platform (hurdle to bump & merge characters, and jump over)
          if (neonGlow) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 14;
          }
          ctx.fillStyle = '#2A2A48';
          drawRoundRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
          ctx.fill();

          // Outer glowing border
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          drawRoundRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
          ctx.stroke();

          // Inner vertical alignment markers
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          for (let y = plat.y + 6; y < plat.y + plat.height - 6; y += 9) {
            ctx.fillRect(plat.x + 3, y, plat.width - 6, 3);
          }
        } else {
          // Standard platform
          ctx.fillStyle = '#24243E';
          drawRoundRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
          ctx.fill();

          // Top highlight line
          ctx.strokeStyle = PALETTE.wallNeutral;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(plat.x + 2, plat.y);
          ctx.lineTo(plat.x + plat.width - 2, plat.y);
          ctx.stroke();
        }
        ctx.restore();
      });

      // C. Render Hazard Spikes
      ctx.save();
      level.spikes.forEach((spike) => {
        const triangleWidth = 16;
        const count = Math.max(1, Math.floor(spike.width / triangleWidth));
        const actualWidth = spike.width / count;

        ctx.fillStyle = PALETTE.hazardSpike;
        ctx.strokeStyle = '#E63946';
        ctx.lineWidth = 1.5;

        for (let i = 0; i < count; i++) {
          const sx = spike.x + i * actualWidth;
          const sy = spike.y + spike.height;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + actualWidth / 2, spike.y);
          ctx.lineTo(sx + actualWidth, sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });
      ctx.restore();

      // D. Render Portals
      level.portals.forEach((portal) => {
        ctx.save();
        let portalColor = '#FFFFFF';

        if (portal.type === 'red') {
          portalColor = PALETTE.red;
        } else if (portal.type === 'green') {
          portalColor = PALETTE.green;
        } else if (portal.type === 'blue') {
          portalColor = PALETTE.blue;
        }

        if (neonGlow) {
          ctx.shadowColor = portalColor;
          ctx.shadowBlur = 18;
        }

        // Translucent portal beam
        const grad = ctx.createLinearGradient(portal.x, portal.y, portal.x, portal.y + portal.height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(0.5, portalColor + '55');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');

        ctx.fillStyle = grad;
        drawRoundRect(ctx, portal.x, portal.y, portal.width, portal.height, 6);
        ctx.fill();

        // Portal outline
        ctx.strokeStyle = portalColor;
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, portal.x, portal.y, portal.width, portal.height, 6);
        ctx.stroke();

        // Top & bottom caps
        ctx.fillStyle = portalColor;
        ctx.fillRect(portal.x - 3, portal.y - 2, portal.width + 6, 4);
        ctx.fillRect(portal.x - 3, portal.y + portal.height - 2, portal.width + 6, 4);

        ctx.restore();
      });

      // E. Render Collectible Items (`Itm_Kotak`)
      level.items.forEach((item) => {
        if (collectedIdsRef.current.includes(item.id)) return;

        const spec = CHARACTER_SPECS[item.warnaDibutuhkan];
        const canCollectAny = charactersRef.current.some((c) => canCollectItem(c.color, item.warnaDibutuhkan));

        ctx.save();
        const floatY = Math.sin(now / 300 + item.x) * 3;
        const ix = item.x;
        const iy = item.y + floatY;

        if (neonGlow) {
          ctx.shadowColor = spec.hex;
          ctx.shadowBlur = canCollectAny ? 14 : 4;
        }

        // Item body
        ctx.fillStyle = spec.hex;
        drawRoundRect(ctx, ix, iy, item.width, item.height, 4);
        ctx.fill();

        // Outline
        ctx.strokeStyle = spec.outline || '#FFFFFF';
        ctx.lineWidth = canCollectAny ? 2 : 1;
        drawRoundRect(ctx, ix, iy, item.width, item.height, 4);
        ctx.stroke();

        // Pulsing glow ring if collectable
        if (canCollectAny) {
          const pulse = (Math.sin(now / 200) + 1) * 3;
          ctx.strokeStyle = spec.hex;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          drawRoundRect(ctx, ix - pulse, iy - pulse, item.width + pulse * 2, item.height + pulse * 2, 6);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.restore();
      });

      // F. Render Finish Zone (`Zona_Finish` Checkered)
      ctx.save();
      if (neonGlow && isFinishOpen) {
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 28;
      }

      ctx.fillStyle = isFinishOpen ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.65)';
      drawRoundRect(ctx, fz.x, fz.y, fz.width, fz.height, 6);
      ctx.fill();

      // Checkered pattern inside finish zone
      const checkCols = 6;
      const checkRows = 8;
      const cellW = fz.width / checkCols;
      const cellH = fz.height / checkRows;
      for (let r = 0; r < checkRows; r++) {
        for (let c = 0; c < checkCols; c++) {
          const isWhiteCell = (r + c) % 2 === 0;
          if (isWhiteCell) {
            ctx.fillStyle = isFinishOpen ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)';
          } else {
            ctx.fillStyle = isFinishOpen ? 'rgba(30, 30, 50, 0.9)' : 'rgba(10, 10, 20, 0.85)';
          }
          ctx.fillRect(fz.x + c * cellW, fz.y + r * cellH, cellW, cellH);
        }
      }

      ctx.strokeStyle = isFinishOpen ? '#FFFFFF' : (!allItemsCollected ? '#E63946' : '#F4D03F');
      ctx.lineWidth = 3;
      drawRoundRect(ctx, fz.x, fz.y, fz.width, fz.height, 6);
      ctx.stroke();

      ctx.restore();

      // G. Render ALL Characters (All characters move simultaneously)
      const multiChars = charactersRef.current.length > 1;
      charactersRef.current.forEach((char) => {
        const spec = CHARACTER_SPECS[char.color];

        ctx.save();
        if (neonGlow) {
          ctx.shadowColor = spec.hex;
          ctx.shadowBlur = 16;
        }

        const cx = char.x;
        const cy = char.y;
        const cw = char.width;
        const ch = char.height;

        // Character body
        ctx.fillStyle = spec.hex;
        drawRoundRect(ctx, cx, cy, cw, ch, 4);
        ctx.fill();

        // Outline
        ctx.strokeStyle = spec.outline || '#FFFFFF';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, cx, cy, cw, ch, 4);
        ctx.stroke();

        // Expressive eyes
        const eyeColor = (char.color === 'white' || char.color === 'yellow' || char.color === 'cyan') ? '#1B1B2F' : '#FFFFFF';
        ctx.fillStyle = eyeColor;
        const eyeDir = char.vx > 10 ? 2 : char.vx < -10 ? -2 : 0;
        const eyeY = cy + 11;
        ctx.fillRect(cx + 8 + eyeDir, eyeY, 4, 6);
        ctx.fillRect(cx + cw - 12 + eyeDir, eyeY, 4, 6);

        ctx.restore();
      });

      // H. Render Floating Particles
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore(); // Restore camera transform
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [level, neonGlow, particlesEnabled, onItemCollected, onStageComplete, onRespawn, spawnParticles, resetPhysicsState, notifyCharactersUpdated]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#1B1B2F]">
      <canvas
        ref={canvasRef}
        width={VIRTUAL_WIDTH}
        height={VIRTUAL_HEIGHT}
        className="w-full h-full max-w-full max-h-full object-contain block select-none"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};
