import { Vector3 } from 'three';
import gsap from 'gsap/all';

export function vmin(n) {
  return (n * Math.min(window.innerWidth, window.innerHeight)) / 100;
}

const _v = new Vector3();
export function worldToScreen(worldPos, camera, renderer) {
  _v.copy(worldPos).project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  return {
    x: (_v.x * 0.5 + 0.5) * rect.width + rect.left,
    y: (-_v.y * 0.5 + 0.5) * rect.height + rect.top,
  };
}

const _wp = new Vector3();
export function localToScreen(group, position, camera, renderer) {
  if (position.isVector3) {
    _wp.copy(position);
  } else {
    _wp.set(position.x, position.y, position.z);
  }
  group.localToWorld(_wp);
  return worldToScreen(_wp, camera, renderer);
}

export function cloneSkinnedMesh(root) {
  const sourceMap = new Map();
  const cloneMap = new Map();
  const cloned = root.clone();

  function traversePair(src, dst) {
    sourceMap.set(dst, src);
    cloneMap.set(src, dst);
    for (let i = 0; i < src.children.length; i++) {
      traversePair(src.children[i], dst.children[i]);
    }
  }
  traversePair(root, cloned);

  cloned.traverse(node => {
    if (!node.isSkinnedMesh) return;
    const src = sourceMap.get(node);
    const srcBones = src.skeleton.bones;
    node.skeleton = src.skeleton.clone();
    node.bindMatrix.copy(src.bindMatrix);
    node.skeleton.bones = srcBones.map(b => cloneMap.get(b));
    node.bind(node.skeleton, node.bindMatrix);
  });

  return cloned;
}

export function popIn(obj, withRotation = false) {
  const tl = gsap.timeline();
  tl.fromTo(obj.scale, { x: 0, y: 0, z: 0 }, { x: 1.15, y: 1.15, z: 1.15, duration: 0.18, ease: 'sine.out' });
  tl.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.12, ease: 'back.out(2)' }, 0.18);
  if (withRotation) {
    tl.from(obj.rotation, { y: Math.PI * 0.25, duration: 0.25, ease: 'sine.out' }, 0);
  }
}

export function fadeOut(obj) {
  gsap.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.12, ease: 'sine.in' });
}

export function bounce(obj) {
  const y = obj.position.y;
  const tl = gsap.timeline();
  tl.to(obj.position, { y: y + 1, duration: 0.14, ease: 'sine.out' }, 0);
  tl.to(obj.position, { y, duration: 0.18, ease: 'sine.in' }, 0.14);
  tl.to(obj.position, { y: y + 0.8, duration: 0.13, ease: 'sine.out' }, 0.32);
  tl.to(obj.position, { y, duration: 0.16, ease: 'sine.in' }, 0.45);
  tl.to(obj.position, { y: y + 0.6, duration: 0.12, ease: 'sine.out' }, 0.61);
  tl.to(obj.position, { y, duration: 0.14, ease: 'sine.in' }, 0.73);
  tl.to(obj.scale, { x: 1.08, y: 0.92, z: 1.08, duration: 0.12, ease: 'sine.out' }, 0);
  tl.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.14, ease: 'sine.in' }, 0.12);
}

export function bounceFurniture(obj) {
  const y = obj.position.y;
  const tl = gsap.timeline();
  tl.to(obj.position, { y: y + 0.5, duration: 0.12, ease: 'sine.out' }, 0);
  tl.to(obj.position, { y, duration: 0.14, ease: 'sine.in' }, 0.12);
  tl.to(obj.scale, { x: 1.05, y: 0.95, z: 1.05, duration: 0.12, ease: 'sine.out' }, 0);
  tl.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.14, ease: 'sine.in' }, 0.12);
}

export function celebrate(obj) {
  obj.rotation.set(0, 0, 0);
  obj.scale.set(1, 1, 1);
  const tl = gsap.timeline();
  tl.to(obj.scale, { x: 1.15, y: 0.92, z: 1.15, duration: 0.18, ease: 'sine.out' }, 0);
  tl.to(obj.position, { y: '+=0.25', duration: 0.18, ease: 'sine.out' }, 0);
  tl.to(obj.scale, { x: 0.98, y: 1.04, z: 0.98, duration: 0.24, ease: 'sine.out' }, 0.18);
  tl.to(obj.position, { y: '-=0.25', duration: 0.24, ease: 'sine.in' }, 0.18);
  tl.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.2, ease: 'sine.out' }, 0.42);
}

export function startGentleSway(obj) {
  if (obj._swayTL) obj._swayTL.kill();
  obj.rotation.z = 0;
  obj._swayTL = gsap
    .timeline({ repeat: -1, yoyo: true })
    .to(obj.rotation, { z: 0.05, duration: 2.2, ease: 'sine.inOut' })
    .to(obj.rotation, { z: -0.05, duration: 2.2, ease: 'sine.inOut' });
}
