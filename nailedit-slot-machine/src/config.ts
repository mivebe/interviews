import { gsap } from 'gsap';

export const SYMBOL_IDS = ['high1', 'high2', 'high3', 'low1', 'low2', 'low3', 'low4'] as const;

export type SymbolId = (typeof SYMBOL_IDS)[number];

export const randomSymbolId: () => SymbolId = gsap.utils.random([...SYMBOL_IDS], true);

export const MIN_WIN_REELS = 3;

const REEL_COUNT = 5;
const ROW_COUNT = 3;
const WINDOW_WIDTH = 998;
const WINDOW_HEIGHT = 576;

export const SCREEN = {
    width: 1920,
    height: 1080,
    maxFrameDelta: 0.1
} as const;

export const GRID = {
    reelCount: REEL_COUNT,
    rowCount: ROW_COUNT,
    offsetX: 56,
    offsetY: 57,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    cellWidth: WINDOW_WIDTH / REEL_COUNT,
    cellHeight: WINDOW_HEIGHT / ROW_COUNT
} as const;

export const SPIN = {
    maxSpeed: 3600,
    accelerationDuration: 0.22,
    startStagger: 0.07,
    minSpinDuration: 0.8,
    stopStagger: 0.17,
    stopDuration: 0.42,
    windUpDuration: 0.18,
    windUpDistance: 26,
    bounceOvershoot: 34,
    bounceDuration: 0.44,
    blurMaxStrength: 5,
    blurMinSpeed: 250
} as const;

export const WIN_PRESENTATION = {
    bumpScale: 1.16,
    bumpDuration: 0.42,
    bumpsPerWin: 2,
    dimAlpha: 0.35,
    dimDuration: 0.2,
    pauseBetweenWins: 0.18,
    allWinsHoldDuration: 1.1,
    fadeInDuration: 0.3,
    fadeOutDuration: 0.26,
    labelOffsetY: 62,
    labelPopScale: 0.82,
    labelPopDuration: 0.34
} as const;

export const BUTTON = {
    x: SCREEN.width * 0.85,
    y: SCREEN.height * 0.85,
    pressScale: 0.94,
    pressDuration: 0.08,
    releaseDuration: 0.32
} as const;


export const DEFAULT_EASE = 'power1.out';