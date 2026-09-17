import type { Keyboard } from '../game/keyboard';
import type { SpriteSettings } from '../types/sprite-settings';

export interface Sprite {
  initialise(settings: SpriteSettings, keyboard?: Keyboard): Promise<void>;
  update(): void;
  draw(context: CanvasRenderingContext2D): void;
}
