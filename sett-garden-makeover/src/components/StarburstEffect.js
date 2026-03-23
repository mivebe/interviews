import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';
import { localToScreen } from '../utils.js';

export class StarburstEffect {
  constructor(effectsLayer, camera, renderer) {
    this.effectsLayer = effectsLayer;
    this.camera = camera;
    this.renderer = renderer;
    this.starTexture = this._createStarTexture();
  }

  _createStarTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    grad.addColorStop(0, 'rgba(255, 240, 120, 1)');
    grad.addColorStop(0.3, 'rgba(255, 210, 60, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 180, 30, 0.3)');
    grad.addColorStop(1, 'rgba(255, 160, 20, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    const spikes = 4;
    const outerR = size / 2 - 2;
    const innerR = outerR * 0.3;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = 'screen';
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 3);
    glowGrad.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
    glowGrad.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, size, size);

    return Texture.from(canvas);
  }

  play(parent, position, radius = 2.5, count = 10) {
    const screen = localToScreen(parent, position, this.camera, this.renderer);
    const zoom = this.camera.zoom;
    const pxRadius = radius * zoom;

    const sprites = [];

    for (let i = 0; i < count; i++) {
      const s = new Sprite(this.starTexture);
      s.anchor.set(0.5);
      s.x = screen.x;
      s.y = screen.y;
      s.scale.set(0);
      s.alpha = 1;
      s.blendMode = 'add';
      this.effectsLayer.addChild(s);
      sprites.push(s);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        for (const s of sprites) {
          this.effectsLayer.removeChild(s);
          s.destroy();
        }
      },
    });

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = pxRadius * (0.7 + Math.random() * 0.6);
      const targetX = screen.x + Math.cos(angle) * r;
      const targetY = screen.y - Math.sin(angle) * r * 0.5 - (Math.random() - 0.3) * pxRadius * 0.5;

      const s = sprites[i];
      const delay = i * 0.025;
      const particleScale = 0.5 + Math.random() * 0.5;

      tl.to(s.scale, { x: particleScale, y: particleScale, duration: 0.2, ease: 'back.out(2)' }, delay);
      tl.to(s, { x: targetX, y: targetY, duration: 0.5, ease: 'power2.out' }, delay);
      tl.to(s, { alpha: 0, duration: 0.3, ease: 'sine.in' }, delay + 0.3);
      tl.to(s.scale, { x: 0, y: 0, duration: 0.2, ease: 'sine.in' }, delay + 0.4);
    }
  }
}
