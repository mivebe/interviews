import { GRID, SYMBOL_IDS, SymbolId } from './config';

const { reelCount, rowCount } = GRID;

export type Grid = SymbolId[][];

export function isSymbolId(value: string): value is SymbolId {
    return (SYMBOL_IDS as readonly string[]).includes(value);
}

export function toGrid(outcome: string[][]): Grid {
    if (outcome.length !== reelCount) {
        throw new Error(`Outcome must contain ${reelCount} reels, received ${outcome.length}`);
    }

    return outcome.map((column, reelIndex) => {
        if (column.length !== rowCount) {
            throw new Error(
                `Reel ${reelIndex} must contain ${rowCount} symbols, received ${column.length}`
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
