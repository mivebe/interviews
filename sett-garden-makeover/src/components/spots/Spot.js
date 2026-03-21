import { Group, Sprite, SpriteMaterial, TextureLoader, SRGBColorSpace } from 'three';
import gsap from 'gsap';
import { ASSETS } from '../../core/assetManifest.js';
import { fadeOut } from '../../utils.js';

export class Spot {
  constructor(config, models, effects) {
    this.config = config;
    this.group = new Group();
    this.group.position.set(...config.position);
    this.completed = false;
    this.currentItem = null;
    this.itemObjects = {}; // { name: { objects: [Group], mixers: [AnimationMixer] } }
    this.mixers = [];
    this.effects = effects || {};

    this._pendingCalls = [];

    this.initBase(models);
    this.initItems(models);
    this.initLabel();
  }

  initBase(models) {
    if (!this.config.baseModel) return;
    const gltf = models[this.config.baseModel];
    const base = gltf.scene.clone(true);
    base.scale.multiplyScalar(this.config.baseScale || 1);
    if (this.config.baseRotY) base.rotateY(this.config.baseRotY);
    if (this.config.baseOffset) base.position.set(...this.config.baseOffset);

    base.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    this.group.add(base);
  }

  initItems(models) {}

  initLabel() {
    const textureLoader = new TextureLoader();
    const plusTex = textureLoader.load(ASSETS.images.plus);
    plusTex.colorSpace = SRGBColorSpace;
    this.plusSprite = new Sprite(new SpriteMaterial({ map: plusTex, depthWrite: true }));
    this.plusSprite.scale.set(0, 0, 0);
    this.plusSprite.position.set(...this.config.labelOffset);
    this.plusSprite.layers.enable(1);
    this.plusSprite.userData.spot = this;
    this.group.add(this.plusSprite);

    const checkTexture = textureLoader.load(ASSETS.images.checkmark);
    checkTexture.colorSpace = SRGBColorSpace;
    this.checkSprite = new Sprite(new SpriteMaterial({ map: checkTexture, depthWrite: true }));
    this.checkSprite.scale.set(0, 0, 0);
    this.checkSprite.position.set(...this.config.labelOffset);
    this.group.add(this.checkSprite);
  }

  showPlus() {
    if (this.completed) return;
    gsap.to(this.plusSprite.scale, { x: 3, y: 3, z: 3, duration: 0.3, ease: 'back.out(2)' });
  }

  hidePlus() {
    gsap.to(this.plusSprite.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: 'sine.in' });
  }

  showCheck() {
    this.plusSprite.scale.set(0, 0, 0);
    this.plusSprite.layers.disable(1);
    gsap.to(this.checkSprite.scale, { x: 3, y: 3, z: 3, duration: 0.3, ease: 'back.out(2)' });
  }

  _delayedCall(delay, fn) {
    const call = gsap.delayedCall(delay, () => {
      const idx = this._pendingCalls.indexOf(call);
      if (idx !== -1) this._pendingCalls.splice(idx, 1);
      fn();
    });
    this._pendingCalls.push(call);
    return call;
  }

  _killPendingCalls() {
    for (const call of this._pendingCalls) call.kill();
    this._pendingCalls.length = 0;
  }

  showItem(name) {
    this._killPendingCalls();
    this.hideAllItems();
    this.currentItem = name;
    const item = this.itemObjects[name];
    if (!item) return;
    this._showItemImpl(item);
  }

  _showItemImpl(item) {}

  hideAllItems() {
    this._killPendingCalls();
    for (const item of Object.values(this.itemObjects)) {
      for (const obj of item.objects) {
        gsap.killTweensOf(obj.scale);
        fadeOut(obj);
      }
    }
    this.currentItem = null;
  }

  confirmItem(name) {
    const item = this.itemObjects[name];
    if (!item) return;
    this._confirmItemImpl(item);
    this.completed = true;
    this.showCheck();
  }

  _confirmItemImpl(item) {}

  updateMixers() {
    for (const { mixer, speed } of this.mixers) {
      mixer.update(speed);
    }
  }
}
