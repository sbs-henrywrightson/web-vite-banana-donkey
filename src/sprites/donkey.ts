import donkeyImage from '../assets/donkey.png';
import wheelImage from '../assets/wheel.png';
import { DONKEY_DEFAULTS, KEYS, SCREEN_SIZE } from '../constants';
import type { GameCanvas } from '../game/game-canvas';
import { drawSprite, getSpriteHitBox, loadImage } from '../game/graphics';
import type { Keyboard } from '../game/keyboard';
import type { Coordinate } from '../types';
import type { Sprite } from './sprite';

export class Donkey implements Sprite {
  public readonly context: CanvasRenderingContext2D;
  public readonly keyboard: Keyboard;
  public image: HTMLImageElement | null = null;
  public wheelImage: HTMLImageElement | null = null;
  public position: Coordinate = { x: 0, y: 0 };
  public scale: number = 1;
  private moveSpeed: number = 0;
  private wheelAngle = 0;

  constructor(gameCanvas: GameCanvas, keyboard: Keyboard) {
    this.context = gameCanvas.context;
    this.keyboard = keyboard;
  }

  public async initialise(x: number, y: number, scale: number, moveSpeed: number = 0) {
    this.image = await loadImage(donkeyImage);
    this.wheelImage = await loadImage(wheelImage);

    this.position = { x, y };
    this.scale = scale;
    this.moveSpeed = moveSpeed;
  }

  update(deltaTime: number): void {
    if (!this.image || !this.wheelImage) {
      throw new Error('Donkey has not been initialised');
    }

    if (this.keyboard.isDown(KEYS.a) || this.keyboard.isDown(KEYS.left)) {
      const newX = this.position.x - this.moveSpeed * deltaTime;
      if (newX <= 5 * this.scale) {
        return;
      }
      this.position.x = newX;
      this.wheelAngle = (this.wheelAngle - DONKEY_DEFAULTS.wheelTurnSpeed) % 360;
    }

    if (this.keyboard.isDown(KEYS.d) || this.keyboard.isDown(KEYS.right)) {
      const newX = this.position.x + this.moveSpeed * deltaTime;
      if (
        newX >=
        SCREEN_SIZE.width - this.image.width * this.scale - (this.wheelImage.width * DONKEY_DEFAULTS.wheelScale) / 2
      ) {
        return;
      }
      this.position.x = newX;
      this.wheelAngle = (this.wheelAngle + DONKEY_DEFAULTS.wheelTurnSpeed) % 360;
    }
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

    drawSprite(this.context, this.image, this.position.x, this.position.y, this.scale);
  }

  private drawWheel(xOffset: number, angle: number) {
    if (!this.wheelImage) {
      throw new Error('Donkey has not been initialised');
    }

    const wheelScale = DONKEY_DEFAULTS.scale - DONKEY_DEFAULTS.wheelScale;
    const width = this.wheelImage.width * wheelScale;
    const height = this.wheelImage.height * wheelScale;
    const centerX = this.position.x + xOffset + width / 2;
    const centerY = this.position.y + DONKEY_DEFAULTS.wheelOffsetY + height / 2;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(angle);
    drawSprite(this.context, this.wheelImage, -width / 2, -height / 2, wheelScale);

    this.context.restore();
  }

  public async drawBox() {
    if (!this.image) {
      throw new Error('Donkey has not been initialised');
    }

    const hitBox = getSpriteHitBox(this, DONKEY_DEFAULTS.hitBoxScale);
    this.context.strokeRect(hitBox.p1.x, hitBox.p1.y, hitBox.p2.x - hitBox.p1.x, hitBox.p2.y - hitBox.p1.y);
  }
}
