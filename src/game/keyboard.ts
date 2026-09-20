import { KEYS, SCREEN_SIZE } from '../constants';

export class Keyboard {
  private readonly keysDown = new Set<string>();
  private readonly canvas: HTMLCanvasElement;
  private touchKey: string | null = null;
  private touchPointerId: number | null = null;
  private touchBounds: DOMRect | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.clear);

    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerEnd);
    canvas.addEventListener('pointercancel', this.handlePointerEnd);
  }

  public isDown(key: string): boolean {
    return this.keysDown.has(key) || this.touchKey === key;
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      return;
    }

    this.touchPointerId = event.pointerId;
    this.touchBounds = this.canvas.getBoundingClientRect();
    this.canvas.setPointerCapture(event.pointerId);
    this.updateTouchKey(event);
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId === this.touchPointerId) {
      this.updateTouchKey(event);
    }
  };

  private handlePointerEnd = (event: PointerEvent) => {
    if (event.pointerId !== this.touchPointerId) {
      return;
    }

    this.touchKey = null;
    this.touchPointerId = null;
    this.touchBounds = null;
  };

  private updateTouchKey(event: PointerEvent) {
    if (!this.touchBounds) {
      return;
    }

    const bounds = this.touchBounds;
    const canvasX = ((event.clientX - bounds.left) / bounds.width) * SCREEN_SIZE.width;

    this.touchKey = canvasX < SCREEN_SIZE.width / 2 ? KEYS.left : KEYS.right;
  }

  public handleKeyDown = (event: KeyboardEvent) => {
    this.keysDown.add(event.code);
  };

  public handleKeyUp = (event: KeyboardEvent) => {
    this.keysDown.delete(event.code);
  };

  public clear = () => {
    this.keysDown.clear();
    this.touchKey = null;
    this.touchPointerId = null;
    this.touchBounds = null;
  };
}
