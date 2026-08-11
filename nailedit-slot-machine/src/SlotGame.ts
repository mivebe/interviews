import { toGrid } from './Grid';
import { Machine } from './Machine';
import { Outcome } from './Outcome';
import { SpinButton } from './SpinButton';
import { Win, WinEvaluator } from './WinEvaluator';
import { WinPresenter } from './WinPresenter';

export enum GameState {
    Idle = 'idle',
    Clearing = 'clearing',
    Spinning = 'spinning',
    Evaluating = 'evaluating',
    Presenting = 'presenting'
}

export class SlotGame {
    private readonly _machine: Machine;
    private readonly _spinButton: SpinButton;
    private readonly _winPresenter: WinPresenter;

    private _state = GameState.Idle;
    private _wins: Win[] = [];

    constructor(machine: Machine, spinButton: SpinButton, winPresenter: WinPresenter) {
        this._machine = machine;
        this._spinButton = spinButton;
        this._winPresenter = winPresenter;
        this._spinButton.onPress = () => this.requestSpin();
        this._enterState(GameState.Idle);
    }

    get state(): GameState {
        return this._state;
    }

    get wins(): readonly Win[] {
        return this._wins;
    }

    requestSpin(): void {
        if (this._state === GameState.Idle) {
            this._enterState(GameState.Spinning);
            return;
        }

        if (this._state === GameState.Presenting) {
            this._enterState(GameState.Clearing);
        }
    }

    update(deltaSeconds: number): void {
        this._machine.update(deltaSeconds);

        switch (this._state) {
            case GameState.Clearing:
                if (!this._winPresenter.isVisible) {
                    this._enterState(GameState.Spinning);
                }
                break;
            case GameState.Spinning:
                if (!this._machine.isSpinning) {
                    this._enterState(GameState.Evaluating);
                }
                break;
            case GameState.Evaluating:
                this._wins = WinEvaluator.evaluate(this._machine.visibleGrid);
                this._enterState(this._wins.length > 0 ? GameState.Presenting : GameState.Idle);
                break;
            case GameState.Presenting:
                break;
            case GameState.Idle:
                break;
        }
    }

    private _enterState(state: GameState): void {
        this._state = state;

        switch (state) {
            case GameState.Idle:
                this._spinButton.setEnabled(true);
                break;
            case GameState.Clearing:
                this._spinButton.setEnabled(false);
                this._winPresenter.hide();
                break;
            case GameState.Spinning:
                this._wins = [];
                this._spinButton.setEnabled(false);
                this._machine.spin(toGrid(Outcome.resolve()));
                break;
            case GameState.Evaluating:
                break;
            case GameState.Presenting:
                this._winPresenter.play(this._wins);
                this._spinButton.setEnabled(true);
                break;
        }
    }
}
