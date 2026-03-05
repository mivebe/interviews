import { Application } from 'pixi.js';
import { BG_COLOR } from './core/constants';

let app: Application;

export async function createApp(): Promise<Application> {
  app = new Application();
  await app.init({
    resizeTo: window,
    background: BG_COLOR,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  const container = document.getElementById('app')!;
  container.appendChild(app.canvas);

  return app;
}
