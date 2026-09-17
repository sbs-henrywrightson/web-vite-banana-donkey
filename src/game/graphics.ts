import type { SpriteSettings } from '../types/sprite-settings';
import type { GameCanvas } from './game-canvas';

export async function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = path;
  });
}

export function drawSprite(context: CanvasRenderingContext2D, image: HTMLImageElement, settings: SpriteSettings) {
  if (!settings.width || !settings.height) {
    throw new Error('Sprite dimensions not initialised');
  }

  const width = settings.width * settings.scale;
  const height = settings.height * settings.scale;
  context.drawImage(image, settings.x, settings.y, width, height);
}

export function clearCanvas(gameCanvas: GameCanvas) {
  gameCanvas.context.clearRect(0, 0, gameCanvas.context.canvas.width, gameCanvas.context.canvas.height);
}
