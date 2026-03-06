import { PipGrid, PipPos } from './types';

/** Core card properties: base dimensions, texture scale, and font */
export const CARD = {
  width: 100,
  height: 140,
  texScale: 3,
  font: 'Georgia, "Times New Roman", serif',
} as const;

/** Pre-computed texture-space dimensions (base * texScale) */
export const CARD_TEX = {
  w: CARD.width * CARD.texScale,
  h: CARD.height * CARD.texScale,
  s: CARD.texScale,
} as const;

/** All sizing/positioning values for drawing card elements (multiplied by `s` at render time) */
export const CARD_LAYOUT = {
  borderRadius: 8,
  innerPadding: 5,
  corner: { x: 11, rankFontSize: 14, suitFontSize: 11, rankY: 6, suitY: 21 },
  face: { fontSize: 32, decoSize: 8, decoOffsetX: 16, decoOffsetY: 20 },
  ace: { fontSize: 36 },
  pip: { fontSize: 13, colOffset: 12, edgeOffset: 20, innerOffset: 32 },
} as const;

/** Scene-level animation and stacking config */
export const CARD_ANIMATION = {
  stackOffset: 1.5,
  count: 144,
  moveInterval: 1,
  moveDuration: 2,
  arcHeight: 80,
  maxRotation: 0.15,
} as const;

export const SUITS = [
  { symbol: '♠', color: 0x1a1a2e, name: 'spades' },
  { symbol: '♥', color: 0xcc1111, name: 'hearts' },
  { symbol: '♦', color: 0xcc1111, name: 'diamonds' },
  { symbol: '♣', color: 0x1a1a2e, name: 'clubs' },
];

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const PIP_LAYOUTS: Record<number | 'default', (g: PipGrid) => PipPos[]> = {
  2: ({ centerX, topEdge, bottomEdge }) => [
    { x: centerX, y: topEdge },
    { x: centerX, y: bottomEdge, flip: true },
  ],
  3: ({ centerX, topEdge, middle, bottomEdge }) => [
    { x: centerX, y: topEdge },
    { x: centerX, y: middle },
    { x: centerX, y: bottomEdge, flip: true },
  ],
  4: ({ leftCol, rightCol, topEdge, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  5: ({ centerX, leftCol, rightCol, topEdge, middle, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: centerX, y: middle },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  6: ({ leftCol, rightCol, topEdge, middle, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: leftCol, y: middle },
    { x: rightCol, y: middle },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  7: ({ centerX, leftCol, rightCol, topEdge, topInner, middle, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: centerX, y: topInner },
    { x: leftCol, y: middle },
    { x: rightCol, y: middle },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  8: ({ centerX, leftCol, rightCol, topEdge, topInner, middle, bottomInner, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: centerX, y: topInner },
    { x: leftCol, y: middle },
    { x: rightCol, y: middle },
    { x: centerX, y: bottomInner, flip: true },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  9: ({ centerX, leftCol, rightCol, topEdge, topMid, middle, bottomMid, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: leftCol, y: topMid },
    { x: rightCol, y: topMid },
    { x: centerX, y: middle },
    { x: leftCol, y: bottomMid, flip: true },
    { x: rightCol, y: bottomMid, flip: true },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  10: ({ centerX, leftCol, rightCol, topEdge, topInner, topMid, bottomMid, bottomInner, bottomEdge }) => [
    { x: leftCol, y: topEdge },
    { x: rightCol, y: topEdge },
    { x: centerX, y: topInner },
    { x: leftCol, y: topMid },
    { x: rightCol, y: topMid },
    { x: leftCol, y: bottomMid, flip: true },
    { x: rightCol, y: bottomMid, flip: true },
    { x: centerX, y: bottomInner, flip: true },
    { x: leftCol, y: bottomEdge, flip: true },
    { x: rightCol, y: bottomEdge, flip: true },
  ],
  default: ({ centerX, middle }) => [{ x: centerX, y: middle }],
};
