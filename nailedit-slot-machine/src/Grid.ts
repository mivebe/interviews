import { REEL_COUNT, ROW_COUNT, SYMBOL_IDS, SymbolId } from './config';

export type Grid = SymbolId[][];

export function isSymbolId(value: string): value is SymbolId {
    return (SYMBOL_IDS as readonly string[]).includes(value);
}

export function toGrid(outcome: string[][]): Grid {
    if (outcome.length !== REEL_COUNT) {
        throw new Error(`Outcome must contain ${REEL_COUNT} reels, received ${outcome.length}`);
    }

    return outcome.map((column, reelIndex) => {
        if (column.length !== ROW_COUNT) {
            throw new Error(
                `Reel ${reelIndex} must contain ${ROW_COUNT} symbols, received ${column.length}`
            );
        }
        return column.map((symbolId) => {
            if (!isSymbolId(symbolId)) {
                throw new Error(`Reel ${reelIndex} contains an unknown symbol "${symbolId}"`);
            }
            return symbolId;
        });
    });
}
