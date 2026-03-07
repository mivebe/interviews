import { Application, Graphics, Sprite, Text, Texture, Ticker } from 'pixi.js';
import { Scene } from '../core/Scene';
import { BackButton } from '../core/BackButton';
import { ParticleEmitter } from './ParticleEmitter';
import { ScreenInfo } from '../core/types';

export class PhoenixFlameScene extends Scene {
  private emitter: ParticleEmitter | null = null;
  private ambientGlow: Sprite | null = null;
  private ground: Graphics | null = null;
  private titleText!: Text;
  private hintText!: Text;
  private back!: BackButton;
  private tickerFn: ((ticker: Ticker) => void) | null = null;
  private elapsed = 0;
  private screen: ScreenInfo = { scale: 1, width: 960, height: 540, centerX: 480, centerY: 270 };

  constructor(private app: Application, goBack: () => void) {
    super(goBack);
  }

  onStart(): void {
    // Ambient glow (rendered first, behind everything)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const ctx = glowCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 100, 20, 0.4)');
    gradient.addColorStop(0.4, 'rgba(255, 60, 10, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    this.ambientGlow = new Sprite(Texture.from(glowCanvas));
    this.ambientGlow.anchor.set(0.5);
    this.ambientGlow.blendMode = 'add';
    this.addChild(this.ambientGlow);

    // Ground reflection
    this.ground = new Graphics();
    this.addChild(this.ground);

    // Particle emitter
    this.emitter = new ParticleEmitter();
    this.addChild(this.emitter);

    // UI on top of fire
    this.back = new BackButton(() => this.goBack());
    this.addChild(this.back);

    this.titleText = new Text({
      text: 'Phoenix Flame',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0xf58840,
      },
    });
    this.titleText.anchor.set(0.5, 0);
    this.addChild(this.titleText);

    this.hintText = new Text({
      text: 'Move mouse / touch to control the flame',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 13,
        fill: 0x888899,
      },
    });
    this.hintText.anchor.set(0.5, 0);
    this.addChild(this.hintText);

    // Interactive
    this.eventMode = 'static';
    this.hitArea = { contains: () => true };
    this.on('pointermove', e => {
      if (this.emitter) {
        const local = this.toLocal(e.global);
        this.emitter.emitterX = local.x;
        this.emitter.emitterY = local.y;
        if (this.ambientGlow) {
          this.ambientGlow.position.set(local.x, local.y);
        }
      }
    });

    this.tickerFn = (ticker: Ticker) => {
      const dt = ticker.deltaMS / 1000;
      this.elapsed += dt;
      this.emitter?.update(dt);

      if (this.ambientGlow) {
        const s = this.screen.scale;
        const flicker = 2.8 * s + Math.sin(this.elapsed * 6) * 0.2 * s + Math.sin(this.elapsed * 13) * 0.1 * s;
        this.ambientGlow.scale.set(flicker);
        this.ambientGlow.alpha = 0.6 + Math.sin(this.elapsed * 8) * 0.1;
      }
    };
    this.app.ticker.add(this.tickerFn);
  }

  onDestroy(): void {
    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    this.emitter = null;
    this.ambientGlow = null;
    this.ground = null;
  }

  onResize(screen: ScreenInfo): void {
    this.screen = screen;
    const s = screen.scale;

    this.back.rebuild(s, screen.width);

    const isMobile = screen.width < 600;

    this.titleText.position.set(screen.centerX, 20 * s);
    this.titleText.style.fontSize = Math.round(isMobile ? screen.width * 0.07 : 28 * s);

    this.hintText.position.set(screen.centerX, isMobile ? 20 * s + screen.width * 0.08 : 54 * s);
    this.hintText.style.fontSize = Math.round(isMobile ? screen.width * 0.035 : 13 * s);

    if (isMobile) {
      this.back.position.set(16 * s * 3, this.hintText.y + this.hintText.height + 8 * s);
    }

    const fireY = screen.height - 80 * s;

    if (this.ambientGlow) {
      this.ambientGlow.position.set(screen.centerX, fireY);
      this.ambientGlow.scale.set(2.8 * s);
    }

    if (this.ground) {
      this.ground.clear();
      this.ground.ellipse(screen.centerX, screen.height - 30 * s, 100 * s, 15 * s);
      this.ground.fill({ color: 0xff4400, alpha: 0.08 });
    }

    if (this.emitter) {
      this.emitter.emitterX = screen.centerX;
      this.emitter.emitterY = fireY;
      this.emitter.scale.set(s);
    }
  }
}
