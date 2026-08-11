import { GRID, randomSymbolId, SymbolId } from './config';

const { rowCount } = GRID;

export const SLOT_COUNT = rowCount + 2;
export const TOP_BUFFER_SLOTS = 1;
export const MIN_STOP_RECYCLES = rowCount + 1;

export class ReelStrip {
    private readonly _slots: SymbolId[] = [];
    private readonly _feed: SymbolId[] = [];
    private _cellsScrolled = 0;

    constructor(createSymbol: () => SymbolId = randomSymbolId) {
        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            this._slots.push(createSymbol());
        }
    }

    get cellsScrolled(): number {
        return this._cellsScrolled;
    }

    get cellFraction(): number {
        return this._cellsScrolled - Math.floor(this._cellsScrolled);
    }

    get visibleSymbols(): SymbolId[] {
        return this._slots.slice(TOP_BUFFER_SLOTS, TOP_BUFFER_SLOTS + rowCount);
    }

    symbolAt(slot: number): SymbolId {
        return this._slots[slot];
    }

    setVisibleSymbols(column: readonly SymbolId[], createSymbol: () => SymbolId = randomSymbolId): void {
        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            const row = slot - TOP_BUFFER_SLOTS;
            this._slots[slot] = row >= 0 && row < column.length ? column[row] : createSymbol();
        }
        this._feed.length = 0;
        this._cellsScrolled = 0;
    }

    clearFeed(): void {
        this._feed.length = 0;
    }

    queueLanding(
        column: readonly SymbolId[],
        recycles: number,
        createSymbol: () => SymbolId = randomSymbolId
    ): number {
        const total = Math.max(MIN_STOP_RECYCLES, recycles);

        this._feed.length = 0;
        for (let i = 0; i < total; i++) {
            this._feed.push(createSymbol());
        }
        for (let row = 0; row < column.length; row++) {
            this._feed[total - 2 - row] = column[row];
        }

        return Math.floor(this._cellsScrolled) + total;
    }

    scrollTo(targetCells: number, createSymbol: () => SymbolId = randomSymbolId): void {
        let recycles = Math.floor(targetCells) - Math.floor(this._cellsScrolled);
        while (recycles > 0) {
            this._slots.pop();
            this._slots.unshift(this._feed.shift() ?? createSymbol());
            recycles--;
        }
        this._cellsScrolled = targetCells;
    }
}
