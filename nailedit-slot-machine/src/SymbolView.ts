import { gsap } from 'gsap';
import { Container, Sprite, Texture } from 'pixi.js';
import { SymbolId, WIN_PRESENTATION } from './config';

const { bumpScale, bumpDuration, dimAlpha, dimDuration, fadeOutDuration } = WIN_PRESENTATION;

export class SymbolView extends Container {
    private readonly _sprite: Sprite;
    private _symbolId: SymbolId;
    private _bump: GSAPTween | null = null;
    private _highlighted = false;
    private _dimmed = false;

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
        this._bump?.kill();
        this._bump = null;

        if (!highlighted) {
            gsap.to(this.scale, { x: 1, y: 1, duration: dimDuration, ease: 'power1.out', overwrite: true });
            return;
        }

        this._bump = gsap.to(this.scale, {
            x: bumpScale,
            y: bumpScale,
            duration: bumpDuration * 0.5,
            ease: 'sine.out',
            yoyo: true,
            repeat: -1,
            overwrite: true
        });
    }

    setDimmed(dimmed: boolean): void {
        if (this._dimmed === dimmed) {
            return;
        }

        this._dimmed = dimmed;
        gsap.to(this, {
            alpha: dimmed ? dimAlpha : 1,
            duration: dimDuration,
            ease: 'power1.out',
            overwrite: true
        });
    }

    clearPresentation(): void {
        this._highlighted = false;
        this._dimmed = false;
        this._bump?.kill();
        this._bump = null;

        gsap.to(this, { alpha: 1, duration: fadeOutDuration, ease: 'power1.out', overwrite: true });
        gsap.to(this.scale, { x: 1, y: 1, duration: fadeOutDuration, ease: 'power1.out', overwrite: true });
    }
}
