import { Donkey } from '../sprites/donkey';
import { Monkey } from '../sprites/monkey';
import { World } from '../sprites/world';
import { GameCanvas } from './game-canvas';
import { clearCanvas } from './graphics';
import { Keyboard } from './keyboard';

export class Game {
  private readonly gameCanvas: GameCanvas;
  private readonly world: World;
  private readonly donkey: Donkey;
  private readonly monkey: Monkey;

  private frame = () => void this.renderFrame();

  constructor() {
    this.gameCanvas = new GameCanvas();

    this.world = new World(this.gameCanvas);

    this.donkey = new Donkey(this.gameCanvas, new Keyboard());
    this.monkey = new Monkey(this.gameCanvas);
  }

  public async initialise() {
    await this.world.initialise();
    await this.donkey.initialise({ x: 290, y: 350, scale: 0.75, moveSpeed: 2 });
    await this.monkey.initialise({ x: 610, y: 150, scale: 0.75 });
  }

  public async play() {
    requestAnimationFrame(this.frame);
  }

  private async renderFrame() {
    this.donkey.update();
    this.monkey.update();

    clearCanvas(this.gameCanvas);

    await this.world.draw();
    await this.donkey.draw();
    await this.monkey.draw();

    requestAnimationFrame(this.frame);
  }
}
