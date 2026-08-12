import { GRID, SPIN, SymbolId } from '../src/config';
import { ReelStrip } from '../src/ReelStrip';
import { assert, assertEqual, test } from './assert';

const { rowCount, cellHeight } = GRID;
const { maxSpeed, stopDuration } = SPIN;

function column(...symbols: string[]): SymbolId[] {
    return symbols as SymbolId[];
}

function fillerSequence(): () => SymbolId {
    let index = 0;
    return () => `low${(index++ % 4) + 1}` as SymbolId;
}

function landAfterSpin(target: readonly SymbolId[], startCells: number, speed: number): ReelStrip {
    const strip = new ReelStrip(fillerSequence());
    strip.scrollTo(startCells);

    const recycles = Math.ceil((speed * stopDuration) / (2 * cellHeight));
    const targetCells = strip.queueLanding(target, recycles);

    const startFrom = strip.cellsScrolled;
    const steps = 40;
    for (let step = 1; step <= steps; step++) {
        strip.scrollTo(startFrom + (targetCells - startFrom) * (step / steps));
    }

    return strip;
}

test('a fresh strip exposes exactly the visible rows', () => {
    const strip = new ReelStrip(fillerSequence());
    assertEqual(strip.visibleSymbols.length, rowCount, 'visible symbol count');
});

test('setVisibleSymbols places the column in the window', () => {
    const strip = new ReelStrip(fillerSequence());
    strip.setVisibleSymbols(column('high1', 'high2', 'high3'));
    assertEqual(strip.visibleSymbols, ['high1', 'high2', 'high3'], 'visible column');
});

test('a stop sequence lands exactly on the requested column', () => {
    const strip = landAfterSpin(column('high1', 'low2', 'high3'), 12.37, maxSpeed);
    assertEqual(strip.visibleSymbols, ['high1', 'low2', 'high3'], 'landed column');
});

test('landing is exact from any starting fraction', () => {
    for (let i = 0; i < 100; i++) {
        const startCells = i * 0.37 + i * 3;
        const strip = landAfterSpin(column('low4', 'high2', 'low1'), startCells, maxSpeed);
        assertEqual(strip.visibleSymbols, ['low4', 'high2', 'low1'], `landed column from ${startCells}`);
    }
});

test('landing is exact across a range of stop speeds', () => {
    for (let speed = maxSpeed * 0.5; speed <= maxSpeed * 1.5; speed += 137) {
        const strip = landAfterSpin(column('high3', 'high3', 'low3'), 5.5, speed);
        assertEqual(strip.visibleSymbols, ['high3', 'high3', 'low3'], `landed column at speed ${speed}`);
    }
});

test('the strip comes to rest aligned to a whole cell', () => {
    const strip = landAfterSpin(column('high1', 'high1', 'high1'), 9.81, maxSpeed);
    assert(Math.abs(strip.cellFraction) < 1e-9, `cell fraction was ${strip.cellFraction}`);
});

test('scrolling forward keeps the window full', () => {
    const strip = new ReelStrip(fillerSequence());
    strip.scrollTo(57.4);
    assertEqual(strip.visibleSymbols.length, rowCount, 'visible symbol count while spinning');
    assert(
        strip.visibleSymbols.every((symbolId) => typeof symbolId === 'string' && symbolId.length > 0),
        'every visible slot holds a symbol'
    );
});
