import worldImage from '../assets/world.jpg';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Sprite } from './sprite';

export class World implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public async initialise() {
    this.image = await loadImage(worldImage);
    this.image.width = this.context.canvas.width;
    this.image.height = this.context.canvas.height;
  }

  update(): void {
    throw new Error('Method not implemented');
  }

  public async draw() {
    if (!this.image) {
      throw new Error('World has not been initialised');
    }

    drawSprite(this.context, this.image, this.x, this.y, this.scale);
  }
}
