import { Container, Sprite, Graphics } from 'pixi.js';
import gsap from 'gsap';
import { vmin } from '../utils';

export class UI {
  constructor(game, pixiApp, textures) {
    this.game = game;
    this.app = pixiApp;
    this.textures = textures;
    this.selectedItem = null;
    this.pulseTween = null;

    // Intro
    this.introContainer = new Container();
    this.introContainer.visible = false;
    this.introSprite = new Sprite(textures.intro);
    this.introSprite.anchor.set(0.5);
    this.introContainer.addChild(this.introSprite);
    pixiApp.stage.addChild(this.introContainer);

    // Selection UI
    this.selectionContainer = new Container();
    this.selectionContainer.visible = false;

    this.iconsContainer = new Container();
    this.selectionContainer.addChild(this.iconsContainer);

    this.buttonsContainer = new Container();
    this.selectionContainer.addChild(this.buttonsContainer);

    this.btnReturn = new Sprite(textures.arrow);
    this.btnReturn.anchor.set(0.5);
    this.btnReturn.eventMode = 'static';
    this.btnReturn.cursor = 'pointer';
    this.btnReturn.on('pointerdown', () => this.onReturn());
    this.buttonsContainer.addChild(this.btnReturn);

    this.btnConfirm = new Sprite(textures.checkmark);
    this.btnConfirm.anchor.set(0.5);
    this.btnConfirm.eventMode = 'static';
    this.btnConfirm.cursor = 'pointer';
    this.btnConfirm.visible = false;
    this.btnConfirm.on('pointerdown', () => this.onConfirm());
    this.buttonsContainer.addChild(this.btnConfirm);

    pixiApp.stage.addChild(this.selectionContainer);

    // Packshot
    this.packshotContainer = new Container();
    this.packshotContainer.visible = false;

    this.packshotBlocker = new Graphics();
    this.packshotBlocker.eventMode = 'static';
    this.packshotContainer.addChild(this.packshotBlocker);

    this.logoSprite = new Sprite(textures.logo);
    this.logoSprite.anchor.set(0.5);
    this.packshotContainer.addChild(this.logoSprite);

    this.ctaSprite = new Sprite(textures.play);
    this.ctaSprite.anchor.set(0.5);
    this.ctaSprite.eventMode = 'static';
    this.ctaSprite.cursor = 'pointer';
    this.ctaSprite.on('pointerdown', () => this.onCTA());
    this.packshotContainer.addChild(this.ctaSprite);

    pixiApp.stage.addChild(this.packshotContainer);

    // Sound Toggle
    this.soundToggle = new Sprite(textures.soundOn);
    this.soundToggle.anchor.set(1, 0);
    this.soundToggle.eventMode = 'static';
    this.soundToggle.cursor = 'pointer';
    this.soundToggle.on('pointerdown', () => this.onSoundToggle());
    pixiApp.stage.addChild(this.soundToggle);

    this._layout();
  }

  _layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Intro
    this.introSprite.x = w / 2;
    this.introSprite.y = h / 2;
    const introMaxW = w * 0.7;
    const introMaxH = h * 0.5;
    const introTex = this.textures.intro;
    const introScale = Math.min(introMaxW / introTex.width, introMaxH / introTex.height);
    this.introSprite.scale.set(introScale);

    // Selection - position at bottom center
    const selX = w / 2;
    const selY = h * 0.92;
    this._layoutSelection(selX, selY);

    // Packshot
    this.packshotBlocker.clear();
    this.packshotBlocker.rect(0, 0, w, h).fill({ color: 0x000000, alpha: 0.001 });

    this.logoSprite.x = w / 2;
    this.logoSprite.y = h * 0.38;
    const logoMaxW = w * 0.5;
    const logoMaxH = h * 0.3;
    const logoTex = this.textures.logo;
    const logoScale = Math.min(logoMaxW / logoTex.width, logoMaxH / logoTex.height);
    this.logoSprite.scale.set(logoScale);

    this.ctaSprite.x = w / 2;
    this.ctaSprite.y = this.logoSprite.y + logoMaxH * 0.5 + vmin(4);
    const ctaMaxW = w * 0.35;
    const ctaMaxH = h * 0.15;
    const ctaTex = this.textures.play;
    const ctaScale = Math.min(ctaMaxW / ctaTex.width, ctaMaxH / ctaTex.height);
    this.ctaSprite.scale.set(ctaScale);

