import { randomRange } from '../core/utils';
import { Particle, ParticleRole, RoleSpawnConfig } from './types';

export const MAX_PARTICLES = 10;
export const SPAWN_STAGGER = 0.08;

// Flame lifecycle thresholds
const FLAME_GROW_END = 0.4;
const FLAME_SHRINK_FACTOR = 0.5;
const FLAME_FADE_IN = 0.1;
const FLAME_PEAK_ALPHA = 0.85;
const FLAME_FADE_OUT = 0.4;
const EMBER_HOT_THRESHOLD = 0.3;

export const ROLE_SPAWN_CONFIG: Record<ParticleRole, RoleSpawnConfig> = {
  glow: {
    life: [0.6, 1.2],
    x: [-8, 8],
    y: [-15, 5],
    vx: [-12, 12],
    vy: [-50, -20],
    baseScale: [3.0, 5.0],
    wobbleAmp: [5, 15],
  },
  flame: {
    life: [0.25, 0.65],
    x: [-18, 18],
    y: [-8, 5],
    vx: [-30, 30],
    vy: [-320, -140],
    baseScale: [0.8, 1.8],
    wobbleAmp: [18, 40],
  },
  ember: {
    life: [0.3, 0.8],
    x: [-12, 12],
    y: [-20, 0],
    vx: [-80, 80],
    vy: [-400, -200],
    baseScale: [0.12, 0.3],
    wobbleAmp: [25, 55],
    wobbleFreq: [8, 16],
  },
};

/** Per-frame visual update logic for each particle role */
export const ROLE_UPDATERS: Record<
  ParticleRole,
  (p: Particle, lifeRatio: number, elapsed: number, dt: number) => void
> = {
  glow(p, lifeRatio, elapsed) {
    const flicker = 1 + Math.sin(elapsed * 5 + p.wobble.phase) * 0.1;
    const s = p.baseScale * flicker;
    p.sprite.scale.set(s, s);
    p.sprite.alpha = lifeRatio * 0.25;
  },

  // ageRatio: 0 (just born) → 1 (dead). lifeRatio: 1 (just born) → 0 (dead).
  flame(p, lifeRatio, _elapsed, dt) {
    const ageRatio = 1 - lifeRatio;

    // Scale: grow to full size during FLAME_GROW_END, then shrink by FLAME_SHRINK_FACTOR
    const scaleMult = ageRatio < FLAME_GROW_END
      ? FLAME_GROW_END + (ageRatio / FLAME_GROW_END) * (1 - FLAME_GROW_END)
      : 1.0 - ((ageRatio - FLAME_GROW_END) / (1 - FLAME_GROW_END)) * FLAME_SHRINK_FACTOR;
    const s = p.baseScale * scaleMult;
    p.sprite.scale.set(s, s * 1.4);

    // Alpha: fade in quickly, hold at peak, fade out near death
    if (ageRatio < FLAME_FADE_IN) {
      p.sprite.alpha = ageRatio / FLAME_FADE_IN;
    } else if (lifeRatio < FLAME_FADE_OUT) {
      p.sprite.alpha = (lifeRatio / FLAME_FADE_OUT) * FLAME_PEAK_ALPHA;
    } else {
      p.sprite.alpha = FLAME_PEAK_ALPHA;
    }

    p.sprite.rotation += randomRange(-0.5, 0.5) * dt;
  },

  ember(p, lifeRatio) {
    p.sprite.scale.set(p.baseScale);
    p.sprite.alpha = lifeRatio;
    p.sprite.tint = lifeRatio > EMBER_HOT_THRESHOLD ? 0xffffaa : 0xff8800;
  },
};
