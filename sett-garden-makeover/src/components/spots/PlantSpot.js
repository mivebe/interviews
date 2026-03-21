import { Group } from 'three';
import gsap from 'gsap';
import { PLANT_CONFIGS } from '../../constants.js';
import { celebrate, popIn, startGentleSway } from '../../utils.js';
import { Spot } from './Spot.js';

export class PlantSpot extends Spot {
  initItems(models) {
    for (const [name, cfg] of Object.entries(PLANT_CONFIGS)) {
      const gltf = models[cfg.asset];
      if (!gltf) continue;
      const objects = [];

      for (const pos of cfg.positions) {
        const clone = gltf.scene.clone(true);
        clone.traverse(c => {
          if (c.isMesh) c.castShadow = true;
        });
        clone.scale.multiplyScalar(cfg.scale);
        if (cfg.rotY) clone.rotateY(cfg.rotY);

        const g = new Group();
        g.add(clone);
        g.position.set(...pos);
        g.scale.set(0, 0, 0);
        this.group.add(g);
        objects.push(g);
      }
      this.itemObjects[name] = { objects, mixers: [] };
    }
  }

  _showItemImpl(item) {
    // Sequential pop-in with smoke on each
    for (let i = 0; i < item.objects.length; i++) {
      const obj = item.objects[i];
      const delay = i * 0.08;
      this._delayedCall(delay, () => {
        if (this.effects.smoke) {
          this.effects.smoke.play(this.group, obj.position, 3.5, 0.035);
        }
        popIn(obj, false);
      });
    }
  }

  _confirmItemImpl(item) {
    for (const obj of item.objects) {
      celebrate(obj);
      gsap.delayedCall(0.35, () => startGentleSway(obj));
    }
  }
}
