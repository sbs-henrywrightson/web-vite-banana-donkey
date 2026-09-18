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
