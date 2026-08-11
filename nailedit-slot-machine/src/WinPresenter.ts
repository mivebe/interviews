import { gsap } from 'gsap';
import { Container, Text } from 'pixi.js';
import { GRID, WIN_PRESENTATION } from './config';
import { Machine } from './Machine';
import { Win } from './WinEvaluator';

const { rowCount, width, height } = GRID;
const {
    bumpDuration,
    bumpsPerWin,
    pauseBetweenWins,
    allWinsHoldDuration,
    fadeInDuration,
    fadeOutDuration,
    labelOffsetY,
    labelPopScale,
    labelPopDuration
} = WIN_PRESENTATION;

interface PresentationStep {
    wins: Win[];
    duration: number;
}

export class WinPresenter extends Container {
    private readonly _machine: Machine;
    private readonly _label: Text;

    private _timeline: GSAPTimeline | null = null;
    private _visible = false;

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
        this._label.position.set(width * 0.5, height + labelOffsetY);
        this._label.alpha = 0;
        this._label.visible = false;
        this.addChild(this._label);
    }

    get isVisible(): boolean {
        return this._visible;
    }

    play(wins: readonly Win[]): void {
        this._timeline?.kill();
        this._timeline = null;

        if (wins.length === 0) {
            return;
        }

        const steps: PresentationStep[] = [{ wins: [...wins], duration: allWinsHoldDuration }];

        if (wins.length > 1) {
            for (const win of wins) {
                steps.push({
                    wins: [win],
                    duration: bumpDuration * bumpsPerWin + pauseBetweenWins
                });
            }
        }

        const timeline = gsap.timeline({ repeat: -1 });
        for (const step of steps) {
            timeline.call(() => this._applyStep(step)).to({}, { duration: step.duration });
        }

        this._timeline = timeline;
        this._visible = true;
        this._label.visible = true;

        gsap.to(this._label, {
            alpha: 1,
            duration: fadeInDuration,
            ease: 'power1.out',
            overwrite: true
        });
    }

    hide(): void {
        this._timeline?.kill();
        this._timeline = null;

        if (!this._visible) {
            return;
        }

        for (const reel of this._machine.reels) {
            reel.clearPresentation();
        }

        gsap.to(this._label, {
            alpha: 0,
            duration: fadeOutDuration,
            ease: 'power1.in',
            overwrite: true,
            onComplete: () => {
                this._label.visible = false;
                this._visible = false;
            }
        });
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
            for (let row = 0; row < rowCount; row++) {
                const isWinning = highlighted.has(`${reel}:${row}`);
                const view = reels[reel].getVisibleView(row);
                view.setHighlighted(isWinning);
                view.setDimmed(!isWinning);
            }
        }

        this._label.text = WinPresenter._describe(step.wins);
        gsap.fromTo(
            this._label.scale,
            { x: labelPopScale, y: labelPopScale },
            { x: 1, y: 1, duration: labelPopDuration, ease: 'back.out(2.4)', overwrite: true }
        );
    }

    private static _describe(wins: readonly Win[]): string {
        if (wins.length === 1) {
            const { reelCount, ways } = wins[0];
            return `${reelCount} OF A KIND  -  ${ways === 1 ? '1 WAY' : `${ways} WAYS`}`;
        }

        const totalWays = wins.reduce((sum, win) => sum + win.ways, 0);
        return `${wins.length} WINS  -  ${totalWays} WAYS`;
    }
}
