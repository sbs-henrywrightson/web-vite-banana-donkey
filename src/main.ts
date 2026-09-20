import { Game } from './game/game';
import './style.css';

const initialiseEnvironment = async () => {
  await document.fonts.load('1em Orbitron');
  await document.fonts.load('1em DSEG7');
  await document.fonts.load('1em Slackey');
  await document.fonts.load('1em Chilanka');
};

await initialiseEnvironment();

const game = new Game();
await game.initialise();
await game.play();
