import { Sprite } from 'pixi.js';
import gsap from 'gsap';
import { Vector3 } from 'three';
import { vmin, worldToScreen } from '../utils';

export class HelperCursor {
  constructor(pixiApp, textures) {
    this.sprite = new Sprite(textures.cursor);
    this.sprite.anchor.set(0.15, 0.10);
    this.sprite.alpha = 0;
    this._updateSize();
    pixiApp.stage.addChild(this.sprite);

    this.mode = null; // 'pluses' | 'selection'
    this.index = 0;
    this.delayCall = null;
    this.intervalCall = null;
    this.visible = false;

    // For pluses mode
    this.spots = null;
    this.camera = null;
    this.renderer = null;

    // For selection mode
    this.iconsContainer = null;
  }

  _updateSize() {
    const size = vmin(14);
    const tex = this.sprite.texture;
    const scale = size / Math.max(tex.width, tex.height);
    this.sprite.scale.set(scale);
  }

  startOnPluses(spots, camera, renderer) {
    this.stop();
    this.spots = spots;
    this.camera = camera;
    this.renderer = renderer;
    this.mode = 'pluses';
    this.index = 0;

    this.delayCall = gsap.delayedCall(0.5, () => {
      this.visible = true;
      this._updatePlusPosition();
      this._fadeIn();
      this.intervalCall = gsap.delayedCall(2.5, () => this._cyclePluses());
    });
  }

  startOnSelection(iconsContainer) {
    this.stop();
    this.mode = 'selection';
    this.iconsContainer = iconsContainer;
    this.index = 0;

    this.delayCall = gsap.delayedCall(0.5, () => {
      this.visible = true;
      this._updateSelectionPosition();
      this._fadeIn();
      this.intervalCall = gsap.delayedCall(3.5, () => this._cycleSelection());
    });
  }

  stop() {
    if (this.delayCall) { this.delayCall.kill(); this.delayCall = null; }
    if (this.intervalCall) { this.intervalCall.kill(); this.intervalCall = null; }
    gsap.killTweensOf(this.sprite);
    gsap.killTweensOf(this.sprite.scale);
    if (this.visible) {
      this._fadeOut();
    }
    this.visible = false;
    this.mode = null;
  }

  _fadeIn() {
    const baseScale = vmin(14) / Math.max(this.sprite.texture.width, this.sprite.texture.height);
    gsap.fromTo(this.sprite,
      { alpha: 0 },
      { alpha: 1, duration: 0.3, ease: 'sine.out' },
    );
    gsap.fromTo(this.sprite.scale,
      { x: baseScale * 1.4, y: baseScale * 1.4 },
      { x: baseScale, y: baseScale, duration: 0.3, ease: 'sine.out' },
    );
  }

  _fadeOut(onComplete) {
    const baseScale = vmin(14) / Math.max(this.sprite.texture.width, this.sprite.texture.height);
    gsap.to(this.sprite, {
      alpha: 0, duration: 0.2, ease: 'sine.in',
      onComplete,
    });
    gsap.to(this.sprite.scale, {
      x: baseScale * 1.4, y: baseScale * 1.4, duration: 0.2, ease: 'sine.in',
    });
  }

  // Called every frame from Game.update()
  update(camera, renderer) {
    if (this.mode !== 'pluses' || !this.visible) return;
    this.camera = camera;
    this.renderer = renderer;
    this._positionOverPlus();
  }

  _getActivePlusSpots() {
    if (!this.spots) return [];
    return this.spots.filter(s => !s.completed);
  }

  _cyclePluses() {
    const active = this._getActivePlusSpots();
    if (active.length === 0) { this.stop(); return; }
    this._fadeOut(() => {
      this.index = (this.index + 1) % active.length;
      this._updatePlusPosition();
      this._fadeIn();
    });
    this.intervalCall = gsap.delayedCall(2.5, () => this._cyclePluses());
  }

  _updatePlusPosition() {
    const active = this._getActivePlusSpots();
    if (active.length === 0) { this.stop(); return; }
    this.index = this.index % active.length;
    this._positionOverPlus();
  }

  _positionOverPlus() {
    const active = this._getActivePlusSpots();
    if (active.length === 0) return;
    const spot = active[this.index % active.length];
    const worldPos = new Vector3();
    spot.plusSprite.getWorldPosition(worldPos);

    const { x, y } = worldToScreen(worldPos, this.camera, this.renderer);
    this.sprite.x = x;
    this.sprite.y = y;
  }

  _cycleSelection() {
    const slots = this.iconsContainer ? this.iconsContainer.children : [];
    if (slots.length === 0) { this.stop(); return; }
    this._fadeOut(() => {
      this.index = (this.index + 1) % slots.length;
      this._updateSelectionPosition();
      this._fadeIn();
    });
    this.intervalCall = gsap.delayedCall(3.5, () => this._cycleSelection());
  }

  _updateSelectionPosition() {
    const slots = this.iconsContainer ? this.iconsContainer.children : [];
    if (slots.length === 0) { this.stop(); return; }
    this.index = this.index % slots.length;
    const slot = slots[this.index];
    const pos = slot.getGlobalPosition();
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
  }
}
