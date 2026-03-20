import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Howl } from 'howler';
import { ASSETS } from './assetManifest.js';

export async function loadAll() {
  const loader = new GLTFLoader();

  // Load models from inlined data URIs
  const modelEntries = await Promise.all(
    Object.entries(ASSETS.models).map(async ([name, src]) => {
      const gltf = await loader.loadAsync(src);
      return [name, gltf];
    }),
  );
  const models = Object.fromEntries(modelEntries);

  // Load sounds from inlined data URIs
  const sounds = {};
  for (const [name, { src, loop, volume }] of Object.entries(ASSETS.audio)) {
    sounds[name] = new Howl({ src: [src], loop: !!loop, volume: volume ?? 0.3, preload: true });
  }

  return { models, sounds };
}
