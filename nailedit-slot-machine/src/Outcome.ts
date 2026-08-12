import { GRID, randomSymbolId } from './config';

export class Outcome {
    static resolve(): string[][] {
        return Array.from({ length: GRID.reelCount }, () =>
            Array.from({ length: GRID.rowCount }, () => randomSymbolId())
        );
    }
}
