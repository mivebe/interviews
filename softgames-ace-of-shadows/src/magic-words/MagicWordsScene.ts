import { Application, Container, Graphics, Text, Texture, Ticker } from 'pixi.js';
import { Scene } from '../core/Scene';
import { BackButton } from '../core/BackButton';
import { DialogueRenderer } from './DialogueRenderer';
import { fetchMagicWords, MagicWordsResponse } from './api';
import { ScreenInfo } from '../core/types';
import { clamp, lerp } from '../core/utils';
import { BUBBLE_COLORS, DIALOGUE_DELAY, SCREEN_INFO, SCROLL_LERP_SPEED } from './constants';
import { RenderedBubble } from './types';

export class MagicWordsScene extends Scene {
  private tickerFn: ((ticker: Ticker) => void) | null = null;
  private dialogueContainer: Container | null = null;
  private clipMask: Graphics | null = null;
  private scrollbarTrack: Graphics | null = null;
  private scrollbarThumb: Graphics | null = null;
  private bubbles: Container[] = [];
  private renderedLines: RenderedBubble[] = [];
  private currentIndex = 0;
  private timer = 0;
  private data: MagicWordsResponse | null = null;
  private avatarTextures = new Map<string, Texture>();
  private emojiTextures = new Map<string, Texture>();
  private scrollY = 0;
  private targetScrollY = 0;
  private maxScrollY = 0;
  private userScrolledUp = false;
  private titleText!: Text;
  private loadingText: Text | null = null;
  private back!: BackButton;
  private screen: ScreenInfo = SCREEN_INFO;
  private wheelHandler: ((e: WheelEvent) => void) | null = null;
  private maskTop = 0;
  private lastRenderedScrollY = -1;
  private fadingBubbles: { bubble: Container; progress: number }[] = [];
  private nextBubbleY = 0;

  constructor(private app: Application, goBack: () => void) {
    super(goBack);
  }

  onStart(): void {
    this.back = new BackButton(() => this.goBack());
    this.addChild(this.back);

    this.titleText = new Text({
      text: 'Magic Words',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0x4488ff,
      },
    });
    this.titleText.anchor.set(0.5, 0);
    this.addChild(this.titleText);

