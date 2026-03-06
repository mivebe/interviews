import { Container, Graphics, Text } from 'pixi.js';
import { ACCENT_COLOR } from './constants';

export class BackButton extends Container {
  private onBack: () => void;

  constructor(onBack: () => void) {
    super();
    this.onBack = onBack;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerdown', this.onBack);
  }

  rebuild(s: number, screenWidth?: number): void {
    this.removeChildren();

    const isMobile = screenWidth !== undefined && screenWidth < 600;
    const bs = isMobile ? s * 3 : s;
    const w = Math.round(110 * bs);
    const h = Math.round(36 * bs);

    const bg = new Graphics();
    bg.roundRect(0, 0, w, h, Math.round(8 * bs));
    bg.fill({ color: ACCENT_COLOR });
    this.addChild(bg);

    const label = new Text({
      text: '\u2190 Menu',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(16 * bs),
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    });

    label.anchor.set(0.5);
    label.position.set(w / 2, h / 2);
    this.addChild(label);
    this.position.set(Math.round(16 * bs), Math.round(16 * bs));
  }
}
