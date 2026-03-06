import { Application, Container, Graphics, Text } from 'pixi.js';

const WIDTH = 80;
const HEIGHT = 28;
const MARGIN = 8;

export class FpsCounter extends Container {
  private fpsText: Text;
  private lastTime = performance.now();
  private frames = 0;

  constructor(app: Application) {
    super();

    const bg = new Graphics();
    bg.roundRect(0, 0, WIDTH, HEIGHT, 6);
    bg.fill({ color: 0x000000, alpha: 0.6 });
    this.addChild(bg);

    this.fpsText = new Text({
      text: 'FPS: 60',
      style: {
        fontFamily: 'monospace',
        fontSize: 14,
        fill: 0x00ff88,
      },
    });
    this.fpsText.position.set(8, 5);
    this.addChild(this.fpsText);

    const reposition = () => {
      this.position.set(app.screen.width - WIDTH - MARGIN, MARGIN);
    };
    reposition();
    app.renderer.on('resize', reposition);

    app.ticker.add(() => {
      this.frames++;
      const now = performance.now();
      const elapsed = now - this.lastTime;
      if (elapsed >= 500) {
        this.fpsText.text = `FPS: ${Math.round((this.frames / elapsed) * 1000)}`;
        this.frames = 0;
        this.lastTime = now;
      }
    });
  }
}
