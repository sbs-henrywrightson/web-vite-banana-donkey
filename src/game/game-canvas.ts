import { SCREEN_SIZE } from '../constants';

export class GameCanvas {
  private readonly _context: CanvasRenderingContext2D;
  private readonly _canvas: HTMLCanvasElement;

  constructor() {
    this._canvas = document.querySelector<HTMLCanvasElement>('#game')!;
    this._canvas.width = SCREEN_SIZE.width;
    this._canvas.height = SCREEN_SIZE.height;

    this._context = this._canvas.getContext('2d')!;
    this._context.fillStyle;
  }

  public get context(): CanvasRenderingContext2D {
    return this._context;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
}
