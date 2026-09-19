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
  private mute = false;
  private monkeySounds: string[] = [];

  constructor(mute: boolean = false) {
    this.mute = mute;
    if (this.mute) return;

    this.monkeySounds = [monkey1Sound, monkey2Sound, monkey3Sound, monkey4Sound, monkey5Sound, monkey6Sound];
  }
  public playCatchBanana() {
    if (this.mute) return;
    const sound = new Audio(scrumpleSound);
    this.playSound(sound);
  }

  public playDropBanana() {
    if (this.mute) return;
    const sound = new Audio(squelchSound);
    this.playSound(sound);
  }

  public playThrowBanana() {
    if (this.mute) return;
    const sound = new Audio(this.monkeySounds[randomNumber(0, 5)]);
    sound.volume = 0.7;
    this.playSound(sound);
  }

  private playSound(sound: HTMLAudioElement) {
    sound.currentTime = 0;
    sound.play();
  }
}
