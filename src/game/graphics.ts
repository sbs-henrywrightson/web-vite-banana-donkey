import type { Sprite } from '../sprites/sprite';
import type { Coordinate, Rectangle } from '../types';
import type { GameCanvas } from './game-canvas';

export async function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = path;
  });
}

export function drawSprite(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
) {
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, x, y, width, height);
}

export function clearCanvas(gameCanvas: GameCanvas) {
  gameCanvas.context.clearRect(0, 0, gameCanvas.context.canvas.width, gameCanvas.context.canvas.height);
}

export function bezierCurve(start: Coordinate, centre: Coordinate, end: Coordinate, t: number): Coordinate {
  const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * centre.x + t ** 2 * end.x;
  const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * centre.y + t ** 2 * end.y;
  return { x, y };
}

export function getSpriteHitBox(sprite: Sprite, hitScale: number = 1): Rectangle {
  if (!sprite.image) {
    throw new Error('Banana has not been initialised');
  }

  return {
    p1: { x: sprite.position.x * hitScale, y: sprite.position.y * hitScale },
    p2: {
      x: sprite.position.x / hitScale + sprite.image.width * sprite.scale,
      y: sprite.position.y / hitScale + sprite.image.height * sprite.scale,
    },
  };
}
