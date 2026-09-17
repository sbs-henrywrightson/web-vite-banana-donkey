import donkeyImage from '../assets/donkey.png';
import { KEYS } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Keyboard } from '../game/keyboard';
import type { SpriteSettings } from '../types/sprite-settings';
import type { Sprite } from './sprite';

export class Donkey implements Sprite {
  private readonly context: CanvasRenderingContext2D;
  private readonly keyboard: Keyboard;
  private image: HTMLImageElement | null = null;
  private settings: SpriteSettings | null = null;
  private direction: 'left' | 'right' = 'left';

  constructor(gameCanvas: GameCanvas, keyboard: Keyboard) {
    this.context = gameCanvas.context;
    this.keyboard = keyboard;
  }

  update(): void {
    if (!this.settings) {
      throw new Error('Donkey has not been initialised');
    }

    if (this.keyboard.isDown(KEYS.a) || this.keyboard.isDown(KEYS.left)) {
      this.settings.x = this.settings.x - (this.settings.moveSpeed ?? 1);
      this.direction = 'left';
    }

    if (this.keyboard.isDown(KEYS.d) || this.keyboard.isDown(KEYS.right)) {
      this.settings.x = this.settings.x + (this.settings.moveSpeed ?? 1);
      this.direction = 'right';
    }
  }

  public async initialise(settings: SpriteSettings) {
    this.image = await loadImage(donkeyImage);

    this.settings = { ...settings, width: this.image.width, height: this.image.height };
  }

  public async draw() {
    if (!this.image || !this.settings) {
      throw new Error('Donkey has not been initialised');
    }

    if (!this.settings.width) {
      throw new Error('Donkey has no width');
    }

    this.context.save();
    if (this.direction === 'right') {
      this.context.scale(-1, 1);

      drawSprite(this.context, this.image, { ...this.settings, x: -this.settings.x - this.settings.width });
    } else {
      drawSprite(this.context, this.image, this.settings);
    }

    this.context.restore();
  }
}
