import touchImage from '../assets/images/touch-marker.png';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Coordinate } from '../types';
import type { Sprite } from './sprite';

export class TouchMarker implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  public position: Coordinate = { x: 20, y: 550 };
  public scale: number = 1;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public async initialise(x: number, y: number, scale: number) {
    this.image = await loadImage(touchImage);
    this.position = { x, y };
    this.scale = scale;
  }

  update(): void {}

  public async draw() {
    if (!this.image) {
      throw new Error('Touch has not been initialised');
    }

    const y = this.context.canvas.height - this.position.y - this.image.height;
    drawSprite(this.context, this.image, this.position.x, y, this.scale);
    drawSprite(this.context, this.image, this.context.canvas.width - this.position.x - this.image.width, y, this.scale);
  }
}
