import { BANANA_DEFAULTS, DONKEY_DEFAULTS, MONKEY_DEFAULTS } from '../constants';
import { Banana } from '../sprites/banana';
import { Donkey } from '../sprites/donkey';
import { Monkey } from '../sprites/monkey';
import { World } from '../sprites/world';
import { GameCanvas } from './game-canvas';
import { clearCanvas } from './graphics';
import { Keyboard } from './keyboard';
import { randomNumber } from './utilities';

export class Game {
  private readonly gameCanvas: GameCanvas;
  private readonly world: World;
  private readonly donkey: Donkey;
  private readonly monkey: Monkey;
  private bananas: Banana[] = [];

  private frame = () => void this.renderFrame();

  constructor() {
    this.gameCanvas = new GameCanvas();

    this.world = new World(this.gameCanvas);

    this.donkey = new Donkey(this.gameCanvas, new Keyboard());
    this.monkey = new Monkey(this.gameCanvas);
  }

  public async initialise() {
    await this.world.initialise();
    await this.donkey.initialise(
      DONKEY_DEFAULTS.x,
      DONKEY_DEFAULTS.y,
      DONKEY_DEFAULTS.scale,
      DONKEY_DEFAULTS.moveSpeed,
    );
    await this.monkey.initialise(MONKEY_DEFAULTS.x, MONKEY_DEFAULTS.y, MONKEY_DEFAULTS.scale);
  }

  public async play() {
    requestAnimationFrame(this.frame);
  }

  private async renderFrame() {
    this.donkey.update();
    this.monkey.update();
    await this.spawnBanana();

    for (const banana of this.bananas) {
      banana.update();
    }

    this.bananas = this.bananas.filter((banana) => !banana.onGround);

    clearCanvas(this.gameCanvas);

    await this.world.draw();
    await this.donkey.draw();
    await this.monkey.draw();

    for (const banana of this.bananas) {
      await banana.draw();
    }

    requestAnimationFrame(this.frame);
  }

  private async spawnBanana() {
    if (new Date().getTime() - this.monkey.lastBananaThrowTime > MONKEY_DEFAULTS.throwDelay) {
      if (randomNumber(0, 100) === 0) {
        const banana = new Banana(this.gameCanvas);
        await banana.initialise(BANANA_DEFAULTS.x, BANANA_DEFAULTS.y, BANANA_DEFAULTS.scale, BANANA_DEFAULTS.moveSpeed);
        this.bananas.push(banana);
        this.monkey.throwBanana();
      }
    }
  }
}
