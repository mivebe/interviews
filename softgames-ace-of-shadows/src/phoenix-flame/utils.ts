import { Texture } from 'pixi.js';

/** Create a soft radial gradient texture using an offscreen Canvas */
export function createSoftCircleTexture(size: number): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return Texture.from(canvas);
}

/** Smoothly interpolate a fire color based on life ratio (1=new, 0=dead) */
export function fireColor(lifeRatio: number): number {
  // White-yellow -> orange -> red -> dark red
  let r: number, g: number, b: number;
  if (lifeRatio > 0.7) {
    // White-hot core: interpolate white -> bright yellow
    const t = (lifeRatio - 0.7) / 0.3;
    r = 255;
    g = Math.round(255 - t * 0 + (1 - t) * 0); // stays 255
    b = Math.round(t * 200 + (1 - t) * 50);
  } else if (lifeRatio > 0.4) {
    // Yellow -> orange
    const t = (lifeRatio - 0.4) / 0.3;
    r = 255;
    g = Math.round(t * 220 + (1 - t) * 100);
    b = Math.round(t * 50 + (1 - t) * 0);
  } else {
    // Orange-red -> dark red
    const t = lifeRatio / 0.4;
    r = Math.round(t * 255 + (1 - t) * 80);
    g = Math.round(t * 80 + (1 - t) * 10);
    b = 0;
  }
  return (r << 16) | (g << 8) | b;
}
