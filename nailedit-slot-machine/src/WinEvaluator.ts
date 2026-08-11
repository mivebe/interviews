import { SYMBOL_IDS, SymbolId, WIN_PRESENTATION } from './config';
import { Grid } from './Grid';

export interface WinCell {
    reel: number;
    row: number;
}

export interface Win {
    symbolId: SymbolId;
    reelCount: number;
    ways: number;
    cells: WinCell[];
}

export class WinEvaluator {
    static evaluate(grid: Grid): Win[] {
        const wins: Win[] = [];

        for (const symbolId of SYMBOL_IDS) {
            const win = WinEvaluator._evaluateSymbol(grid, symbolId);
            if (win) {
                wins.push(win);
            }
        }

        return wins.sort((a, b) => b.reelCount - a.reelCount || b.ways - a.ways);
    }

    private static _evaluateSymbol(grid: Grid, symbolId: SymbolId): Win | null {
        const cells: WinCell[] = [];
        let reelCount = 0;
        let ways = 1;

        for (let reel = 0; reel < grid.length; reel++) {
            const matchingRows: number[] = [];

            for (let row = 0; row < grid[reel].length; row++) {
                if (grid[reel][row] === symbolId) {
                    matchingRows.push(row);
                }
            }

            if (matchingRows.length === 0) {
                break;
            }

            reelCount++;
            ways *= matchingRows.length;
            for (const row of matchingRows) {
                cells.push({ reel, row });
            }
        }

        if (reelCount < WIN_PRESENTATION.minWinLength) {
            return null;
        }

        return { symbolId, reelCount, ways, cells };
    }
}
