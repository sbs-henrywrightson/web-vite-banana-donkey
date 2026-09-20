import { KEYS } from '../constants';
import type { Rectangle } from '../types';

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function intersect(box1: Rectangle, box2: Rectangle): boolean {
  return box1.p1.x <= box2.p2.x && box1.p2.x >= box2.p1.x && box1.p1.y <= box2.p2.y && box1.p2.y >= box2.p1.y;
}

export function waitForStart(): Promise<void> {
  return new Promise((resolve) => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.code === KEYS.space) {
        cleanup();
        resolve();
      }
    };

    const pointerHandler = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('pointerdown', pointerHandler);
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('pointerdown', pointerHandler);
  });
}

export async function delay(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

export function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches;
}
