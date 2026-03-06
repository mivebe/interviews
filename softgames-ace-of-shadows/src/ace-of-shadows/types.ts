import { Sprite } from 'pixi.js';

export interface FlyingCard {
  sprite: Sprite;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  elapsed: number;
  targetStack: 'left' | 'right';
}

export interface PipPos {
  x: number;
  y: number;
  flip?: boolean;
}

export interface PipGrid {
  centerX: number;
  leftCol: number;
  rightCol: number;
  topEdge: number;
  topInner: number;
  topMid: number;
  middle: number;
  bottomEdge: number;
  bottomInner: number;
  bottomMid: number;
}
