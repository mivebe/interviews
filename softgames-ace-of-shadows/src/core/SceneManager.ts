import { Application } from 'pixi.js';
import { Scene } from './Scene';
import { getScreenInfo } from './utils';

export type SceneConstructor = new (app: Application, goBack: () => void) => Scene;

export class SceneManager {
  private currentScene: Scene | null = null;
  private goBack: () => void = () => {};

  setGoBack(goBack: () => void): void {
    this.goBack = goBack;
  }

  constructor(private app: Application) {
    window.addEventListener('resize', () => this.handleResize());

    document.addEventListener('fullscreenchange', () => {
      setTimeout(() => {
        this.app.resize();
        this.handleResize();
      }, 100);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 100);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.handleResize();
      }
    });
  }

  /** Instantiate a scene class and transition to it */
  goTo(SceneClass: SceneConstructor): void {
    const scene = new SceneClass(this.app, this.goBack);
    this.showScene(scene);
  }

  /** Destroy the current scene (if any) and activate the given scene */
  showScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.onDestroy();
      this.app.stage.removeChild(this.currentScene);
    }

    this.currentScene = scene;
    this.app.stage.addChildAt(scene, 0);
    scene.onStart();
    this.handleResize();
  }

  handleResize(): void {
    if (!this.currentScene) return;
    const screen = getScreenInfo(this.app.screen.width, this.app.screen.height);
    this.currentScene.onResize(screen);
  }
}
