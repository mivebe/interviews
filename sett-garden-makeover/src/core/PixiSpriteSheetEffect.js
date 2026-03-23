import { AnimatedSprite } from 'pixi.js';
import { localToScreen } from '../utils.js';

export class PixiSpriteSheetEffect {
  constructor(sheet, effectsLayer, camera, renderer) {
    this.effectsLayer = effectsLayer;
    this.camera = camera;
    this.renderer = renderer;

    const animName = Object.keys(sheet.animations)[0];
    this.textures = sheet.animations[animName];
  }

  play(parent, position, scale = 4, frameDuration = 0.035) {
    const screen = localToScreen(parent, position, this.camera, this.renderer);
    const zoom = this.camera.zoom;

    const anim = new AnimatedSprite(this.textures);
    anim.anchor.set(0.5);
    anim.x = screen.x;
    anim.y = screen.y;
    anim.scale.set((scale * zoom) / anim.texture.width);
    anim.animationSpeed = (1 / 60) / frameDuration;
    anim.loop = false;
    anim.onComplete = () => {
      this.effectsLayer.removeChild(anim);
      anim.destroy();
    };

    this.effectsLayer.addChild(anim);
    anim.play();
  }
}
