import { Container, FederatedPointerEvent, Sprite, Texture } from 'pixi.js';
import { clamp01, easeOutQuad } from './utils/Easing';

const PRESS_SCALE = 0.94;
const PRESS_RECOVERY_DURATION = 0.16;

export class SpinButton extends Container {
    private readonly _sprite: Sprite;

    private _enabled = true;
    private _hovered = false;
    private _pressed = false;
    private _pressRecovery = 1;

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

        this._refreshTexture();
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

        this._refreshTexture();
    }

    update(deltaSeconds: number): void {
        if (this._pressed) {
            this._pressRecovery = 0;
            this.scale.set(PRESS_SCALE);
            return;
        }

        if (this._pressRecovery >= 1) {
            return;
        }

        this._pressRecovery = clamp01(this._pressRecovery + deltaSeconds / PRESS_RECOVERY_DURATION);
        this.scale.set(PRESS_SCALE + (1 - PRESS_SCALE) * easeOutQuad(this._pressRecovery));
    }

    private _onPointerOver(): void {
        this._hovered = true;
        this._refreshTexture();
    }

    private _onPointerOut(): void {
        this._hovered = false;
        this._pressed = false;
        this._refreshTexture();
    }

    private _onPointerDown(event: FederatedPointerEvent): void {
        if (!this._enabled || event.button !== 0) {
            return;
        }
        this._pressed = true;
        this._refreshTexture();
    }

    private _onPointerUp(): void {
        const wasPressed = this._pressed;
        this._pressed = false;
        this._refreshTexture();

        if (wasPressed && this._enabled) {
            this.onPress?.();
        }
    }

    private _onPointerUpOutside(): void {
        this._pressed = false;
        this._hovered = false;
        this._refreshTexture();
    }

    private _refreshTexture(): void {
        this._sprite.texture = Texture.from(this._textureAlias());
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
