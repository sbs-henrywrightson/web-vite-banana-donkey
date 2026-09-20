import { BANANA_DEFAULTS, DONKEY_DEFAULTS, MONKEY_DEFAULTS } from '../constants';
import { Banana } from '../sprites/banana';
import { Donkey } from '../sprites/donkey';
import { Monkey } from '../sprites/monkey';
import { TouchMarker } from '../sprites/touchMarker';
import { World } from '../sprites/world';
import { GameCanvas } from './game-canvas';
import { clearCanvas, getSpriteHitBox } from './graphics';
import { Keyboard } from './keyboard';
import { Sounds } from './sounds';
import { UI } from './ui';
import { intersect, isMobile, randomNumber } from './utilities';

export class Game {
  private readonly gameCanvas: GameCanvas;
  private readonly world: World;
  private readonly touchMarker!: TouchMarker;
  private readonly donkey: Donkey;
  private readonly monkey: Monkey;
  private readonly sounds: Sounds;
  private readonly ui: UI;

  private score = 0;
  private highScore = 0;
  private lives = 0;
  private newHighScore = false;

  private bananas: Banana[] = [];
  private previousFrameTime: number = 0.1;
  private spawnTimer = 0;

  private frame = (timeStamp: number) => void this.renderFrame(timeStamp);

  constructor() {
    this.gameCanvas = new GameCanvas();

    this.world = new World(this.gameCanvas);
    if (isMobile()) {
      this.touchMarker = new TouchMarker(this.gameCanvas);
    }
    this.donkey = new Donkey(this.gameCanvas, new Keyboard(this.gameCanvas.canvas));
    this.monkey = new Monkey(this.gameCanvas);

    this.sounds = new Sounds();
    this.ui = new UI(this.gameCanvas);

    this.readHighScore();
    this.resetScore();
  }

  private readHighScore() {
    const highScore = localStorage.getItem('highScore') ?? '0';
    this.highScore = Number(highScore);
  }

  private writeHighScore() {
    localStorage.setItem('highScore', this.highScore.toString());
  }

  public async initialise() {
    await this.world.initialise();
    if (isMobile()) {
      await this.touchMarker.initialise(30, 30, 1);
    }

    await this.donkey.initialise(
      DONKEY_DEFAULTS.x,
      DONKEY_DEFAULTS.y,
      DONKEY_DEFAULTS.scale,
      DONKEY_DEFAULTS.moveSpeed,
    );

    await this.monkey.initialise(MONKEY_DEFAULTS.x, MONKEY_DEFAULTS.y, MONKEY_DEFAULTS.scale);
  }

  public async play() {
    await this.drawGame();

    await this.ui.displayWelcomeMessage();

    requestAnimationFrame(this.frame);
  }

  private renderFrame(timeStamp: number) {
    const deltaTime = Math.min((timeStamp - this.previousFrameTime) / 1000, 0.1);
    this.previousFrameTime = timeStamp;

    this.donkey.update(deltaTime);
    this.monkey.update();
    this.spawnBanana(deltaTime);

    const bananasToRemove = new Set<Banana>();
    for (const banana of this.bananas) {
      banana.update(deltaTime);
      const caught = this.hasCaughtBanana(banana, this.donkey);
      if (caught) {
        this.incrementScore();
        this.sounds.playCatchBanana();
        bananasToRemove.add(banana);
      }

      if (banana.onGround) {
        this.decrementLives();
        this.sounds.playDropBanana();
        bananasToRemove.add(banana);
      }
    }

    this.bananas = this.bananas.filter((banana) => !bananasToRemove.has(banana));

    this.drawGame();

    if (this.lives === 0) {
      void this.handleDeath();
      return;
    }

    requestAnimationFrame(this.frame);
  }

  private async handleDeath() {
    await this.ui.displayDeathMessage(this.newHighScore);
    await this.restartGame();
    requestAnimationFrame(this.frame);
  }

  private drawGame() {
    clearCanvas(this.gameCanvas);
    this.world.draw();
    if (isMobile()) {
      this.touchMarker.draw();
    }
    this.ui.drawUI();
    this.ui.drawScore(this.score, this.highScore, this.lives);
    this.donkey.draw();
    this.monkey.draw();

    for (const banana of this.bananas) {
      banana.draw();
    }
  }

  private hasCaughtBanana(banana: Banana, donkey: Donkey): boolean {
    if (!donkey.image) {
      throw new Error('Banana has not been initialised');
    }

    const bananaBox = getSpriteHitBox(banana);
    const donkeyBox = getSpriteHitBox(donkey, DONKEY_DEFAULTS.hitBoxScale);
    return intersect(bananaBox, donkeyBox);
  }

  private spawnBanana(deltaTime: number) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer < MONKEY_DEFAULTS.throwFrequency) {
      return;
    }

    this.spawnTimer = 0;

    if (randomNumber(0, MONKEY_DEFAULTS.throwChance) !== 0) {
      return;
    }

    const banana = new Banana(this.gameCanvas);
    void this.initialiseBanana(banana);
  }

  private async initialiseBanana(banana: Banana) {
    await banana.initialise(BANANA_DEFAULTS.x, BANANA_DEFAULTS.y, BANANA_DEFAULTS.scale, BANANA_DEFAULTS.moveSpeed);
    this.bananas.push(banana);
    this.monkey.throwBanana();
    this.sounds.playThrowBanana();
  }

  private async restartGame() {
    this.resetScore();
    this.bananas = [];

    await this.donkey.initialise(
      DONKEY_DEFAULTS.x,
      DONKEY_DEFAULTS.y,
      DONKEY_DEFAULTS.scale,
      DONKEY_DEFAULTS.moveSpeed,
    );
  }

  private resetScore() {
    this.score = 0;
    this.lives = 3;
    this.newHighScore = false;
  }

  private incrementScore() {
    this.score++;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.writeHighScore();
      this.newHighScore = true;
    }
  }

  private decrementLives() {
    this.lives--;
  }
}
