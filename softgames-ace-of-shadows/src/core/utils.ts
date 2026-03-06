import { DESIGN_WIDTH, DESIGN_HEIGHT } from './constants';
import { ScreenInfo } from './types';

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function getScreenInfo(viewWidth: number, viewHeight: number): ScreenInfo {
  const scale = Math.min(viewWidth / DESIGN_WIDTH, viewHeight / DESIGN_HEIGHT);
  return {
    scale,
    width: viewWidth,
    height: viewHeight,
    centerX: viewWidth / 2,
    centerY: viewHeight / 2,
  };
}
