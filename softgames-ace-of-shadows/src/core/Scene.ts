import { Container } from 'pixi.js';
import { ScreenInfo } from './types';

/**
 * Abstract base class for all scenes. Lifecycle:
 * 1. Constructor — create the scene instance
 * 2. `onStart()` — called once after the scene is added to the stage
 * 3. `onResize()` — called immediately after onStart and on every window resize
 * 4. `onDestroy()` — called when the scene is removed; clean up listeners and timers
 */
export abstract class Scene extends Container {
  constructor(protected goBack: () => void) {
    super();
  }

  abstract onStart(): void;
  abstract onDestroy(): void;
  abstract onResize(screen: ScreenInfo): void;
}
