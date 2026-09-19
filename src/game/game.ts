import { BANANA_DEFAULTS, DONKEY_DEFAULTS, MONKEY_DEFAULTS } from '../constants';
import { Banana } from '../sprites/banana';
import { Donkey } from '../sprites/donkey';
import { Monkey } from '../sprites/monkey';
import { World } from '../sprites/world';
import { GameCanvas } from './game-canvas';
import { clearCanvas, getSpriteHitBox } from './graphics';
import { Keyboard } from './keyboard';
import { Sounds } from './sounds';
import { intersect, randomNumber } from './utilities';

export class Game {
  private readonly gameCanvas: GameCanvas;
  private readonly world: World;
  private readonly donkey: Donkey;
  private readonly monkey: Monkey;
  private bananas: Banana[] = [];
  private previousFrameTime: number = 0.1;
  private spawnTimer = 0;
  private sounds = new Sounds();

  private frame = (timeStamp: number) => void this.renderFrame(timeStamp);

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

  private async renderFrame(timeStamp: number) {
    const deltaTime = Math.min((timeStamp - this.previousFrameTime) / 1000, 0.1);
    this.previousFrameTime = timeStamp;

    this.donkey.update(deltaTime);
    this.monkey.update();
    await this.spawnBanana(deltaTime);

    for (const banana of this.bananas) {
      banana.update(deltaTime);
      if (this.isBananaOnDonkey(banana, this.donkey)) {
        this.sounds.playCatchBanana();
      }

      if (banana.onGround) {
        this.sounds.playDropBanana();
      }
      //banana.drawFilledBox();
      // } else {
      //   banana.drawBox();
      // }
    }

    this.bananas = this.bananas.filter((banana) => !banana.onGround && !this.isBananaOnDonkey(banana, this.donkey));

    clearCanvas(this.gameCanvas);

    await this.world.draw();

    //this.donkey.drawBox();
    await this.donkey.draw();

    await this.monkey.draw();
    for (const banana of this.bananas) {
      await banana.draw();
    }

    requestAnimationFrame(this.frame);
  }

  private isBananaOnDonkey(banana: Banana, donkey: Donkey): boolean {
    if (!donkey.image) {
      throw new Error('Banana has not been initialised');
    }

    const bananaBox = getSpriteHitBox(banana);
    const donkeyBox = getSpriteHitBox(donkey, DONKEY_DEFAULTS.hitBoxScale);
    return intersect(bananaBox, donkeyBox);
  }

  private async spawnBanana(deltaTime: number) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer < MONKEY_DEFAULTS.throwFrequency) {
      return;
    }

    this.spawnTimer = 0;

    if (randomNumber(0, MONKEY_DEFAULTS.throwChance) !== 0) {
      return;
    }

    const banana = new Banana(this.gameCanvas);
    await banana.initialise(BANANA_DEFAULTS.x, BANANA_DEFAULTS.y, BANANA_DEFAULTS.scale, BANANA_DEFAULTS.moveSpeed);
    this.bananas.push(banana);
    this.monkey.throwBanana();
    this.sounds.playThrowBanana();
  }
}
