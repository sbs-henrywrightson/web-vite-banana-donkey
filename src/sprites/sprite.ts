import type { Coordinate } from '../types';

export interface Sprite {
  context: CanvasRenderingContext2D;
  image: HTMLImageElement | null;

  position: Coordinate;
  scale: number;

  initialise(x: number, y: number, scale: number): Promise<void>;
  update(deltaTime?: number): void;
  draw(context: CanvasRenderingContext2D): void;
}
