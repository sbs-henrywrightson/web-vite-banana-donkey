import { KEYS } from '../constants';
import type { Rectangle } from '../types';

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function intersect(box1: Rectangle, box2: Rectangle): boolean {
  return box1.p1.x <= box2.p2.x && box1.p2.x >= box2.p1.x && box1.p1.y <= box2.p2.y && box1.p2.y >= box2.p1.y;
}

export function waitForSpaceKey(): Promise<void> {
  return new Promise((resolve) => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === KEYS.space) {
        window.removeEventListener('keydown', handler);
        resolve();
      }
    };

    window.addEventListener('keydown', handler);
  });
}

export async function delay(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time));
}
