import { BlurFilter, Container } from 'pixi.js';
import { CELL, SPIN, SymbolId } from './config';
import { ReelStrip, SLOT_COUNT, TOP_BUFFER_SLOTS } from './ReelStrip';
import { SymbolView } from './SymbolView';
import { clamp01, easeInQuad, easeOutQuad } from './utils/Easing';

const WIND_UP_DURATION = 0.18;
const WIND_UP_DISTANCE = 26;
const BOUNCE_DURATION = 0.34;
const MOTION_BLUR_MAX_STRENGTH = 5;
const MOTION_BLUR_MIN_SPEED = 250;

export enum ReelState {
    Idle = 'idle',
    WindingUp = 'winding-up',
    Spinning = 'spinning',
    Stopping = 'stopping',
    Bouncing = 'bouncing'
}

export class Reel extends Container {
    private readonly _strip = new ReelStrip();
    private readonly _views: SymbolView[] = [];
    private readonly _motionBlur = new BlurFilter({ strength: 0, quality: 2 });
    private _motionBlurActive = false;

    private _state = ReelState.Idle;
    private _speed = 0;
    private _elapsed = 0;
    private _stopDuration = 0;
    private _stopStartCells = 0;
    private _stopTargetCells = 0;
    private _verticalOffset = 0;

    constructor() {
        super();

        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            const view = new SymbolView(this._strip.symbolAt(slot));
            view.x = CELL.width * 0.5;
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
        this._strip.setVisibleSymbols(column);
        this._state = ReelState.Idle;
        this._speed = 0;
        this._verticalOffset = 0;
        this._syncViews();
    }

    startSpin(): void {
        this._strip.clearFeed();
        this._state = ReelState.WindingUp;
        this._elapsed = 0;
        this._speed = 0;
    }

    requestStop(column: readonly SymbolId[]): void {
        if (this._state !== ReelState.Spinning && this._state !== ReelState.WindingUp) {
            return;
        }

        const speed = Math.max(this._speed, SPIN.maxSpeed * 0.5);
        const recycles = Math.ceil((speed * SPIN.stopDuration) / (2 * CELL.height));

        this._stopStartCells = this._strip.cellsScrolled;
        this._stopTargetCells = this._strip.queueLanding(column, recycles);
        this._stopDuration = (2 * (this._stopTargetCells - this._stopStartCells) * CELL.height) / speed;
        this._speed = speed;
        this._elapsed = 0;
        this._state = ReelState.Stopping;
    }

    update(deltaSeconds: number): void {
        switch (this._state) {
            case ReelState.WindingUp:
                this._updateWindUp(deltaSeconds);
                break;
            case ReelState.Spinning:
                this._strip.scrollTo(this._strip.cellsScrolled + (this._speed * deltaSeconds) / CELL.height);
                break;
            case ReelState.Stopping:
                this._updateStopping(deltaSeconds);
                break;
            case ReelState.Bouncing:
                this._updateBounce(deltaSeconds);
                break;
            case ReelState.Idle:
                break;
        }

        this._syncViews();
        this._syncMotionBlur();

        for (const view of this._views) {
            view.update(deltaSeconds);
        }
    }

    resetPresentation(): void {
        for (const view of this._views) {
            view.resetPresentation();
        }
    }

    private _syncMotionBlur(): void {
        const shouldBlur = this._speed > MOTION_BLUR_MIN_SPEED;

        if (shouldBlur) {
            this._motionBlur.strengthX = 0;
            this._motionBlur.strengthY =
                MOTION_BLUR_MAX_STRENGTH * Math.min(this._speed / SPIN.maxSpeed, 1);
        }

        if (shouldBlur !== this._motionBlurActive) {
            this._motionBlurActive = shouldBlur;
            this.filters = shouldBlur ? [this._motionBlur] : [];
        }
    }

    private _updateWindUp(deltaSeconds: number): void {
        this._elapsed += deltaSeconds;

        const windUpProgress = clamp01(this._elapsed / WIND_UP_DURATION);
        this._verticalOffset = -WIND_UP_DISTANCE * Math.sin(windUpProgress * Math.PI);

        const accelerationProgress = clamp01(this._elapsed / SPIN.accelerationDuration);
        this._speed = SPIN.maxSpeed * easeInQuad(accelerationProgress);
        this._strip.scrollTo(this._strip.cellsScrolled + (this._speed * deltaSeconds) / CELL.height);

        if (accelerationProgress >= 1) {
            this._verticalOffset = 0;
            this._state = ReelState.Spinning;
        }
    }

    private _updateStopping(deltaSeconds: number): void {
        this._elapsed += deltaSeconds;

        const progress = clamp01(this._elapsed / this._stopDuration);

        if (progress >= 1) {
            this._strip.scrollTo(this._stopTargetCells);
            this._speed = 0;
            this._elapsed = 0;
            this._state = ReelState.Bouncing;
            return;
        }

        this._strip.scrollTo(
            this._stopStartCells + (this._stopTargetCells - this._stopStartCells) * easeOutQuad(progress)
        );
    }

    private _updateBounce(deltaSeconds: number): void {
        this._elapsed += deltaSeconds;

        const progress = clamp01(this._elapsed / BOUNCE_DURATION);
        this._verticalOffset =
            SPIN.bounceOvershoot * Math.sin(progress * Math.PI) * (1 - easeOutQuad(progress));

        if (progress >= 1) {
            this._verticalOffset = 0;
            this._state = ReelState.Idle;
        }
    }

    private _syncViews(): void {
        const fraction = this._strip.cellFraction;

        for (let slot = 0; slot < SLOT_COUNT; slot++) {
            const view = this._views[slot];
            view.setSymbol(this._strip.symbolAt(slot));
            view.y =
                (slot - TOP_BUFFER_SLOTS + fraction) * CELL.height + CELL.height * 0.5 + this._verticalOffset;
        }
    }
}
