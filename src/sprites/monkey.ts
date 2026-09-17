import monkeyImage from '../assets/monkey.png';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { SpriteSettings } from '../types/sprite-settings';
import type { Sprite } from './sprite';

export class Monkey implements Sprite {
  private readonly context: CanvasRenderingContext2D;
  private image: HTMLImageElement | null = null;
  private settings: SpriteSettings | null = null;
  private flipped = false;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  update(): void {
    if (!this.settings) {
      throw new Error('Monkey has not been initialised');
    }

    if (Math.random() >= 0.99) {
      this.flipped = !this.flipped;
    }
  }

  public async initialise(settings: SpriteSettings) {
    this.image = await loadImage(monkeyImage);

    this.settings = { ...settings, width: this.image.width, height: this.image.height };
  }

  public async draw() {
    if (!this.image || !this.settings) {
      throw new Error('Monkey has not been initialised');
    }

    if (!this.settings.width) {
      throw new Error('Monkey has no width');
    }

    this.context.save();
    if (this.flipped) {
      this.context.scale(-1, 1);

      drawSprite(this.context, this.image, { ...this.settings, x: -this.settings.x - this.settings.width });
    } else {
      drawSprite(this.context, this.image, this.settings);
    }

    this.context.restore();
  }
}
