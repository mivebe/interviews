import { Container, Sprite, Texture } from 'pixi.js';
import { MAX_PARTICLES, SPAWN_STAGGER, ROLE_SPAWN_CONFIG, ROLE_UPDATERS } from './constants';
import { randomRange } from '../core/utils';
import { Particle, ParticleRole } from './types';
import { createSoftCircleTexture, fireColor } from './utils';

/**
 * Fire particle system with a fixed 10-sprite budget:
 * 2 glow (ambient pulsing), 6 flame (fast-rising body), 2 ember (bright sparks).
 * Particles recycle on death — no allocations after init.
 */
export class ParticleEmitter extends Container {
  private static sharedTexture: Texture | null = null;
  private particles: Particle[] = [];
  private texture: Texture;
  private elapsed = 0;
  private _emitterX = 0;
  private _emitterY = 0;

  public get emitterX() {
    return this._emitterX;
  }
  public set emitterX(v: number) {
    this._emitterX = v;
    this.position.x = v;
  }

  public get emitterY() {
    return this._emitterY;
  }
  public set emitterY(v: number) {
    this._emitterY = v;
    this.position.y = v;
  }

  // Particle budget: 2 glow + 6 flame + 2 ember = 10
  private static readonly ROLES: ParticleRole[] = [
    'glow',
    'glow',
    'flame',
    'flame',
    'flame',
    'flame',
    'flame',
    'flame',
    'ember',
    'ember',
  ];

  constructor() {
    super();

    if (!ParticleEmitter.sharedTexture) {
      ParticleEmitter.sharedTexture = createSoftCircleTexture(128);
    }
    this.texture = ParticleEmitter.sharedTexture;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const role = ParticleEmitter.ROLES[i];
      const sprite = new Sprite(this.texture);
      sprite.anchor.set(0.5);
      sprite.blendMode = 'add';
      sprite.visible = false;
      this.addChild(sprite);

      this.particles.push({
        sprite,
        role,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        baseScale: 1,
        wobble: {
          phase: Math.random() * Math.PI * 2,
          frequency: randomRange(3, 7),
          amplitude: randomRange(8, 20),
        },
        age: 0,
      });
    }

    // Stagger initial spawns so particles don't all appear at once.
    // Negative life acts as a countdown before the particle enters its first cycle.
    this.particles.forEach((p, i) => {
      p.life = -i * SPAWN_STAGGER;
    });
  }

  private resetParticle(p: Particle): void {
    p.age = 0;
    p.wobble.phase = Math.random() * Math.PI * 2;
    p.wobble.frequency = randomRange(5, 11);

    const cfg = ROLE_SPAWN_CONFIG[p.role];
    p.life = randomRange(...cfg.life);
    p.maxLife = p.life;
    p.sprite.x = randomRange(...cfg.x);
    p.sprite.y = randomRange(...cfg.y);
    p.vx = randomRange(...cfg.vx);
    p.vy = randomRange(...cfg.vy);
    p.baseScale = randomRange(...cfg.baseScale);
    p.wobble.amplitude = randomRange(...cfg.wobbleAmp);
    if (cfg.wobbleFreq) p.wobble.frequency = randomRange(...cfg.wobbleFreq);

    p.sprite.scale.set(p.baseScale, p.baseScale * 1.3); // vertically stretched
    p.sprite.alpha = 1;
    p.sprite.visible = true;
    p.sprite.rotation = randomRange(-0.3, 0.3);
  }

  /** Advance all particles by `dt` seconds — handles respawn, motion, color, and scale */
  update(dt: number): void {
    this.elapsed += dt;

    for (const p of this.particles) {
      // Handle delayed spawn / dead particles
      if (p.life <= 0) {
        this.resetParticle(p);
        continue;
      }

      p.life -= dt;
      p.age += dt;
      const lifeRatio = Math.max(0, p.life / p.maxLife);

      const wobble = Math.sin(p.age * p.wobble.frequency + p.wobble.phase) * p.wobble.amplitude;
      p.sprite.x += (p.vx + wobble * 0.5) * dt;
      p.sprite.y += p.vy * dt;
      p.vy *= 1 - 0.15 * dt;
      p.sprite.tint = fireColor(lifeRatio);

      ROLE_UPDATERS[p.role](p, lifeRatio, this.elapsed, dt);
    }
  }
}
