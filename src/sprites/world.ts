import worldImage from '../assets/world.jpg';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { SpriteSettings } from '../types/sprite-settings';
import type { Sprite } from './sprite';

export class World implements Sprite {
  private readonly context: CanvasRenderingContext2D;
  private readonly spriteSettings: SpriteSettings;
  private image: HTMLImageElement | null = null;

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
    this.spriteSettings = {
      x: 0,
      y: 0,
      scale: 1,
      width: gameCanvas.canvas.width,
      height: gameCanvas.canvas.height,
      moveSpeed: 0,
    };
  }

  public async initialise() {
    this.image = await loadImage(worldImage);
  }

  update(): void {
    throw new Error('Method not implemented');
  }

  public async draw() {
    if (!this.image) {
      throw new Error('World has not been initialised');
    }

    drawSprite(this.context, this.image, this.spriteSettings);
  }
}
