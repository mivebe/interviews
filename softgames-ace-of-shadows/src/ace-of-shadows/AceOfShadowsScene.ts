import { Application, Sprite, Text, Ticker } from 'pixi.js';
import { Scene } from '../core/Scene';
import { BackButton } from '../core/BackButton';
import { CardFactory } from './CardFactory';
import { CARD, CARD_ANIMATION, RANKS, SUITS } from './constants';
import { lerp, easeInOutQuad } from '../core/utils';
import { ScreenInfo } from '../core/types';
import { FlyingCard } from './types';

export class AceOfShadowsScene extends Scene {
  private leftStack: Sprite[] = [];
  private rightStack: Sprite[] = [];
  private flyingCards: FlyingCard[] = [];
  private timer = 0;
  private animationDone = false;
  private tickerFn: ((ticker: Ticker) => void) | null = null;
  private back!: BackButton;
  private titleText!: Text;
  private screen: ScreenInfo = { scale: 1, width: 960, height: 540, centerX: 480, centerY: 270 };

  constructor(private app: Application, goBack: () => void) {
    super(goBack);
  }

  onStart(): void {
    this.back = new BackButton(() => this.goBack());
    this.addChild(this.back);

    this.titleText = new Text({
      text: 'Ace of Shadows',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0xe94560,
      },
    });
    this.titleText.anchor.set(0.5, 0);
    this.addChild(this.titleText);

    const factory = new CardFactory(this.app);
    const textures = factory.generateTextures();
    const cardLabels = SUITS.flatMap(s => RANKS.map(r => `${r}${s.symbol}`));

    for (let i = CARD_ANIMATION.count - 1; i >= 0; i--) {
      const sprite = new Sprite(textures[i % textures.length]);
      sprite.label = cardLabels[i % cardLabels.length];
      sprite.anchor.set(0.5);
      // Textures are rendered at texScale for crispness; scale back to logical size
      sprite.scale.set(1 / CARD.texScale);
      this.addChild(sprite);
      this.leftStack.push(sprite);
    }

    this.positionStacks();

    this.tickerFn = (ticker: Ticker) => this.update(ticker.deltaMS / 1000);
    this.app.ticker.add(this.tickerFn);
  }

  private getStackPositions() {
    const s = this.screen.scale;
    const isMobile = this.screen.width < 600;
    const cs = isMobile ? this.screen.width / 400 : s;
    const gap = (isMobile ? 120 : 200) * cs;
    const leftX = this.screen.centerX - gap / 2;
    const rightX = this.screen.centerX + gap / 2;
    const baseY = this.screen.centerY + 100 * cs;
    return { leftX, rightX, baseY, s: cs };
  }

  private positionStacks(): void {
    const { leftX, rightX, baseY, s } = this.getStackPositions();
    const offset = CARD_ANIMATION.stackOffset * s;

    this.leftStack.forEach((sprite, i) => {
      sprite.scale.set(s / CARD.texScale);
      sprite.position.set(leftX, baseY - i * offset);
    });

    this.rightStack.forEach((sprite, i) => {
      sprite.scale.set(s / CARD.texScale);
      sprite.position.set(rightX, baseY - i * offset);
    });
  }

  private update(dt: number): void {
    this.timer += dt;

    if (this.animationDone) return;

    if (this.timer >= CARD_ANIMATION.moveInterval) {
      this.timer -= CARD_ANIMATION.moveInterval;
      this.startCardMove();
    }

    const s = this.screen.scale;

    for (let i = this.flyingCards.length - 1; i >= 0; i--) {
      const fc = this.flyingCards[i];
      fc.elapsed += dt;
      const t = Math.min(fc.elapsed / CARD_ANIMATION.moveDuration, 1);
      const eased = easeInOutQuad(t);

      fc.sprite.x = lerp(fc.startX, fc.endX, eased);
      const arcHeight = -CARD_ANIMATION.arcHeight * s;
      const linearY = lerp(fc.startY, fc.endY, eased);
      const arc = arcHeight * Math.sin(Math.PI * t);
      fc.sprite.y = linearY + arc;

      fc.sprite.rotation = Math.sin(Math.PI * t) * CARD_ANIMATION.maxRotation;

      // Keep flying card above both stacks
      this.setChildIndex(fc.sprite, this.children.length - 1);

      if (t >= 1) {
        fc.sprite.rotation = 0;
        if (fc.targetStack === 'right') {
          this.rightStack.push(fc.sprite);
        } else {
          this.leftStack.push(fc.sprite);
        }
        this.setChildIndex(fc.sprite, this.children.length - 1);
        this.flyingCards.splice(i, 1);
        this.positionStacks();

        if (this.leftStack.length === 0 && this.flyingCards.length === 0) {
          this.animationDone = true;
        }
      }
    }
  }

  private startCardMove(): void {
    if (this.leftStack.length === 0) return;

    const sprite = this.leftStack.pop()!;
    const targetStackName: 'left' | 'right' = 'right';
    const { leftX, rightX, baseY, s } = this.getStackPositions();
    const offset = CARD_ANIMATION.stackOffset * s;

    const targetStack = targetStackName === 'right' ? this.rightStack : this.leftStack;
    let inFlightToTarget = 0;
    for (const fc of this.flyingCards) {
      if (fc.targetStack === targetStackName) inFlightToTarget++;
    }
    const endX = targetStackName === 'right' ? rightX : leftX;
    const endY = baseY - (targetStack.length + inFlightToTarget) * offset;

    this.setChildIndex(sprite, this.children.length - 1);

    this.flyingCards.push({
      sprite,
      startX: sprite.x,
      startY: sprite.y,
      endX,
      endY,
      elapsed: 0,
      targetStack: targetStackName,
    });
  }

  onDestroy(): void {
    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    this.flyingCards = [];
    this.leftStack = [];
    this.rightStack = [];
  }

  onResize(screen: ScreenInfo): void {
    this.screen = screen;
    const s = screen.scale;
    const isMobile = screen.width < 600;
    this.back.rebuild(s, screen.width);

    this.titleText.position.set(screen.centerX, 20 * s);
    this.titleText.style.fontSize = Math.round(isMobile ? screen.width * 0.07 : 28 * s);

    if (isMobile) {
      this.back.position.set(16 * s * 3, this.titleText.y + this.titleText.height + 8 * s);
    }

    this.positionStacks();
  }
}
