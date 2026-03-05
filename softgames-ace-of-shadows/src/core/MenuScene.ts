import { Application, Container, Graphics, Text } from 'pixi.js';
import { Scene } from './Scene';
import { SECONDARY_BG, TEXT_COLOR } from './constants';
import { ScreenInfo } from './types';

interface MenuItem {
  label: string;
  desc: string;
  color: number;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Ace of Shadows', desc: '144 animated card sprites', color: 0xe94560 },
  { label: 'Magic Words', desc: 'Text & emoji dialogue system', color: 0x0f3460 },
  { label: 'Phoenix Flame', desc: 'Particle fire effect', color: 0xf58840 },
];

export class MenuScene extends Scene {
  private goToScene: ((index: number) => void) | null = null;

  constructor(private app: Application, goBack: () => void) {
    super(goBack);
  }

  setNavigator(goToScene: (index: number) => void): void {
    this.goToScene = goToScene;
  }

  onStart(): void {}

  onDestroy(): void {}

  onResize(screen: ScreenInfo): void {
    // Rebuild all children at native resolution
    this.removeChildren();
    const s = screen.scale;
    const isMobile = screen.width < 600;

    const title = new Text({
      text: 'Softgames Demo',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(isMobile ? screen.width * 0.08 : 42 * s),
        fontWeight: 'bold',
        fill: TEXT_COLOR,
      },
    });
    title.anchor.set(0.5, 0);
    title.position.set(screen.centerX, 60 * s);
    this.addChild(title);

    const subtitle = new Text({
      text: 'Choose a demo to explore',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(isMobile ? screen.width * 0.035 : 16 * s),
        fill: 0x888899,
      },
    });
    subtitle.anchor.set(0.5, 0);
    subtitle.position.set(screen.centerX, title.y + title.height + 8 * s);
    this.addChild(subtitle);

    const btnW = Math.round(isMobile ? screen.width * 0.85 : 280 * s);
    const btnH = Math.round(isMobile ? screen.height * 0.12 : 80 * s);
    const gap = Math.round(24 * s);
    const totalH = MENU_ITEMS.length * btnH + (MENU_ITEMS.length - 1) * gap;
    const startY = (screen.height - totalH) / 2 + 40 * s;

    MENU_ITEMS.forEach((item, i) => {
      const btn = this.createButton(item, btnW, btnH, s);
      btn.position.set(
        (screen.width - btnW) / 2,
        startY + i * (btnH + gap),
      );
      btn.eventMode = 'static';
      btn.cursor = 'pointer';
      btn.on('pointerdown', () => this.goToScene?.(i));
      btn.on('pointerover', () => { btn.scale.set(1.03); btn.alpha = 0.9; });
      btn.on('pointerout', () => { btn.scale.set(1); btn.alpha = 1; });
      this.addChild(btn);
    });
  }

  private createButton(item: MenuItem, w: number, h: number, s: number): Container {
    const container = new Container();
    // Scale text relative to button height for consistent proportions
    const bs = h / 80;

    const bg = new Graphics();
    bg.roundRect(0, 0, w, h, Math.round(12 * bs));
    bg.fill({ color: SECONDARY_BG });
    bg.roundRect(0, 0, Math.round(6 * bs), h, Math.round(3 * bs));
    bg.fill({ color: item.color });
    container.addChild(bg);

    const titleText = new Text({
      text: item.label,
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(20 * bs),
        fontWeight: 'bold',
        fill: TEXT_COLOR,
      },
    });
    titleText.position.set(Math.round(24 * bs), Math.round(16 * bs));
    container.addChild(titleText);

    const descText = new Text({
      text: item.desc,
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(13 * bs),
        fill: 0x888899,
      },
    });
    descText.position.set(Math.round(24 * bs), Math.round(46 * bs));
    container.addChild(descText);

    return container;
  }
}
