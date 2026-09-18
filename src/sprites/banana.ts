import bananaImage from '../assets/banana.png';
import { BANANA_DEFAULTS, DONKEY_DEFAULTS } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import { randomNumber } from '../game/utilities';
import type { Sprite } from './sprite';

export class Banana implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;
  private moveSpeed: number = 0;
  private angle = randomNumber(0, 359);

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public get onGround(): boolean {
    return this.y >= DONKEY_DEFAULTS.groundLevel;
  }

  update(): void {
    this.angle = (this.angle - BANANA_DEFAULTS.spinSpeed) % 360;

    this.move();
  }

  private move() {
    this.x = this.x - this.moveSpeed;
    this.y = this.y + this.moveSpeed;
  }

  public async initialise(x: number, y: number, scale: number, moveSpeed: number = 0) {
    this.image = await loadImage(bananaImage);

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.moveSpeed = moveSpeed;
  }

  public async draw() {
    if (!this.image) {
      throw new Error('Banana has not been initialised');
    }

    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    const centerX = this.x + width / 2;
    const centerY = this.y + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(this.angle);

    drawSprite(this.context, this.image, -width / 2, -height / 2, this.scale);

    this.context.restore();
  }
}
