import { Container, Graphics } from 'pixi.js';
import { GRID, SPIN } from './config';
import { Grid } from './Grid';
import { Reel } from './Reel';
import { restartTimeline } from './utils';

const { reelCount, cellWidth, width, height } = GRID;
const { startStagger, minSpinDuration, stopStagger } = SPIN;

export class Machine extends Container {
    private readonly _reels: Reel[] = [];

    private _schedule: GSAPTimeline | null = null;
    private _allStopsRequested = false;
    private _spinning = false;

    constructor() {
        super();

        const reelLayer = new Container();
        this.addChild(reelLayer);

        for (let reelIndex = 0; reelIndex < reelCount; reelIndex++) {
            const reel = new Reel();
            reel.x = reelIndex * cellWidth;
            this._reels.push(reel);
            reelLayer.addChild(reel);
        }

        const windowMask = new Graphics().rect(0, 0, width, height).fill(0xffffff);
        this.addChild(windowMask);
        reelLayer.mask = windowMask;
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

        this._spinning = true;
        this._allStopsRequested = false;

        const schedule = restartTimeline(this._schedule, {
            onComplete: () => {
                this._allStopsRequested = true;
            }
        });

        this._reels.forEach((reel, reelIndex) => {
            schedule
                .call(() => reel.startSpin(), undefined, reelIndex * startStagger)
                .call(
                    () => reel.requestStop(grid[reelIndex]),
                    undefined,
                    minSpinDuration + reelIndex * stopStagger
                );
        });

        this._schedule = schedule;
    }

    update(deltaSeconds: number): void {
        for (const reel of this._reels) {
            reel.update(deltaSeconds);
        }

        if (this._spinning && this._allStopsRequested && this._reels.every((reel) => reel.isAtRest)) {
            this._spinning = false;
        }
    }
}
