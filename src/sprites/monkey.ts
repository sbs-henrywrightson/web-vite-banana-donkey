import monkeyImage from '../assets/monkey.png';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Sprite } from './sprite';

export class Monkey implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  private flipped = false;
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;

  private lastBananaThrowDate = new Date();
  public get lastBananaThrowTime(): number {
    return this.lastBananaThrowDate.getTime();
  }

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  update(): void {}

  public async initialise(x: number, y: number, scale: number) {
    this.image = await loadImage(monkeyImage);

    this.x = x;
    this.y = y;
    this.scale = scale;
  }

  public async draw() {
    if (!this.image) {
      throw new Error('Monkey has not been initialised');
    }

    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    const centerX = this.x + width / 2;
    const centerY = this.y + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.scale(this.flipped ? -1 : 1, 1);
    drawSprite(this.context, this.image, -width / 2, -height / 2, this.scale);
    this.context.restore();
  }

  public throwBanana() {
    this.lastBananaThrowDate = new Date();
    this.flipped = !this.flipped;
  }
}
