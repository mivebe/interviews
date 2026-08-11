import { gsap } from 'gsap';
import { BlurFilter, Container } from 'pixi.js';
import { GRID, SPIN, SymbolId } from './config';
import { ReelStrip, SLOT_COUNT, TOP_BUFFER_SLOTS } from './ReelStrip';
import { SymbolView } from './SymbolView';

const { cellWidth, cellHeight } = GRID;
const {
    maxSpeed,
    accelerationDuration,
    stopDuration,
    windUpDuration,
    windUpDistance,
    bounceOvershoot,
    bounceDuration,
    blurMaxStrength,
    blurMinSpeed
} = SPIN;

export enum ReelState {
    Idle = 'idle',
    Spinning = 'spinning',
    Stopping = 'stopping',
    Bouncing = 'bouncing'
}

export class Reel extends Container {
    private readonly _strip = new ReelStrip();
    private readonly _views: SymbolView[] = [];
    private readonly _motionBlur = new BlurFilter({ strength: 0, quality: 2 });
    private readonly _motion = { cells: 0, speed: 0, offsetY: 0 };

    private _timeline: GSAPTimeline = gsap.timeline();
    private _state = ReelState.Idle;
    private _motionBlurActive = false;

    constructor() {
        super();

        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            const view = new SymbolView(this._strip.symbolAt(slot));
            view.x = cellWidth * 0.5;
            this._views.push(view);
            this.addChild(view);
        }

        this._syncViews();
    }

    get state(): ReelState {
        return this._state;
    }

    get isAtRest(): boolean {
        return this._state === ReelState.Idle;
    }

    get visibleSymbols(): SymbolId[] {
        return this._strip.visibleSymbols;
    }

    getVisibleView(row: number): SymbolView {
        return this._views[TOP_BUFFER_SLOTS + row];
    }

    setVisibleSymbols(column: readonly SymbolId[]): void {
        this._timeline.kill();
        this._strip.setVisibleSymbols(column);
        this._state = ReelState.Idle;
        this._motion.cells = 0;
        this._motion.speed = 0;
        this._motion.offsetY = 0;
        this._syncViews();
    }

    startSpin(): void {
        this._strip.clearFeed();
        this._state = ReelState.Spinning;
        this._motion.speed = 0;
        this._motion.offsetY = 0;

        this._restartTimeline()
            .to(this._motion, { speed: maxSpeed, duration: accelerationDuration, ease: 'power1.in' }, 0)
            .to(
                this._motion,
                {
                    offsetY: -windUpDistance,
                    duration: windUpDuration * 0.5,
                    ease: 'sine.out',
                    yoyo: true,
                    repeat: 1
                },
                0
            );
    }

    requestStop(column: readonly SymbolId[]): void {
        if (this._state !== ReelState.Spinning) {
            return;
        }

        const speed = Math.max(this._motion.speed, maxSpeed * 0.5);
        const recycles = Math.ceil((speed * stopDuration) / (2 * cellHeight));
        const startCells = this._strip.cellsScrolled;
        const targetCells = this._strip.queueLanding(column, recycles);

        this._state = ReelState.Stopping;
        this._motion.cells = startCells;

        this._restartTimeline()
            .to(this._motion, {
                cells: targetCells,
                duration: (2 * (targetCells - startCells) * cellHeight) / speed,
                ease: 'power1.out'
            })
            .call(() => {
                this._state = ReelState.Bouncing;
            })
            .fromTo(
                this._motion,
                { offsetY: bounceOvershoot },
                { offsetY: 0, duration: bounceDuration, ease: 'elastic.out(1, 0.45)' }
            )
            .call(() => {
                this._state = ReelState.Idle;
            });
    }

    update(deltaSeconds: number): void {
        const previousCells = this._strip.cellsScrolled;

        if (this._state === ReelState.Spinning) {
            this._motion.cells += (this._motion.speed * deltaSeconds) / cellHeight;
        }

        this._strip.scrollTo(this._motion.cells);
        this._syncViews();

        const travelled = (this._strip.cellsScrolled - previousCells) * cellHeight;
        this._syncMotionBlur(deltaSeconds > 0 ? travelled / deltaSeconds : 0);
    }

    clearPresentation(): void {
        for (const view of this._views) {
            view.clearPresentation();
        }
    }

    private _restartTimeline(): GSAPTimeline {
        this._timeline.kill();
        this._timeline = gsap.timeline();
        return this._timeline;
    }

    private _syncMotionBlur(speed: number): void {
        const shouldBlur = speed > blurMinSpeed;

        if (shouldBlur) {
            this._motionBlur.strengthX = 0;
            this._motionBlur.strengthY = blurMaxStrength * gsap.utils.clamp(0, 1, speed / maxSpeed);
        }

        if (shouldBlur !== this._motionBlurActive) {
            this._motionBlurActive = shouldBlur;
            this.filters = shouldBlur ? [this._motionBlur] : [];
        }
    }

    private _syncViews(): void {
        const fraction = this._strip.cellFraction;
        const { offsetY } = this._motion;

        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            const view = this._views[slot];
            view.setSymbol(this._strip.symbolAt(slot));
            view.y = (slot - TOP_BUFFER_SLOTS + fraction) * cellHeight + cellHeight * 0.5 + offsetY;
        }
    }
}
