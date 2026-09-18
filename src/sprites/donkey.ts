import donkeyImage from '../assets/donkey.png';
import wheelImage from '../assets/wheel.png';
import { DONKEY_DEFAULTS, KEYS } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, loadImage } from '../game/graphics';
import type { Keyboard } from '../game/keyboard';
import type { Sprite } from './sprite';

export class Donkey implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public readonly keyboard: Keyboard;
  public image: HTMLImageElement | null = null;
  public wheelImage: HTMLImageElement | null = null;
  public x: number = 0;
  public y: number = 0;
  public scale: number = 1;
  private moveSpeed: number = 0;
  private wheelAngle = 0;

  constructor(gameCanvas: GameCanvas, keyboard: Keyboard) {
    this.context = gameCanvas.context;
    this.keyboard = keyboard;
  }

  update(): void {
    if (this.keyboard.isDown(KEYS.a) || this.keyboard.isDown(KEYS.left)) {
      this.x = this.x - (this.moveSpeed ?? 1);
      this.wheelAngle = (this.wheelAngle - DONKEY_DEFAULTS.wheelTurnSpeed) % 360;
    }

    if (this.keyboard.isDown(KEYS.d) || this.keyboard.isDown(KEYS.right)) {
      this.x = this.x + (this.moveSpeed ?? 1);
      this.wheelAngle = (this.wheelAngle + DONKEY_DEFAULTS.wheelTurnSpeed) % 360;
    }
  }

  public async initialise(x: number, y: number, scale: number, moveSpeed: number = 0) {
    this.image = await loadImage(donkeyImage);
    this.wheelImage = await loadImage(wheelImage);

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.moveSpeed = moveSpeed;
  }

  public async draw() {
    if (!this.image) {
      throw new Error('Donkey has not been initialised');
    }

    this.drawDonkey();
    this.drawWheel(DONKEY_DEFAULTS.wheelOffsetXLeft, this.wheelAngle);
    this.drawWheel(DONKEY_DEFAULTS.wheelOffsetXRight, this.wheelAngle + (180 % 360));
  }

  private drawDonkey() {
    if (!this.image) {
      throw new Error('Donkey has not been initialised');
    }

    drawSprite(this.context, this.image, this.x, this.y, this.scale);
  }

  private drawWheel(xOffset: number, angle: number) {
    if (!this.wheelImage) {
      throw new Error('Donkey has not been initialised');
    }

    const wheelScale = DONKEY_DEFAULTS.scale + DONKEY_DEFAULTS.wheelScale;
    const width = this.wheelImage.width * wheelScale;
    const height = this.wheelImage.height * wheelScale;
    const centerX = this.x + xOffset + width / 2;
    const centerY = this.y + DONKEY_DEFAULTS.wheelOffsetY + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(angle);
    drawSprite(this.context, this.wheelImage, -width / 2, -height / 2, wheelScale);

    this.context.restore();
  }
}
