import monkeyImage from '../assets/monkey.png';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Coordinate } from '../types';
import type { Sprite } from './sprite';

export class Monkey implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  private flipped = false;
  public position: Coordinate = { x: 0, y: 0 };
  public scale: number = 1;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public async initialise(x: number, y: number, scale: number) {
    this.image = await loadImage(monkeyImage);

    this.position = { x, y };
    this.scale = scale;
  }

  update(): void {}

  public async draw() {
    if (!this.image) {
      throw new Error('Monkey has not been initialised');
    }

    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    const centerX = this.position.x + width / 2;
    const centerY = this.position.y + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.scale(this.flipped ? -1 : 1, 1);
    drawSprite(this.context, this.image, -width / 2, -height / 2, this.scale);
    this.context.restore();
  }

  public throwBanana() {
    this.flipped = !this.flipped;
  }
}
