export class Keyboard {
  private readonly keysDown = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.clear);
  }

  public isDown(key: string): boolean {
    return this.keysDown.has(key);
  }

  public handleKeyDown = (event: KeyboardEvent) => {
    this.keysDown.add(event.code);
  };

  public handleKeyUp = (event: KeyboardEvent) => {
    this.keysDown.delete(event.code);
  };

  public clear = () => {
    this.keysDown.clear();
  };
}
