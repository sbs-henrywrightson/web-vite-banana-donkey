import bananaImage from '../assets/images/banana.png';
import { BANANA_DEFAULTS } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { bezierCurve, drawSprite, loadImage } from '../game/graphics';
import { randomNumber } from '../game/utilities';
import type { Coordinate } from '../types';
import type { Sprite } from './sprite';

export class Banana implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public image: HTMLImageElement | null = null;
  public position: Coordinate = { x: 0, y: 0 };
  private start: Coordinate = { x: 0, y: 0 };
  private centre: Coordinate = { x: 0, y: 0 };
  private end: Coordinate = { x: 0, y: 0 };
  private progress: number = 0;
  public scale: number = 1;
  private moveSpeed: number = 0;
  private angle = randomNumber(0, 359);

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;
  }

  public get onGround(): boolean {
    return this.position.y >= BANANA_DEFAULTS.groundLevel;
  }

  public async initialise(x: number, y: number, scale: number, moveSpeed: number = 0) {
    this.image = await loadImage(bananaImage);

    this.scale = scale;
    this.position = { x, y };
    this.chooseCurve();
    this.moveSpeed = moveSpeed;
  }

  chooseCurve() {
    if (!this.image) {
      throw new Error('Banana has not been initialised');
    }

    const peakY = this.image.height * this.scale;

    this.start = { ...this.position };
    this.end = {
      x: randomNumber(BANANA_DEFAULTS.curveEndLeft, BANANA_DEFAULTS.curveEndRight),
      y: BANANA_DEFAULTS.groundLevel,
    };
    this.centre = {
      x: this.end.x + (this.start.x - this.end.x) / 2,
      y: (4 * peakY - this.start.y - this.end.y) / 2,
    };
  }

  update(deltaTime: number): void {
    this.angle = (this.angle - BANANA_DEFAULTS.spinSpeed * deltaTime) % 360;

    this.move(deltaTime);
  }

  private move(deltaTime: number) {
    this.progress += this.moveSpeed * deltaTime;

    this.position = bezierCurve(this.start, this.centre, this.end, this.progress);
    // this.position.x = this.position.x - this.moveSpeed;
    // this.position.y = this.position.y + this.moveSpeed;
  }

  public draw() {
    if (!this.image) {
      throw new Error('Banana has not been initialised');
    }

    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    const centerX = this.position.x + width / 2;
    const centerY = this.position.y + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(this.angle);

    drawSprite(this.context, this.image, -width / 2, -height / 2, this.scale);
    this.context.bezierCurveTo;

    this.context.restore();
  }
}
