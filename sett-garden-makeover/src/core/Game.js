import { Raycaster, Vector2, Color } from 'three';
import gsap from 'gsap';
import { loadAll } from './AssetLoader.js';
import { createScene, handleResize } from './SceneSetup.js';
import { createPixiApp } from './PixiSetup.js';
import { UI } from '../components/UI.js';
import { Audio } from './Audio.js';
import { SPOT_CONFIGS } from '../constants.js';
import { PixiSpriteSheetEffect } from './PixiSpriteSheetEffect.js';
import { StarburstEffect } from '../components/StarburstEffect.js';
import { HelperCursor } from '../components/HelperCursor.js';
import { AnimalPenSpot } from '../components/spots/AnimalPenSpot.js';
import { FurnitureSpot } from '../components/spots/FurnitureSpot.js';
import { PlantSpot } from '../components/spots/PlantSpot.js';

export class Game {
  constructor() {
    this.spots = [];
    this.currentSpot = null;
    this.spotsCompleted = 0;
    this.raycaster = new Raycaster();
    this.raycaster.layers.set(1);
    this.pointer = new Vector2();
  }

  async init() {
    // Load assets
    const { models, sounds } = await loadAll();

    // Audio
    this.audio = new Audio(sounds);

    // Scene
    const container = document.getElementById('game-container');
    const { scene, camera, renderer, lights, worldRoot } = createScene(container, models.level);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.lights = lights;
    this.worldRoot = worldRoot;

    // PIXI overlay (before spots, so effects are available)
    const { app: pixiApp, textures, effectSheets, effectsLayer } = await createPixiApp(renderer.domElement);
    this.pixiApp = pixiApp;

    // Create effects
    const spotEffects = {
      swash: new PixiSpriteSheetEffect(effectSheets.swash, effectsLayer, camera, renderer),
      smoke: new PixiSpriteSheetEffect(effectSheets.smoke_puff, effectsLayer, camera, renderer),
      starburst: new StarburstEffect(effectsLayer, camera, renderer),
    };

    // Create spots
    for (const config of SPOT_CONFIGS) {
      const SPOT_CLASSES = { animalPen: AnimalPenSpot, furniture: FurnitureSpot, plants: PlantSpot };
      const SpotClass = SPOT_CLASSES[config.id];
      const spot = new SpotClass(config, models, spotEffects);
      worldRoot.add(spot.group);
      this.spots.push(spot);
    }

    // UI
    this.ui = new UI(this, pixiApp, textures);
    this.helper = new HelperCursor(pixiApp, textures);

    // Click handling
    renderer.domElement.addEventListener('pointerdown', e => this.onClick(e));

    // Resize
    window.addEventListener('resize', () => {
      handleResize(this.camera, this.renderer);
      this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
      this.ui._layout();
    });

    // Animation loop
    this.renderer.setAnimationLoop(() => this.update());

    // Hide loader
    document.getElementById('loader').classList.add('hidden');

    // Start
    this.audio.startMusic();
    this.playIntro();
  }

  update() {
    for (const spot of this.spots) {
      spot.updateMixers();
    }
    this.helper.update(this.camera, this.renderer);
    this.renderer.render(this.scene, this.camera);
  }

  playIntro() {
    this.worldRoot.position.z = -30;

    gsap.to(this.worldRoot.position, {
      z: 0,
      duration: 2,
      ease: 'sine.out',
    });

    this.ui.showIntro().then(() => {
      this.activateSpots();
    });
  }

  activateSpots() {
    for (const spot of this.spots) {
      spot.showPlus();
    }
    this.helper.startOnPluses(this.spots, this.camera, this.renderer);
  }

  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const labelSprites = this.spots.filter(s => !s.completed).map(s => s.plusSprite);

    const intersects = this.raycaster.intersectObjects(labelSprites);
    if (intersects.length > 0) {
      const spot = intersects[0].object.userData.spot;
      this.openSpot(spot);
    }
  }

  openSpot(spot) {
    if (this.currentSpot) return;
    this.currentSpot = spot;
    this.audio.play('click');
    this.helper.stop();

    for (const s of this.spots) s.hidePlus();
    this.ui.openSelection(spot);
    this.helper.startOnSelection(this.ui.iconsContainer);
  }

  previewItem(spot, itemName) {
    spot.showItem(itemName);
    const itemConfig = spot.config.items.find(i => i.name === itemName);
    if (itemConfig) this.audio.play(itemConfig.sound);
  }

  cancelSelection() {
    if (!this.currentSpot) return;
    this.currentSpot.hideAllItems();
    this.audio.play('return');
    this.currentSpot = null;
    this.helper.stop();

    for (const s of this.spots) s.showPlus();
    this.helper.startOnPluses(this.spots, this.camera, this.renderer);
  }

  confirmSelection(itemName) {
    if (!this.currentSpot) return;
    const spot = this.currentSpot;
    this.audio.play('confirm');
    this.helper.stop();

    spot.confirmItem(itemName);
    this.currentSpot = null;
    this.spotsCompleted++;

    // Show remaining labels
    for (const s of this.spots) s.showPlus();
    this.helper.startOnPluses(this.spots, this.camera, this.renderer);

    // Update lighting
    this.updateLighting();

    // Check completion
    if (this.spotsCompleted === 3) {
      this.helper.stop();
      gsap.delayedCall(1.5, () => {
        this.audio.play('packshot');
        this.ui.showPackShot();
      });
    }
  }

  updateLighting() {
    const { ambient, directional } = this.lights;
    const dur = this.spotsCompleted === 3 ? 2 : 1.5;

    const lightStages = [
      null,
      { dirI: 2.6, ambI: 1.2, ambColor: 15792127, dirPos: [-7, 15, 0] },
      { dirI: 2.8, ambI: 1.4, ambColor: 16777215, dirPos: [4, 15, -10] },
      { dirI: 3.6, ambI: 1.8, ambColor: 16777215, dirPos: [15, 15, 15] },
    ];

    const stage = lightStages[this.spotsCompleted];
    if (!stage) return;

    gsap.to(directional, { intensity: stage.dirI, duration: dur, ease: 'sine.out' });
    gsap.to(ambient, { intensity: stage.ambI, duration: dur, ease: 'sine.out' });
    gsap.to(directional.position, {
      x: stage.dirPos[0],
      y: stage.dirPos[1],
      z: stage.dirPos[2],
      duration: dur,
      ease: 'sine.out',
    });

    const targetColor = new Color(stage.ambColor);
    gsap.to(ambient.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: dur, ease: 'sine.out' });
  }
}
