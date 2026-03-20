import { Application, Assets, Spritesheet, Container } from 'pixi.js';
import { ASSETS } from './assetManifest.js';


export async function createPixiApp(threeCanvas) {
  const app = new Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    resolution: 1.5,
    autoDensity: true,
  });

  const canvas = app.canvas;
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.getElementById('game-container').appendChild(canvas);

  // Forward pointer events that miss PIXI sprites to Three.js canvas
  canvas.addEventListener('pointerdown', (e) => {
    const hit = app.renderer.events.rootBoundary.hitTest(e.globalX ?? e.clientX, e.globalY ?? e.clientY);
    if (!hit || hit === app.stage) {
      threeCanvas.dispatchEvent(new PointerEvent('pointerdown', {
        clientX: e.clientX,
        clientY: e.clientY,
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        bubbles: true,
      }));
    }
  });

  // Load all image assets into PIXI and build texture cache
  const entries = Object.entries(ASSETS.images);
  for (const [key, src] of entries) {
    Assets.add({ alias: key, src });
  }
  const textures = await Assets.load(entries.map(([key]) => key));

  // Effects layer (renders below UI)
  const effectsLayer = new Container();
  app.stage.addChildAt(effectsLayer, 0);

  // Load effect spritesheets
  const effectSheets = {};
  for (const [name, { json, image }] of Object.entries(ASSETS.effects)) {
    const baseTexture = await Assets.load({ alias: `effect_${name}`, src: image });
    const sheet = new Spritesheet(baseTexture, json);
    await sheet.parse();
    effectSheets[name] = sheet;
  }

  return { app, textures, effectSheets, effectsLayer };
}
