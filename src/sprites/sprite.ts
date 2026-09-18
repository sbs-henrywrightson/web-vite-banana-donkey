export interface Sprite {
  context: CanvasRenderingContext2D;
  image: HTMLImageElement | null;

  x: number;
  y: number;
  scale: number;

  initialise(x: number, y: number, scale: number): Promise<void>;
  update(): void;
  draw(context: CanvasRenderingContext2D): void;
}
