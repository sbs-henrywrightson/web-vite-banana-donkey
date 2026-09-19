import { SCORE_DEFAULTS } from '../constants';
import type { GameCanvas } from './game-canvas';

export class UI {
  private readonly context: CanvasRenderingContext2D;
  private score = 0;
  private highScore = 1234;
  private _lives = 0;
  private gradient: CanvasGradient;

  public get lives(): number {
    return this._lives;
  }

  constructor(gameCanvas: GameCanvas) {
    this.context = gameCanvas.context;

    this.gradient = this.context.createLinearGradient(
      SCORE_DEFAULTS.gradientX1,
      SCORE_DEFAULTS.gradientY1,
      SCORE_DEFAULTS.gradientX2,
      SCORE_DEFAULTS.gradientY2,
    );
    this.gradient.addColorStop(0, SCORE_DEFAULTS.gradientOrange);
    this.gradient.addColorStop(0.6, SCORE_DEFAULTS.gradientYellow);
    this.gradient.addColorStop(1, SCORE_DEFAULTS.gradientOrange);

    this.resetScore();
  }

  public resetScore() {
    this.score = 0;
    this._lives = 3;
  }

  public incrementScore() {
    this.score++;
    if (this.score > this.highScore) this.highScore = this.score;
  }

  public decrementLives() {
    this._lives--;
  }

  public drawUI() {
    this.context.font = '700 32px Orbitron';
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'black';
    this.context.fillStyle = this.gradient;

    this.drawOutlinedText('Saved', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight);
    this.drawOutlinedText('Highest', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight * 2);
    this.drawOutlinedText('Quota', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight * 3);
  }

  public drawScore() {
    this.context.font = '28px DSEG7Classic-Bold';
    this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';

    this.drawText('88888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight + SCORE_DEFAULTS.numberYOffset);
    this.drawText('88888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight * 2 + SCORE_DEFAULTS.numberYOffset);
    this.drawText('88888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight * 3 + SCORE_DEFAULTS.numberYOffset);

    this.context.lineWidth = 1;
    this.context.strokeStyle = 'black';
    this.context.fillStyle = this.gradient;

    this.drawOutlinedText(
      this.score.toString().padStart(5, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight + SCORE_DEFAULTS.numberYOffset,
    );
    this.drawOutlinedText(
      this.highScore.toString().padStart(5, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight * 2 + SCORE_DEFAULTS.numberYOffset,
    );
    this.drawOutlinedText(
      this._lives.toString().padStart(5, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight * 3 + SCORE_DEFAULTS.numberYOffset,
    );
  }

  private drawText(text: string, x: number, y: number) {
    this.context.fillText(text, x, y);
  }

  private drawOutlinedText(text: string, x: number, y: number) {
    this.context.fillText(text, x, y);
    this.context.strokeText(text, x, y);
  }
}
