import { Container, Text } from 'pixi.js';
import { REEL_WINDOW, ROW_COUNT, WIN_PRESENTATION } from './config';
import { Machine } from './Machine';
import { Win } from './WinEvaluator';

interface PresentationStep {
    wins: Win[];
    duration: number;
}

export class WinPresenter extends Container {
    private readonly _machine: Machine;
    private readonly _label: Text;

    private _steps: PresentationStep[] = [];
    private _stepIndex = 0;
    private _stepElapsed = 0;
    private _playing = false;

    constructor(machine: Machine) {
        super();

        this._machine = machine;

        this._label = new Text({
            text: '',
            style: {
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 46,
                fontWeight: 'bold',
                fill: 0xffe27a,
                stroke: { color: 0x3a1200, width: 6, join: 'round' },
                align: 'center'
            }
        });
        this._label.anchor.set(0.5);
        this._label.position.set(REEL_WINDOW.width * 0.5, REEL_WINDOW.height + 62);
        this._label.visible = false;
        this.addChild(this._label);
    }

    get isPlaying(): boolean {
        return this._playing;
    }

    play(wins: readonly Win[]): void {
        this.stop();

        if (wins.length === 0) {
            return;
        }

        this._steps = [{ wins: [...wins], duration: WIN_PRESENTATION.allWinsHoldDuration }];

        if (wins.length > 1) {
            for (const win of wins) {
                this._steps.push({
                    wins: [win],
                    duration:
                        WIN_PRESENTATION.bumpDuration * WIN_PRESENTATION.bumpsPerWin +
                        WIN_PRESENTATION.pauseBetweenWins
                });
            }
        }

        this._stepIndex = 0;
        this._stepElapsed = 0;
        this._playing = true;
        this._applyStep(this._steps[0]);
    }

    stop(): void {
        this._steps = [];
        this._stepIndex = 0;
        this._stepElapsed = 0;
        this._playing = false;
        this._label.visible = false;

        for (const reel of this._machine.reels) {
            reel.resetPresentation();
        }
    }

    update(deltaSeconds: number): void {
        if (!this._playing) {
            return;
        }

        this._stepElapsed += deltaSeconds;

        if (this._stepElapsed < this._steps[this._stepIndex].duration) {
            return;
        }

        this._stepIndex++;
        this._stepElapsed = 0;

        if (this._stepIndex >= this._steps.length) {
            this.stop();
            return;
        }

        this._applyStep(this._steps[this._stepIndex]);
    }

    private _applyStep(step: PresentationStep): void {
        const highlighted = new Set<string>();
        for (const win of step.wins) {
            for (const cell of win.cells) {
                highlighted.add(`${cell.reel}:${cell.row}`);
            }
        }

        const reels = this._machine.reels;
        for (let reel = 0; reel < reels.length; reel++) {
            for (let row = 0; row < ROW_COUNT; row++) {
                const isWinning = highlighted.has(`${reel}:${row}`);
                const view = reels[reel].getVisibleView(row);
                view.setHighlighted(isWinning);
                view.setDimmed(!isWinning);
            }
        }

        this._label.text = WinPresenter._describe(step.wins);
        this._label.visible = true;
    }

    private static _describe(wins: readonly Win[]): string {
        if (wins.length === 1) {
            const win = wins[0];
            const ways = win.ways === 1 ? '1 WAY' : `${win.ways} WAYS`;
            return `${win.reelCount} OF A KIND  -  ${ways}`;
        }

        const totalWays = wins.reduce((sum, win) => sum + win.ways, 0);
        return `${wins.length} WINS  -  ${totalWays} WAYS`;
    }
}