    const loadingText = new Text({
      text: 'Loading dialogue...',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        fill: 0x888899,
      },
    });
    loadingText.anchor.set(0.5);
    this.loadingText = loadingText;
    this.addChild(loadingText);

    this.dialogueContainer = new Container();
    this.addChild(this.dialogueContainer);

    this.clipMask = new Graphics();
    this.addChild(this.clipMask);
    this.dialogueContainer.mask = this.clipMask;

    // Scrollbar
    this.scrollbarTrack = new Graphics();
    this.addChild(this.scrollbarTrack);
    this.scrollbarThumb = new Graphics();
    this.addChild(this.scrollbarThumb);

    this.loadData()
      .then(() => {
        if (this.loadingText) {
          this.removeChild(this.loadingText);
          this.loadingText.destroy();
          this.loadingText = null;
        }
      })
      .catch(err => {
        if (this.loadingText) {
          this.loadingText.text = `Error: ${err.message}`;
        }
      });

    this.tickerFn = (ticker: Ticker) => this.update(ticker.deltaMS / 1000);
    this.app.ticker.add(this.tickerFn);

    // Mouse wheel scrolling
    this.wheelHandler = (e: WheelEvent) => {
      this.userScroll(e.deltaY);
    };
    this.app.canvas.addEventListener('wheel', this.wheelHandler, { passive: true });

    // Touch drag scrolling
    let touchStartY = 0;
    let touchScrollStart = 0;
    this.eventMode = 'static';
    this.hitArea = { contains: () => true };
    this.on('pointerdown', e => {
      touchStartY = e.global.y;
      touchScrollStart = this.targetScrollY;
    });
    this.on('pointermove', e => {
      if (e.buttons > 0 || e.pointerType === 'touch') {
        const dy = touchStartY - e.global.y;
        this.setTargetScroll(touchScrollStart + dy);
        this.userScrolledUp = this.targetScrollY < this.maxScrollY;
      }
    });
  }

  private userScroll(deltaY: number): void {
    this.setTargetScroll(this.targetScrollY + deltaY);
    this.userScrolledUp = this.targetScrollY < this.maxScrollY;
  }

  private setTargetScroll(value: number): void {
    this.targetScrollY = clamp(value, 0, this.maxScrollY);
  }

  private applyScroll(): void {
    if (!this.dialogueContainer) return;
    const s = this.screen.scale;
    const topPad = Math.round(20 * s);
    this.dialogueContainer.y = this.maskTop + topPad - this.scrollY;
  }

  private updateScrollbar(force = false): void {
    if (!this.scrollbarTrack || !this.scrollbarThumb) return;
    const rounded = Math.round(this.scrollY);
    if (!force && rounded === this.lastRenderedScrollY) return;
    this.lastRenderedScrollY = rounded;

    const s = this.screen.scale;
    const trackHeight = this.screen.height - this.maskTop - Math.round(10 * s);
    const trackX = this.screen.width - Math.round(12 * s);
    const trackWidth = Math.round(4 * s);

    this.scrollbarTrack.clear();
    this.scrollbarThumb.clear();

    if (this.maxScrollY <= 0) return;

    // Track
    this.scrollbarTrack.roundRect(trackX, this.maskTop + Math.round(5 * s), trackWidth, trackHeight, trackWidth / 2);
    this.scrollbarTrack.fill({ color: 0xffffff, alpha: 0.1 });

    // Thumb
    const contentHeight = this.maxScrollY + trackHeight;
    const thumbHeight = Math.max(Math.round(20 * s), (trackHeight / contentHeight) * trackHeight);
    const scrollRatio = this.maxScrollY > 0 ? this.scrollY / this.maxScrollY : 0;
    const thumbY = this.maskTop + Math.round(5 * s) + scrollRatio * (trackHeight - thumbHeight);

    this.scrollbarThumb.roundRect(trackX, thumbY, trackWidth, thumbHeight, trackWidth / 2);
    this.scrollbarThumb.fill({ color: 0xffffff, alpha: 0.35 });
  }

  private loadImage(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(Texture.from(canvas));
      };
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }

  private async loadData(): Promise<void> {
    this.data = await fetchMagicWords();

    const avatarPromises = this.data.avatars.map(async a => {
      try {
        const texture = await this.loadImage(a.url);
        this.avatarTextures.set(a.name, texture);
      } catch {
        // fallback: no avatar
      }
    });

    const emojiPromises = this.data.emojis.map(async e => {
      try {
        const texture = await this.loadImage(e.url);
        this.emojiTextures.set(e.name, texture);
      } catch {
        // fallback: show name
      }
    });

    await Promise.all([...avatarPromises, ...emojiPromises]);
  }

  private update(dt: number): void {
    if (!this.data || !this.dialogueContainer) return;

    // Smoothly animate scroll toward target
    if (Math.abs(this.scrollY - this.targetScrollY) > 0.5) {
      this.scrollY = lerp(this.scrollY, this.targetScrollY, Math.min(1, SCROLL_LERP_SPEED * dt));
      this.applyScroll();
      this.updateScrollbar();
    } else if (this.scrollY !== this.targetScrollY) {
      this.scrollY = this.targetScrollY;
      this.applyScroll();
      this.updateScrollbar();
    }

    // Batch-process fade animations instead of per-bubble ticker callbacks
    for (let i = this.fadingBubbles.length - 1; i >= 0; i--) {
      const fb = this.fadingBubbles[i];
      fb.progress += dt / 0.4; // 400ms fade
      fb.bubble.alpha = Math.min(1, fb.progress);
      if (fb.progress >= 1) {
        this.fadingBubbles.splice(i, 1);
      }
    }

    if (this.currentIndex >= this.data.dialogue.length) {
      return;
    }

    this.timer += dt;

    if (this.timer >= DIALOGUE_DELAY) {
      this.timer -= DIALOGUE_DELAY;
      this.addNextBubble();
    }
  }

  private getBubbleLayout() {
    const s = this.screen.scale;
    const isMobile = this.screen.width < 600;
    const fontScale = isMobile ? this.screen.width / 500 : s;
    const sidePadding = isMobile ? 40 : 60;
    const dialogueAreaWidth = this.screen.width - Math.round(sidePadding * 2);
    const maxBubbleWidth = isMobile ? Math.round(dialogueAreaWidth * 0.75) : undefined;

    return { s, fontScale, dialogueAreaWidth, maxBubbleWidth };
  }

  private createPositionedBubble(line: RenderedBubble): Container {
    const { s, fontScale, dialogueAreaWidth, maxBubbleWidth } = this.getBubbleLayout();

    const bubble = DialogueRenderer.createBubble({
      name: line.name,
      text: line.text,
      avatarTexture: this.avatarTextures.get(line.name) ?? null,
      emojiMap: this.emojiTextures,
      isLeft: line.isLeft,
      bubbleColor: BUBBLE_COLORS[line.charIndex % BUBBLE_COLORS.length],
      scale: s,
      fontScale,
      maxBubbleWidth,
    });

    const bubbleX = line.isLeft ? 0 : dialogueAreaWidth - bubble.width;
    bubble.position.set(bubbleX, this.nextBubbleY);
    this.nextBubbleY += bubble.height + Math.round(16 * s);

    this.dialogueContainer!.addChild(bubble);
    this.bubbles.push(bubble);
    return bubble;
  }

  private addNextBubble(): void {
    if (!this.data || !this.dialogueContainer) return;

    const line = this.data.dialogue[this.currentIndex];
    const avatar = this.data.avatars.find(a => a.name === line.name);
    const charIndex = avatar ? this.data.avatars.indexOf(avatar) : this.currentIndex;
    const isLeft = avatar?.position === 'left';

    const renderedLine = { name: line.name, text: line.text, isLeft, charIndex };
    const bubble = this.createPositionedBubble(renderedLine);
    bubble.alpha = 0;

    this.renderedLines.push(renderedLine);
    this.currentIndex++;

    this.fadingBubbles.push({ bubble, progress: 0 });

    // Update max scroll and auto-scroll to bottom (only if user hasn't scrolled up)
    this.updateMaxScroll();
    if (!this.userScrolledUp) {
      this.setTargetScroll(this.maxScrollY);
    }
  }

  private rebuildBubbles(): void {
    if (!this.dialogueContainer) return;

    for (const b of this.bubbles) {
      b.destroy({ children: true });
    }
    this.bubbles = [];
    this.nextBubbleY = 0;

    for (const line of this.renderedLines) {
      this.createPositionedBubble(line);
    }
  }

  private updateMaxScroll(): void {
    const s = this.screen.scale;
    const topPad = Math.round(20 * s);
    const viewHeight = this.screen.height - this.maskTop;

    const lastBubble = this.bubbles[this.bubbles.length - 1];
    if (!lastBubble) return;
    const contentHeight = lastBubble.y + lastBubble.height + topPad + Math.round(16 * s);

    this.maxScrollY = Math.max(0, contentHeight - viewHeight);
  }

  onDestroy(): void {
    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    if (this.wheelHandler) {
      this.app.canvas.removeEventListener('wheel', this.wheelHandler);
      this.wheelHandler = null;
    }
    this.dialogueContainer = null;
    this.clipMask = null;
    this.scrollbarTrack = null;
    this.scrollbarThumb = null;
    this.bubbles = [];
    this.renderedLines = [];
    this.data = null;
  }

  onResize(screen: ScreenInfo): void {
    this.screen = screen;
    const s = screen.scale;

    this.back.rebuild(s, screen.width);

    const isMobile = screen.width < 600;

    this.titleText.position.set(screen.centerX, 18 * s);
    this.titleText.style.fontSize = Math.round(isMobile ? screen.width * 0.07 : 28 * s);

    if (isMobile) {
      this.back.position.set(16 * s * 3, this.titleText.y + this.titleText.height + 8 * s);
      this.maskTop = Math.round(this.back.y + this.back.height + 20 * s);
    } else {
      this.maskTop = Math.round(55 * s);
    }

    if (this.loadingText) {
      this.loadingText.position.set(screen.centerX, screen.centerY);
      this.loadingText.style.fontSize = Math.round(isMobile ? screen.width * 0.05 : 16 * s);
    }

    if (this.dialogueContainer) {
      this.dialogueContainer.position.set(isMobile ? 40 : 30 * s, 0);
      this.rebuildBubbles();
      this.updateMaxScroll();
      this.targetScrollY = clamp(this.targetScrollY, 0, this.maxScrollY);
      this.scrollY = this.targetScrollY;
      this.applyScroll();
    }

    if (this.clipMask) {
      this.clipMask.clear();
      this.clipMask.rect(20 * s, this.maskTop, screen.width - 40 * s, screen.height - this.maskTop);
      this.clipMask.fill({ color: 0xffffff });
    }

    this.updateScrollbar(true);
  }
}
