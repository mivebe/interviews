import {
  Scene,
  Color,
  Group,
  OrthographicCamera,
  WebGLRenderer,
  BasicShadowMap,
  SRGBColorSpace,
  AmbientLight,
  DirectionalLight,
  Box3,
  Vector3,
} from 'three';

export function createScene(container, levelGltf) {
  // Scene
  const scene = new Scene();
  scene.background = new Color(0xffffff);

  // Camera
  const w = window.innerWidth;
  const h = window.innerHeight;
  const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 2000);
  camera.position.set(0, 500, 700);
  camera.lookAt(0, 0, 0);
  camera.zoom = getZoom();
  camera.updateProjectionMatrix();

  // Renderer
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(1.5);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = BasicShadowMap;
  renderer.outputColorSpace = SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new AmbientLight(13696507, 1.0);
  scene.add(ambientLight);

  const dirLight = new DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(-15, 15, 15);
  dirLight.castShadow = true;
  dirLight.shadow.camera.left = -55;
  dirLight.shadow.camera.right = 55;
  dirLight.shadow.camera.top = 55;
  dirLight.shadow.camera.bottom = -55;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 80;
  dirLight.shadow.camera.updateProjectionMatrix();
  dirLight.shadow.radius = 5;
  dirLight.shadow.bias = -5e-4;
  dirLight.shadow.normalBias = 0.02;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  const lights = { ambient: ambientLight, directional: dirLight };

  // World root
  const worldRoot = new Group();
  worldRoot.name = 'WorldRoot';
  scene.add(worldRoot);

  // Level
  const levelScene = levelGltf.scene.clone(true);
  const box = new Box3().setFromObject(levelScene);
  const center = new Vector3();
  box.getCenter(center);
  levelScene.position.sub(center);
  levelScene.position.y -= 2;
  levelScene.traverse(child => {
    if (child.isMesh) {
      const n = child.name.toLowerCase();
      child.receiveShadow = true;
      child.castShadow = !(n.includes('terrain') || n.includes('stone'));
    }
  });
  worldRoot.add(levelScene);

  return { scene, camera, renderer, lights, worldRoot };
}

export function getZoom() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isPortrait = h > w;

  if (isPortrait) {
    return Math.max(10, Math.min(28, 0.025 * w + 3));
  }
  return Math.max(18, Math.min(38, 0.0133 * h + 17.6));
}

export function handleResize(camera, renderer) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.zoom = getZoom();
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
