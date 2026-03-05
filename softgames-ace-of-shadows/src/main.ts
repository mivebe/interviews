import { createApp } from './app';
import { FpsCounter } from './core/FpsCounter';
import { SceneManager } from './core/SceneManager';
import { MenuScene } from './core/MenuScene';
import { AceOfShadowsScene } from './ace-of-shadows/AceOfShadowsScene';
import { MagicWordsScene } from './magic-words/MagicWordsScene';
import { PhoenixFlameScene } from './phoenix-flame/PhoenixFlameScene';

function requestFullscreen(): void {
  const el = document.documentElement as any;
  try {
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } catch {
    // Fullscreen not supported
  }
}

async function main() {
  const app = await createApp();
  const sceneManager = new SceneManager(app);

  // Request fullscreen on first user interaction
  const enterFullscreen = () => {
    requestFullscreen();
    document.removeEventListener('pointerdown', enterFullscreen);
  };
  document.addEventListener('pointerdown', enterFullscreen, { once: true });

  const scenes = [AceOfShadowsScene, MagicWordsScene, PhoenixFlameScene];

  function showMenu() {
    const menu = new MenuScene(app, () => {});
    menu.setNavigator((index: number) => {
      sceneManager.goTo(scenes[index]);
    });
    sceneManager.showScene(menu);
  }

  sceneManager.setGoBack(showMenu);

  const fps = new FpsCounter(app);
  app.stage.addChild(fps);

  showMenu();
}

main().catch(console.error);
