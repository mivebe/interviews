import { gsap } from 'gsap';
import { Container, FederatedPointerEvent, Sprite, Texture } from 'pixi.js';
import { BUTTON } from './config';

const { pressScale, pressDuration, releaseDuration } = BUTTON;

export class SpinButton extends Container {
    private readonly _sprite: Sprite;

    private _enabled = true;
    private _hovered = false;
    private _pressed = false;

    onPress: (() => void) | null = null;

    constructor() {
        super();

        this._sprite = new Sprite({ texture: Texture.from('spin_btn_normal'), anchor: 0.5 });
        this.addChild(this._sprite);

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointerover', this._onPointerOver, this);
        this.on('pointerout', this._onPointerOut, this);
        this.on('pointerdown', this._onPointerDown, this);
        this.on('pointerup', this._onPointerUp, this);
        this.on('pointerupoutside', this._onPointerUpOutside, this);

        this._refresh();
    }

    get enabled(): boolean {
        return this._enabled;
    }

    setEnabled(enabled: boolean): void {
        if (this._enabled === enabled) {
            return;
        }

        this._enabled = enabled;
        this.cursor = enabled ? 'pointer' : 'default';

        if (!enabled) {
            this._pressed = false;
            this._hovered = false;
        }

        this._refresh();
    }

    private _onPointerOver(): void {
        this._hovered = true;
        this._refresh();
    }

    private _onPointerOut(): void {
        this._hovered = false;
        this._pressed = false;
        this._refresh();
    }

    private _onPointerDown(event: FederatedPointerEvent): void {
        if (!this._enabled || event.button !== 0) {
            return;
        }
        this._pressed = true;
        this._refresh();
    }

    private _onPointerUp(): void {
        const wasPressed = this._pressed;
        this._pressed = false;
        this._refresh();

        if (wasPressed && this._enabled) {
            this.onPress?.();
        }
    }

    private _onPointerUpOutside(): void {
        this._pressed = false;
        this._hovered = false;
        this._refresh();
    }

    private _refresh(): void {
        this._sprite.texture = Texture.from(this._textureAlias());

        const targetScale = this._pressed ? pressScale : 1;
        if (this.scale.x === targetScale) {
            return;
        }

        gsap.to(this.scale, {
            x: targetScale,
            y: targetScale,
            duration: this._pressed ? pressDuration : releaseDuration,
            ease: this._pressed ? 'power2.out' : 'back.out(3)',
            overwrite: true
        });
    }

    private _textureAlias(): string {
        if (!this._enabled) {
            return 'spin_btn_disabled';
        }
        if (this._pressed) {
            return 'spin_btn_down';
        }
        if (this._hovered) {
            return 'spin_btn_over';
        }
        return 'spin_btn_normal';
    }
}