    // Sound toggle
    this.soundToggle.x = w - vmin(2);
    this.soundToggle.y = vmin(2);
    const toggleSize = vmin(8);
    const toggleTex = this.textures.soundOn;
    const toggleScale = toggleSize / Math.max(toggleTex.width, toggleTex.height);
    this.soundToggle.scale.set(toggleScale);
  }

  _layoutSelection(centerX, bottomY) {
    const slotSize = vmin(18);
    const gap = vmin(1.5);
    const slots = this.iconsContainer.children;
    const totalIconsH = slots.length * slotSize + Math.max(0, slots.length - 1) * gap;

    // Position icon slots vertically, bottom-aligned
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      slot.x = 0;
      slot.y = -totalIconsH + i * (slotSize + gap) + slotSize / 2;
      slot._baseX = slot.x;
    }

    this.iconsContainer.x = centerX;
    this.iconsContainer.y = bottomY - vmin(2) - vmin(10) - vmin(2);

    // Buttons below icons
    const btnH = vmin(10);
    const btnGap = vmin(2.5);

    this.buttonsContainer.x = centerX;
    this.buttonsContainer.y = bottomY - btnH / 2;

    const btnReturnTex = this.textures.arrow;
    const btnReturnScale = btnH / btnReturnTex.height;
    this.btnReturn.scale.set(btnReturnScale);

    const btnConfirmTex = this.textures.checkmark;
    const btnConfirmScale = btnH / btnConfirmTex.height;
    this.btnConfirm.scale.set(btnConfirmScale);

    if (this.btnConfirm.visible) {
      this.btnReturn.x = -btnGap / 2 - (btnReturnTex.width * btnReturnScale) / 2;
      this.btnConfirm.x = btnGap / 2 + (btnConfirmTex.width * btnConfirmScale) / 2;
    } else {
      this.btnReturn.x = 0;
    }
  }

  openSelection(spot) {
    this.selectedItem = null;
    if (this.pulseTween) { this.pulseTween.kill(); this.pulseTween = null; }
    this.btnConfirm.visible = false;
    this.iconsContainer.removeChildren();

    const slotSize = vmin(18);

    for (let i = 0; i < spot.config.items.length; i++) {
      const item = spot.config.items[i];
      const slot = new Container();
      slot.pivot.set(0, 0);
      slot._itemName = item.name;

      // Icon image (90% inset)
      const iconSize = slotSize * 0.9;
      const icon = new Sprite(this.textures[item.icon]);
      icon.anchor.set(0.5);
      const iconScale = iconSize / Math.max(icon.texture.width, icon.texture.height);
      icon.scale.set(iconScale);
      slot.addChild(icon);

      // Frame overlay
      const frame = new Sprite(this.textures.frame);
      frame.anchor.set(0.5);
      const frameScale = slotSize / Math.max(frame.texture.width, frame.texture.height);
      frame.scale.set(frameScale);
      frame.alpha = 0;
      slot.addChild(frame);

      slot.eventMode = 'static';
      slot.cursor = 'pointer';
      slot.on('pointerdown', () => this.onIconClick(spot, item, slot));
      slot.hitArea = { contains: (x, y) => Math.abs(x) <= slotSize / 2 && Math.abs(y) <= slotSize / 2 };

      this.iconsContainer.addChild(slot);

      // Stagger animate in
      slot.scale.set(0);
      slot.alpha = 0;
      gsap.to(slot, {
        alpha: 1, duration: 0.25,
        delay: 0.08 * i,
        ease: 'back.out(2)',
      });
      gsap.to(slot.scale, {
        x: 1, y: 1, duration: 0.25,
        delay: 0.08 * i,
        ease: 'back.out(2)',
      });
    }

    this._layoutSelection(window.innerWidth / 2, window.innerHeight * 0.92);

    this.selectionContainer.visible = true;
    this.selectionContainer.alpha = 0;
    gsap.to(this.selectionContainer, { alpha: 1, duration: 0.25 });
  }

  onIconClick(spot, item, slot) {
    this.game.helper.stop();

    // Deselect all
    for (const s of this.iconsContainer.children) {
      gsap.to(s, { x: s._baseX || 0, duration: 0.2, ease: 'sine.out' });
      gsap.to(s.scale, { x: 1, y: 1, duration: 0.2, ease: 'sine.out' });
      if (s.children[1]) gsap.to(s.children[1], { alpha: 0, duration: 0.15 });
    }

    // Select this slot
    gsap.to(slot, { x: (slot._baseX || 0) - vmin(2.5), duration: 0.2, ease: 'sine.out' });
    gsap.to(slot.scale, { x: 1.1, y: 1.1, duration: 0.2, ease: 'sine.out' });
    if (slot.children[1]) gsap.to(slot.children[1], { alpha: 1, duration: 0.15 });

    this.selectedItem = item.name;

    // Show confirm and reposition buttons
    this.btnConfirm.visible = true;
    this._repositionButtons();

    // Start pulse on confirm
    if (this.pulseTween) this.pulseTween.kill();
    this.btnConfirm.scale.set(this.btnReturn.scale.x);
    const baseScale = this.btnReturn.scale.x;
    this.pulseTween = gsap.to(this.btnConfirm.scale, {
      x: baseScale * 0.93, y: baseScale * 0.93,
      duration: 0.75, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });

    this.game.previewItem(spot, item.name);
  }

  _repositionButtons() {
    const btnH = vmin(10);
    const btnGap = vmin(2.5);
    const btnReturnTex = this.textures.arrow;
    const btnReturnScale = btnH / btnReturnTex.height;
    const btnConfirmTex = this.textures.checkmark;
    const btnConfirmScale = btnH / btnConfirmTex.height;

    if (this.btnConfirm.visible) {
      this.btnReturn.x = -btnGap / 2 - (btnReturnTex.width * btnReturnScale) / 2;
      this.btnConfirm.x = btnGap / 2 + (btnConfirmTex.width * btnConfirmScale) / 2;
    } else {
      this.btnReturn.x = 0;
    }
  }

  onReturn() {
    this.hideSelection();
    this.game.cancelSelection();
  }

  onConfirm() {
    if (!this.selectedItem) return;
    const name = this.selectedItem;
    this.hideSelection();
    this.game.confirmSelection(name);
  }

  hideSelection() {
    if (this.pulseTween) { this.pulseTween.kill(); this.pulseTween = null; }
    gsap.to(this.selectionContainer, {
      alpha: 0, duration: 0.2, ease: 'sine.in',
      onComplete: () => { this.selectionContainer.visible = false; },
    });
    this.selectedItem = null;
  }

  showIntro() {
    return new Promise((resolve) => {
      this.introContainer.visible = true;
      this.introSprite.alpha = 0;

      const baseScale = this.introSprite.scale.x;

      gsap.fromTo(this.introSprite, { alpha: 0 }, {
        alpha: 1, duration: 0.8, ease: 'sine.out',
      });
      gsap.fromTo(this.introSprite.scale,
        { x: baseScale * 0.8, y: baseScale * 0.8 },
        { x: baseScale, y: baseScale, duration: 0.8, ease: 'sine.out' },
      );
      gsap.to(this.introSprite, {
        alpha: 0, duration: 0.28, ease: 'sine.in', delay: 1.8,
        onComplete: () => {
          this.introContainer.visible = false;
          resolve();
        },
      });
    });
  }

  showPackShot() {
    this.packshotContainer.visible = true;
    this.logoSprite.alpha = 0;
    this.ctaSprite.alpha = 0;

    gsap.to(this.logoSprite, { alpha: 1, duration: 0.35 });
    gsap.to(this.ctaSprite, { alpha: 1, duration: 0.35, delay: 0.35 });

    // CTA pulse
    const baseScale = this.ctaSprite.scale.x;
    this.ctaPulseTween = gsap.to(this.ctaSprite.scale, {
      x: baseScale * 0.93, y: baseScale * 0.93,
      duration: 0.75, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
      delay: 0.7,
    });
  }

  onCTA() {
    this.game.audio.play('packshot');
  }

  onSoundToggle() {
    const muted = this.game.audio.toggleMute();
    this.soundToggle.texture = muted ? this.textures.soundOff : this.textures.soundOn;
  }
}
