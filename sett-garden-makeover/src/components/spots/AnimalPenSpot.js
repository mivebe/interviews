import { Group, AnimationMixer, LoopOnce } from 'three';
import gsap from 'gsap';
import { ANIMAL_CONFIGS } from '../../constants.js';
import { bounce, cloneSkinnedMesh, popIn } from '../../utils.js';
import { Spot } from './Spot.js';

export class AnimalPenSpot extends Spot {
  initItems(models) {
    for (const [name, cfg] of Object.entries(ANIMAL_CONFIGS)) {
      const gltf = models[cfg.asset];

      if (!gltf) continue;
      const objects = [];
      const mixers = [];

      for (let i = 0; i < cfg.positions.length; i++) {
        const scene = cloneSkinnedMesh(gltf.scene);
        scene.scale.multiplyScalar(cfg.scale);
        scene.traverse(c => {
          if (c.isMesh) c.castShadow = true;
        });
        const mixer = new AnimationMixer(scene);
        const clip = gltf.animations.find(a => a.name === cfg.idleAnim) || gltf.animations[0];

        if (clip) {
          const action = mixer.clipAction(clip);
          action.setLoop(LoopOnce);
          action.clampWhenFinished = true;
          // Start each animal at a random offset so they don't sync up
          gsap.delayedCall(Math.random() * 4, () => action.play());
          mixer.addEventListener('finished', () => {
            const delay = 2 + Math.random() * 5;
            gsap.delayedCall(delay, () => {
              action.reset();
              action.play();
            });
          });
        }

        const g = new Group();
        g.add(scene);
        g.position.set(...cfg.positions[i]);
        g.rotation.y = cfg.rotations[i];
        g.scale.set(0, 0, 0);
        this.group.add(g);
        objects.push(g);

        mixers.push(mixer);
        this.mixers.push({ mixer, speed: cfg.mixerSpeed });
      }

      this.itemObjects[name] = { objects, mixers };
    }
  }

  _showItemImpl(item) {
    for (let i = 0; i < item.objects.length; i++) {
      const obj = item.objects[i];
      const delay = i * 0.12;

      this._delayedCall(delay, () => {
        if (this.effects.starburst) {
          this.effects.starburst.play(this.group, obj.position, 2, 10);
        }
        popIn(obj, true);
      });
    }
  }

  _confirmItemImpl(item) {
    for (let i = 0; i < item.objects.length; i++) {
      gsap.delayedCall(i * 0.12, () => bounce(item.objects[i]));
    }
  }
}
