import { Container, Graphics } from 'pixi.js';
import { CELL, REEL_COUNT, REEL_WINDOW, SPIN } from './config';
import { Grid, toGrid } from './Grid';
import { Outcome } from './Outcome';
import { Reel } from './Reel';

export class Machine extends Container {
    private readonly _reels: Reel[] = [];
    private readonly _started: boolean[] = [];
    private readonly _stopRequested: boolean[] = [];

    private _pendingGrid: Grid | null = null;
    private _elapsed = 0;
    private _spinning = false;

    constructor() {
        super();

        const reelLayer = new Container();
        this.addChild(reelLayer);

        for (let reelIndex = 0; reelIndex < REEL_COUNT; reelIndex++) {
            const reel = new Reel();
            reel.x = reelIndex * CELL.width;
            this._reels.push(reel);
            this._started.push(false);
            this._stopRequested.push(false);
            reelLayer.addChild(reel);
        }

        const windowMask = new Graphics().rect(0, 0, REEL_WINDOW.width, REEL_WINDOW.height).fill(0xffffff);
        this.addChild(windowMask);
        reelLayer.mask = windowMask;

        this.showGrid(toGrid(Outcome.resolve()));
    }

    get reels(): readonly Reel[] {
        return this._reels;
    }

    get isSpinning(): boolean {
        return this._spinning;
    }

    get visibleGrid(): Grid {
        return this._reels.map((reel) => reel.visibleSymbols);
    }

    showGrid(grid: Grid): void {
        for (let reelIndex = 0; reelIndex < this._reels.length; reelIndex++) {
            this._reels[reelIndex].setVisibleSymbols(grid[reelIndex]);
        }
    }

    spin(grid: Grid): void {
        if (this._spinning) {
            return;
        }

        this._pendingGrid = grid;
        this._elapsed = 0;
        this._spinning = true;
        this._started.fill(false);
        this._stopRequested.fill(false);
    }

    update(deltaSeconds: number): void {
        if (this._spinning) {
            this._elapsed += deltaSeconds;
            this._updateSpinSchedule();
        }

        for (const reel of this._reels) {
            reel.update(deltaSeconds);
        }

        if (this._spinning && this._stopRequested.every(Boolean) && this._reels.every((reel) => reel.isAtRest)) {
            this._spinning = false;
            this._pendingGrid = null;
        }
    }

    private _updateSpinSchedule(): void {
        for (let reelIndex = 0; reelIndex < this._reels.length; reelIndex++) {
            if (!this._started[reelIndex] && this._elapsed >= reelIndex * SPIN.startStagger) {
                this._reels[reelIndex].startSpin();
                this._started[reelIndex] = true;
            }

            const stopAt = SPIN.minSpinDuration + reelIndex * SPIN.stopStagger;
            if (this._started[reelIndex] && !this._stopRequested[reelIndex] && this._elapsed >= stopAt) {
                this._reels[reelIndex].requestStop(this._pendingGrid![reelIndex]);
                this._stopRequested[reelIndex] = true;
            }
        }
    }
}
