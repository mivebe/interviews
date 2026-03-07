import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { UNICODE_EMOJI_FALLBACK } from './constants';

interface DialogueConfig {
  name: string;
  text: string;
  avatarTexture: Texture | null;
  emojiMap: Map<string, Texture>;
  isLeft: boolean;
  bubbleColor: number;
  scale: number;
  maxBubbleWidth?: number;
  fontScale?: number;
}

export class DialogueRenderer {
  static createBubble(config: DialogueConfig): Container {
    const s = config.scale;
    const fs = config.fontScale ?? s;
    const BUBBLE_PADDING = Math.round(14 * fs);
    const LINE_HEIGHT = Math.round(28 * fs);
    const MAX_BUBBLE_WIDTH = config.maxBubbleWidth ?? Math.round(380 * s);
    const EMOJI_SIZE = Math.round(24 * fs);
    const FONT_SIZE = Math.round(15 * fs);
    const avatarSize = Math.round(44 * fs);
    const avatarGap = Math.round(12 * fs);

    const container = new Container();
    const segments = parseTextWithEmojis(config.text);

    const contentContainer = new Container();
    let cursorX = 0;
    let cursorY = 0;
    let maxRowWidth = 0;
    const maxContentWidth = MAX_BUBBLE_WIDTH - BUBBLE_PADDING * 2;

    const wrapIfNeeded = (itemWidth: number) => {
      if (cursorX + itemWidth > maxContentWidth && cursorX > 0) {
        maxRowWidth = Math.max(maxRowWidth, cursorX);
        cursorX = 0;
        cursorY += LINE_HEIGHT;
      }
    };

    for (const seg of segments) {
      if (seg.type === 'text') {
        const words = seg.value.split(/(\s+)/);
        for (const word of words) {
          if (!word) continue;
          const wordText = new Text({
            text: word,
            style: {
              fontFamily: 'Arial, sans-serif',
              fontSize: FONT_SIZE,
              fill: 0xffffff,
            },
          });

          wrapIfNeeded(wordText.width);
          wordText.position.set(cursorX, cursorY);
          contentContainer.addChild(wordText);
          cursorX += wordText.width;
        }
      } else if (seg.type === 'emoji') {
        const emojiTexture = config.emojiMap.get(seg.value);
        if (emojiTexture) {
          wrapIfNeeded(EMOJI_SIZE);
          const emojiSprite = new Sprite(emojiTexture);
          emojiSprite.width = EMOJI_SIZE;
          emojiSprite.height = EMOJI_SIZE;
          emojiSprite.position.set(cursorX, cursorY + (LINE_HEIGHT - EMOJI_SIZE) / 2);
          contentContainer.addChild(emojiSprite);
          cursorX += EMOJI_SIZE + Math.round(4 * s);
        } else {
          const unicode = UNICODE_EMOJI_FALLBACK[seg.value] ?? '\u2728';
          const fallback = new Text({
            text: unicode,
            style: {
              fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif',
              fontSize: EMOJI_SIZE,
              fill: 0xffffff,
            },
          });
          fallback.position.set(cursorX, cursorY + (LINE_HEIGHT - EMOJI_SIZE) / 2);
          contentContainer.addChild(fallback);
          cursorX += fallback.width + Math.round(4 * s);
        }
      }
    }
    maxRowWidth = Math.max(maxRowWidth, cursorX);
    const contentHeight = cursorY + LINE_HEIGHT;

    const bubbleWidth = Math.min(maxRowWidth + BUBBLE_PADDING * 2, MAX_BUBBLE_WIDTH);
    const bubbleHeight = contentHeight + BUBBLE_PADDING * 2;

    //  Now lay out: avatar + bubble (left) or bubble + avatar (right)
    const bubbleOffsetX = config.isLeft ? avatarSize + avatarGap : 0;
    const avatarX = config.isLeft ? avatarSize / 2 : bubbleWidth + avatarGap + avatarSize / 2;

    // Bubble background
    const bg = new Graphics();
    bg.roundRect(0, 0, bubbleWidth, bubbleHeight, Math.round(10 * fs));
    bg.fill({ color: config.bubbleColor, alpha: 0.9 });
    bg.position.set(bubbleOffsetX, 0);
    container.addChild(bg);

    contentContainer.position.set(bubbleOffsetX + BUBBLE_PADDING, BUBBLE_PADDING);
    container.addChild(contentContainer);

    // Character name
    const nameText = new Text({
      text: config.name,
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.round(12 * fs),
        fontWeight: 'bold',
        fill: 0x888899,
      },
    });
    nameText.position.set(bubbleOffsetX + BUBBLE_PADDING, Math.round(-16 * fs));
    container.addChild(nameText);

    // Avatar
    if (config.avatarTexture) {
      const avatar = new Sprite(config.avatarTexture);
      avatar.width = avatarSize;
      avatar.height = avatarSize;
      avatar.anchor.set(0.5);
      avatar.position.set(avatarX, avatarSize / 2);
      container.addChild(avatar);

      const circleMask = new Graphics();
      circleMask.circle(avatar.x, avatar.y, avatarSize / 2);
      circleMask.fill({ color: 0xffffff });
      container.addChild(circleMask);
      avatar.mask = circleMask;
    } else if (!config.isLeft) {
      // Reserve avatar space on right side so no-avatar bubbles align with avatar ones
      const spacer = new Graphics();
      spacer.rect(bubbleWidth + avatarGap, 0, avatarSize, 1);
      spacer.fill({ color: 0x000000, alpha: 0 });
      container.addChild(spacer);
    }

    return container;
  }
}

interface TextSegment {
  type: 'text' | 'emoji';
  value: string;
}

/** Split text into plain-text and `{emojiName}` segments for inline rendering */
function parseTextWithEmojis(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\{(\w+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'emoji', value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}
