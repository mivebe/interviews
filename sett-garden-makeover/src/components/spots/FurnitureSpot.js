import { Group } from 'three';
import { FURNITURE_CONFIGS } from '../../constants.js';
import { bounceFurniture, popIn } from '../../utils.js';
import { Spot } from './Spot.js';

export class FurnitureSpot extends Spot {
  initItems(models) {
    const furnitureGltf = models.furniture_asset;
    for (const [name, cfg] of Object.entries(FURNITURE_CONFIGS)) {
      const obj = furnitureGltf.scene.getObjectByName(cfg.objName);
      if (!obj) continue;

      const clone = obj.clone(true);
      clone.traverse(c => {
        if (c.isMesh) c.castShadow = true;
      });
      clone.scale.multiplyScalar(cfg.scale);
      clone.rotateY(cfg.rotY);

      if (cfg.posY) clone.position.y = cfg.posY;
      const g = new Group();
      g.add(clone);
      g.scale.set(0, 0, 0);
      this.group.add(g);
      this.itemObjects[name] = { objects: [g], mixers: [] };
    }
  }

  _showItemImpl(item) {
    const obj = item.objects[0];
    // Play swash first, then pop in the furniture slightly after
    if (this.effects.swash) {
      const effectPos = { x: obj.position.x - 2, y: obj.position.y, z: obj.position.z + 2 };
      this.effects.swash.play(this.group, effectPos, 14, 0.03);
    }
    this._delayedCall(0.08, () => popIn(obj, false));
  }

  _confirmItemImpl(item) {
    bounceFurniture(item.objects[0]);
  }
}
