import { Application, Container, Graphics, Text, Texture } from 'pixi.js';
import { CARD, CARD_TEX, CARD_LAYOUT, SUITS, RANKS, PIP_LAYOUTS } from './constants';
import { PipPos } from './types';

export class CardFactory {
  private textures: Texture[] = [];

  constructor(private app: Application) {}

  generateTextures(): Texture[] {
    if (this.textures.length > 0) return this.textures;

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        const texture = this.createCardTexture(rank, suit);
        this.textures.push(texture);
      }
    }

    return this.textures;
  }

  private createCardTexture(rank: string, suit: { symbol: string; color: number }): Texture {
    const { w, h, s } = CARD_TEX;
    const { borderRadius, innerPadding, corner } = CARD_LAYOUT;
    const container = new Container();

    // Card body
    const bg = new Graphics();
    bg.roundRect(0, 0, w, h, borderRadius * s);
    bg.fill({ color: 0xffffff });
    bg.roundRect(0, 0, w, h, borderRadius * s);
    bg.stroke({ color: 0xbbbbbb, width: 1.5 * s });
    container.addChild(bg);

    // Inner border
    const inner = new Graphics();
    inner.roundRect(
      innerPadding * s, innerPadding * s,
      w - innerPadding * 2 * s, h - innerPadding * 2 * s,
      innerPadding * s,
    );
    inner.stroke({ color: 0xdddddd, width: 0.5 * s });
    container.addChild(inner);

    // Top-left rank
    const topRank = new Text({
      text: rank,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(corner.rankFontSize * s),
        fontWeight: 'bold',
        fill: suit.color,
      },
    });
    topRank.anchor.set(0.5, 0);
    topRank.position.set(corner.x * s, corner.rankY * s);
    container.addChild(topRank);

    // Top-left suit
    const topSuit = new Text({
      text: suit.symbol,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(corner.suitFontSize * s),
        fill: suit.color,
      },
    });
    topSuit.anchor.set(0.5, 0);
    topSuit.position.set(corner.x * s, corner.suitY * s);
    container.addChild(topSuit);

    // Bottom-right rank (rotated 180°)
    const botRank = new Text({
      text: rank,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(corner.rankFontSize * s),
        fontWeight: 'bold',
        fill: suit.color,
      },
    });
    botRank.anchor.set(0.5, 0);
    botRank.position.set(w - corner.x * s, h - corner.rankY * s);
    botRank.rotation = Math.PI;
    container.addChild(botRank);

    // Bottom-right suit (rotated 180°)
    const botSuit = new Text({
      text: suit.symbol,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(corner.suitFontSize * s),
        fill: suit.color,
      },
    });
    botSuit.anchor.set(0.5, 0);
    botSuit.position.set(w - corner.x * s, h - corner.suitY * s);
    botSuit.rotation = Math.PI;
    container.addChild(botSuit);

    // Center pip layout
    this.drawCenterPips(container, rank, suit, w, h, s);

    const texture = this.app.renderer.generateTexture({
      target: container,
      resolution: 1,
    });

    container.destroy({ children: true });
    return texture;
  }

  private drawCenterPips(
    container: Container,
    rank: string,
    suit: { symbol: string; color: number },
    w: number,
    h: number,
    s: number,
  ): void {
    switch (rank) {
      case 'J': case 'Q': case 'K':
        this.createFaceCard(container, rank, suit, w, h, s);
        break;
      case 'A':
        this.createAceCard(container, suit, w, h, s);
        break;
      default:
        this.createNumberCard(container, rank, suit, w, h, s);
    }
  }

  private createFaceCard(
    container: Container,
    rank: string,
    suit: { symbol: string; color: number },
    w: number,
    h: number,
    s: number,
  ): void {
    const cx = w / 2;
    const cy = h / 2;
    const { fontSize, decoSize, decoOffsetX, decoOffsetY } = CARD_LAYOUT.face;

    const face = new Text({
      text: rank,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(fontSize * s),
        fontWeight: 'bold',
        fill: suit.color,
      },
    });
    face.anchor.set(0.5);
    face.position.set(cx, cy);
    container.addChild(face);

    const offsets = [
      { x: -decoOffsetX * s, y: -decoOffsetY * s },
      { x: decoOffsetX * s, y: -decoOffsetY * s },
      { x: -decoOffsetX * s, y: decoOffsetY * s },
      { x: decoOffsetX * s, y: decoOffsetY * s },
    ];
    for (const off of offsets) {
      const ds = new Text({
        text: suit.symbol,
        style: { fontFamily: CARD.font, fontSize: Math.round(decoSize * s), fill: suit.color },
      });
      ds.anchor.set(0.5);
      ds.position.set(cx + off.x, cy + off.y);
      container.addChild(ds);
    }
  }

  private createAceCard(
    container: Container,
    suit: { symbol: string; color: number },
    w: number,
    h: number,
    s: number,
  ): void {
    const ace = new Text({
      text: suit.symbol,
      style: {
        fontFamily: CARD.font,
        fontSize: Math.round(CARD_LAYOUT.ace.fontSize * s),
        fill: suit.color,
      },
    });
    ace.anchor.set(0.5);
    ace.position.set(w / 2, h / 2);
    container.addChild(ace);
  }

  private createNumberCard(
    container: Container,
    rank: string,
    suit: { symbol: string; color: number },
    w: number,
    h: number,
    s: number,
  ): void {
    const pipSize = Math.round(CARD_LAYOUT.pip.fontSize * s);
    const positions = this.getPipPositions(parseInt(rank), w, h, s);

    for (const pos of positions) {
      const pip = new Text({
        text: suit.symbol,
        style: {
          fontFamily: CARD.font,
          fontSize: pipSize,
          fill: suit.color,
        },
      });
      pip.anchor.set(0.5);
      pip.position.set(pos.x, pos.y);
      if (pos.flip) pip.rotation = Math.PI;
      container.addChild(pip);
    }
  }

  private getPipPositions(count: number, w: number, h: number, s: number): PipPos[] {
    const { colOffset, edgeOffset, innerOffset } = CARD_LAYOUT.pip;

    const centerX = w / 2;
    const leftCol = centerX - colOffset * s;
    const rightCol = centerX + colOffset * s;

    const topEdge = edgeOffset * s;
    const topInner = innerOffset * s;
    const middle = h / 2;
    const bottomInner = h - innerOffset * s;
    const bottomEdge = h - edgeOffset * s;
    const topMid = (topEdge + middle) / 2;
    const bottomMid = (bottomEdge + middle) / 2;

    const grid = { centerX, leftCol, rightCol, topEdge, topInner, topMid, middle, bottomEdge, bottomInner, bottomMid };
    return (PIP_LAYOUTS[count] ?? PIP_LAYOUTS.default)(grid);
  }
}
