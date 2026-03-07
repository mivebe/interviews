import { Sprite } from 'pixi.js';

export type ParticleRole = 'glow' | 'flame' | 'ember';

export interface WobbleParams {
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface Particle {
  sprite: Sprite;
  role: ParticleRole;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  baseScale: number;
  wobble: WobbleParams;
  age: number;
}

// Spawn parameter ranges per particle role: [min, max] for each property
export interface RoleSpawnConfig {
  life: [number, number];
  x: [number, number];
  y: [number, number];
  vx: [number, number];
  vy: [number, number];
  baseScale: [number, number];
  wobbleAmp: [number, number];
  wobbleFreq?: [number, number];
}
