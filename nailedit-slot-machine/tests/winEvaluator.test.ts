import { SymbolId } from '../src/config';
import { Grid } from '../src/Grid';
import { WinEvaluator } from '../src/WinEvaluator';
import { assertEqual, test } from './assert';

const SEVEN: SymbolId = 'high1';
const BAR: SymbolId = 'low4';
const GEM: SymbolId = 'low1';
const CHERRY: SymbolId = 'low3';

function grid(...reels: SymbolId[][]): Grid {
    return reels;
}

function summarise(win: { symbolId: SymbolId; reelCount: number; ways: number; cells: unknown[] }) {
    return {
        symbolId: win.symbolId,
        reelCount: win.reelCount,
        ways: win.ways,
        cellCount: win.cells.length
    };
}

test('README board 1 pays the seven across three reels', () => {
    const board = grid(
        [BAR, SEVEN, GEM],
        [SEVEN, SEVEN, GEM],
        [BAR, BAR, SEVEN],
        [BAR, BAR, GEM],
        [GEM, BAR, BAR]
    );

    assertEqual(WinEvaluator.evaluate(board).map(summarise), [
        { symbolId: SEVEN, reelCount: 3, ways: 2, cellCount: 4 }
    ], 'board 1 wins');
});

test('README board 1 pays the exact winning positions', () => {
    const board = grid(
        [BAR, SEVEN, GEM],
        [SEVEN, SEVEN, GEM],
        [BAR, BAR, SEVEN],
        [BAR, BAR, GEM],
        [GEM, BAR, BAR]
    );

    assertEqual(WinEvaluator.evaluate(board)[0].cells, [
        { reel: 0, row: 1 },
        { reel: 1, row: 0 },
        { reel: 1, row: 1 },
        { reel: 2, row: 2 }
    ], 'board 1 winning cells');
});

test('README board 2 pays two symbols at once', () => {
    const PURPLE: SymbolId = 'low2';
    const board = grid(
        [BAR, SEVEN, PURPLE],
        [SEVEN, SEVEN, PURPLE],
        [BAR, PURPLE, SEVEN],
        [BAR, BAR, PURPLE],
        [PURPLE, BAR, BAR]
    );

    assertEqual(WinEvaluator.evaluate(board).map(summarise), [
        { symbolId: PURPLE, reelCount: 5, ways: 1, cellCount: 5 },
        { symbolId: SEVEN, reelCount: 3, ways: 2, cellCount: 4 }
    ], 'board 2 wins');
});

test('a symbol on only two consecutive reels does not pay', () => {
    const board = grid(
        [SEVEN, BAR, GEM],
        [SEVEN, BAR, GEM],
        [CHERRY, CHERRY, CHERRY],
        [BAR, BAR, BAR],
        [GEM, GEM, GEM]
    );

    assertEqual(WinEvaluator.evaluate(board), [], 'no wins');
});

test('a run that skips the first reel does not pay', () => {
    const board = grid(
        [BAR, BAR, BAR],
        [SEVEN, GEM, GEM],
        [SEVEN, GEM, GEM],
        [SEVEN, GEM, GEM],
        [SEVEN, CHERRY, CHERRY]
    );

    assertEqual(
        WinEvaluator.evaluate(board).map((win) => win.symbolId),
        [],
        'four consecutive reels starting at reel 2 pay nothing'
    );
});

test('a full board of one symbol pays every way', () => {
    const board = grid(
        [SEVEN, SEVEN, SEVEN],
        [SEVEN, SEVEN, SEVEN],
        [SEVEN, SEVEN, SEVEN],
        [SEVEN, SEVEN, SEVEN],
        [SEVEN, SEVEN, SEVEN]
    );

    assertEqual(WinEvaluator.evaluate(board).map(summarise), [
        { symbolId: SEVEN, reelCount: 5, ways: 243, cellCount: 15 }
    ], 'full board win');
});

test('position within a reel never matters', () => {
    const top = grid(
        [SEVEN, BAR, BAR],
        [SEVEN, BAR, BAR],
        [SEVEN, BAR, BAR],
        [GEM, GEM, GEM],
        [GEM, GEM, GEM]
    );
    const scattered = grid(
        [BAR, BAR, SEVEN],
        [SEVEN, BAR, BAR],
        [BAR, SEVEN, BAR],
        [GEM, GEM, GEM],
        [GEM, GEM, GEM]
    );

    assertEqual(
        WinEvaluator.evaluate(top).map(summarise),
        WinEvaluator.evaluate(scattered).map(summarise),
        'staggered positions pay the same as aligned ones'
    );
});

test('wins are ordered by reel count then ways', () => {
    const board = grid(
        [SEVEN, GEM, BAR],
        [SEVEN, GEM, BAR],
        [SEVEN, GEM, BAR],
        [GEM, GEM, GEM],
        [CHERRY, CHERRY, CHERRY]
    );

    assertEqual(
        WinEvaluator.evaluate(board).map((win) => win.symbolId),
        [GEM, SEVEN, BAR],
        'win ordering'
    );
});

test('ways multiply across reels', () => {
    const board = grid(
        [SEVEN, SEVEN, BAR],
        [SEVEN, SEVEN, SEVEN],
        [SEVEN, BAR, BAR],
        [GEM, GEM, GEM],
        [GEM, GEM, GEM]
    );

    assertEqual(WinEvaluator.evaluate(board).map(summarise), [
        { symbolId: SEVEN, reelCount: 3, ways: 6, cellCount: 6 }
    ], 'ways product');
});
