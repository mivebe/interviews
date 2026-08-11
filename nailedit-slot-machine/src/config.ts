export const SCREEN = {
    width: 1920,
    height: 1080
} as const;

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;

export const SYMBOL_IDS = ['high1', 'high2', 'high3', 'low1', 'low2', 'low3', 'low4'] as const;

export type SymbolId = (typeof SYMBOL_IDS)[number];

export const REEL_WINDOW = {
    offsetX: 56,
    offsetY: 57,
    width: 998,
    height: 576
} as const;

export const CELL = {
    width: REEL_WINDOW.width / REEL_COUNT,
    height: REEL_WINDOW.height / ROW_COUNT
} as const;

export const SPIN = {
    maxSpeed: 3600,
    accelerationDuration: 0.22,
    startStagger: 0.07,
    minSpinDuration: 0.8,
    stopStagger: 0.17,
    stopDuration: 0.42,
    bounceOvershoot: 34
} as const;

export const WIN_PRESENTATION = {
    minWinLength: 3,
    bumpScale: 1.16,
    bumpDuration: 0.42,
    bumpsPerWin: 2,
    dimAlpha: 0.35,
    pauseBetweenWins: 0.18,
    allWinsHoldDuration: 1.1
} as const;

export const BUTTON_POSITION = {
    x: SCREEN.width * 0.85,
    y: SCREEN.height * 0.85
} as const;
