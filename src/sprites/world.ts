import worldImage from '../assets/images/world.jpg';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Coordinate } from '../types';
import type { Sprite } from './sprite';

export class World implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  public position: Coordinate = { x: 0, y: 0 };
  public scale: number = 1;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public async initialise() {
    this.image = await loadImage(worldImage);
    this.image.width = this.context.canvas.width;
    this.image.height = this.context.canvas.height;
  }

  update(): void {}

  public async draw() {
    if (!this.image) {
      throw new Error('World has not been initialised');
    }

    drawSprite(this.context, this.image, this.position.x, this.position.y, this.scale);
  }
}
