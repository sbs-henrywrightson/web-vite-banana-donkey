import { Game } from './game/game';
import './style.css';

const game = new Game();
await game.initialise();
await game.play();
