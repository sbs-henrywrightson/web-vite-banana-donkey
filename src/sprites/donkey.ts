import donkeyImage from '../assets/donkey.png';
import { KEYS } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Keyboard } from '../game/keyboard';
import type { Sprite } from './sprite';

export class Donkey implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public readonly keyboard: Keyboard;
  public image: HTMLImageElement | null = null;
  private direction: 'left' | 'right' = 'left';
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;
  private moveSpeed: number = 0;

  constructor(gameCanvas: GameCanvas, keyboard: Keyboard) {
    this.context = gameCanvas.context;
    this.keyboard = keyboard;
  }

  update(): void {
    if (this.keyboard.isDown(KEYS.a) || this.keyboard.isDown(KEYS.left)) {
      this.x = this.x - (this.moveSpeed ?? 1);
      this.direction = 'left';
    }

    if (this.keyboard.isDown(KEYS.d) || this.keyboard.isDown(KEYS.right)) {
      this.x = this.x + (this.moveSpeed ?? 1);
      this.direction = 'right';
    }
  }

  public async initialise(x: number, y: number, scale: number, moveSpeed: number = 0) {
    this.image = await loadImage(donkeyImage);

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.moveSpeed = moveSpeed;
  }

  public async draw() {
    if (!this.image) {
      throw new Error('Donkey has no image');
    }

    this.context.save();
    if (this.direction === 'right') {
      this.context.scale(-1, 1);

      drawSprite(this.context, this.image, -this.x - this.image.width, this.y, this.scale);
    } else {
      drawSprite(this.context, this.image, this.x, this.y, this.scale);
    }

    this.context.restore();
  }
}
