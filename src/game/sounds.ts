import monkey1Sound from '../assets/sounds/monkey-1.wav';
import monkey2Sound from '../assets/sounds/monkey-2.wav';
import monkey3Sound from '../assets/sounds/monkey-3.wav';
import monkey4Sound from '../assets/sounds/monkey-4.wav';
import monkey5Sound from '../assets/sounds/monkey-5.wav';
import monkey6Sound from '../assets/sounds/monkey-6.wav';
import scrumpleSound from '../assets/sounds/scrumple.wav';
import squelchSound from '../assets/sounds/squelch.wav';
import { randomNumber } from './utilities';

export class Sounds {
  private readonly monkeySounds = [monkey1Sound, monkey2Sound, monkey3Sound, monkey4Sound, monkey5Sound, monkey6Sound];
  private readonly audioContext = new AudioContext();
  private readonly audioCache = new Map<string, AudioBuffer>();

  constructor() {
    void this.loadSounds().catch(() => undefined);

    window.addEventListener('pointerdown', this.unlock, { once: true });
    window.addEventListener('keydown', this.unlock, { once: true });
  }
  public playCatchBanana() {
    this.playSound(scrumpleSound);
  }

  public playDropBanana() {
    this.playSound(squelchSound);
  }

  public playThrowBanana() {
    this.playSound(this.monkeySounds[randomNumber(0, 5)], 0.7);
  }

  private playSound(path: string, volume: number = 1) {
    const buffer = this.audioCache.get(path);
    if (!buffer) {
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.audioContext.destination);
    source.start();
  }

  private unlock = () => {
    window.removeEventListener('pointerdown', this.unlock);
    window.removeEventListener('keydown', this.unlock);

    void this.audioContext.resume().catch(() => undefined);
  };

  private async loadSounds() {
    const paths = [scrumpleSound, squelchSound, ...this.monkeySounds];
    await Promise.all(paths.map((path) => this.loadSound(path)));
  }

  private async loadSound(path: string) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Unable to load sound: ${path}`);
        }
        const data = await response.arrayBuffer();
        const buffer = await this.audioContext.decodeAudioData(data);
        this.audioCache.set(path, buffer);
    } catch {
      // A failed effect should not prevent the remaining sounds from loading.
    }
  }
}
