import { Container, Sprite, Texture } from 'pixi.js';
import { SymbolId, WIN_PRESENTATION } from './config';
import { bumpPulse } from './utils/Easing';

export class SymbolView extends Container {
    private readonly _sprite: Sprite;
    private _symbolId: SymbolId;
    private _highlighted = false;
    private _bumpElapsed = 0;

    constructor(symbolId: SymbolId) {
        super();

        this._sprite = new Sprite({ texture: Texture.from(symbolId), anchor: 0.5 });
        this.addChild(this._sprite);

        this._symbolId = symbolId;
    }

    get symbolId(): SymbolId {
        return this._symbolId;
    }

    setSymbol(symbolId: SymbolId): void {
        if (this._symbolId === symbolId) {
            return;
        }
        this._symbolId = symbolId;
        this._sprite.texture = Texture.from(symbolId);
    }

    setHighlighted(highlighted: boolean): void {
        if (this._highlighted === highlighted) {
            return;
        }

        this._highlighted = highlighted;
        this._bumpElapsed = 0;

        if (!highlighted) {
            this.scale.set(1);
        }
    }

    setDimmed(dimmed: boolean): void {
        this.alpha = dimmed ? WIN_PRESENTATION.dimAlpha : 1;
    }

    resetPresentation(): void {
        this.setHighlighted(false);
        this.setDimmed(false);
    }

    update(deltaSeconds: number): void {
        if (!this._highlighted) {
            return;
        }

        this._bumpElapsed += deltaSeconds;

        const phase = (this._bumpElapsed % WIN_PRESENTATION.bumpDuration) / WIN_PRESENTATION.bumpDuration;
        this.scale.set(1 + (WIN_PRESENTATION.bumpScale - 1) * bumpPulse(phase));
    }
}
