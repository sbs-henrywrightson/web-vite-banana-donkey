import { SCORE_DEFAULTS } from '../constants';
import { TEXT_STRINGS } from '../constants/ui-constants';
import type { GameCanvas } from './game-canvas';
import { getCentredBoxPosition } from './graphics';
import { waitForSpaceKey } from './utilities';

export class UI {
  private readonly context: CanvasRenderingContext2D;
  private gradient: CanvasGradient;

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
  }

  public drawUI() {
    this.context.font = '700 32px Orbitron';
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'black';
    this.context.fillStyle = this.gradient;

    this.drawOutlinedText('Saved', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight);
    this.drawOutlinedText('Highest', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight * 2);
    this.drawOutlinedText('Drops left', SCORE_DEFAULTS.labelX, SCORE_DEFAULTS.lineHeight * 3);
  }

  public drawScore(score: number, highScore: number, lives: number) {
    this.context.font = '28px DSEG7';
    this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';

    this.drawText('8888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight + SCORE_DEFAULTS.numberYOffset);
    this.drawText('8888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight * 2 + SCORE_DEFAULTS.numberYOffset);
    this.drawText('8888', SCORE_DEFAULTS.numberX, SCORE_DEFAULTS.lineHeight * 3 + SCORE_DEFAULTS.numberYOffset);

    this.context.lineWidth = 0.4;
    this.context.strokeStyle = 'black';
    this.context.fillStyle = this.gradient;

    this.drawOutlinedText(
      score.toString().padStart(4, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight + SCORE_DEFAULTS.numberYOffset,
    );
    this.drawOutlinedText(
      highScore.toString().padStart(4, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight * 2 + SCORE_DEFAULTS.numberYOffset,
    );
    this.drawOutlinedText(
      lives.toString().padStart(4, '!'),
      SCORE_DEFAULTS.numberX,
      SCORE_DEFAULTS.lineHeight * 3 + SCORE_DEFAULTS.numberYOffset,
    );
  }

  private drawText(text: string, x: number, y: number) {
    this.context.fillText(text, x, y);
  }

  private splitText(text: string, width: number): string[] {
    const lines: string[] = [];
    let line = '';
    text = text.trimEnd() + ' ';
    while (text.length > 0) {
      const firstSpace = text.indexOf(' ');
      const firstWord = text.substring(0, firstSpace);
      text = text.substring(firstSpace + 1);
      const newLine = line + (line ? ' ' : '') + firstWord;
      if (this.context.measureText(newLine).width >= width) {
        lines.push(line);
        line = '';
      }
      line += (line ? ' ' : '') + firstWord;
    }
    lines.push(line);
    return lines;
  }

  private drawOutlinedText(text: string, x: number, y: number) {
    this.context.fillText(text, x, y);
    this.context.strokeText(text, x, y);
  }

  public async displayWelcomeMessage() {
    const overlaySize: { width: number; height: number } = { width: 500, height: 300 };

    const overlayBox = getCentredBoxPosition(this.context.canvas, overlaySize.width, overlaySize.height);
    this.darkenArea(overlayBox.x, overlayBox.y, overlaySize.width, overlaySize.height);

    this.context.font = '40px Slackey';
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'hsl(0, 100%, 50%)';
    this.context.fillStyle = 'hsl(60, 100%, 50%)';

    this.drawOutlinedText(
      'Banana Donkey 2',
      overlayBox.x + this.getCentredTextX('Banana Donkey 2', overlaySize.width),
      overlayBox.y + 60,
    );

    this.context.font = '16px Chilanka';
    this.context.lineWidth = 0;
    this.context.strokeStyle = '';
    this.context.fillStyle = 'hsl(61, 100%, 50%)';

    this.drawParagraph(
      [...TEXT_STRINGS.instructionText],
      overlayBox.x + 10,
      overlayBox.y + 100,
      overlaySize.width - 20,
    );

    this.context.font = '14px Chilanka';
    const text = 'Press SPACE to play';
    this.drawText(text, overlayBox.x + this.getCentredTextX(text, overlaySize.width), overlayBox.y + 280);
    await waitForSpaceKey();
  }

  public async displayDeathMessage(newHighScore: boolean) {
    const messageSize: { width: number; height: number } = { width: 500, height: 300 };

    const messageBox = getCentredBoxPosition(this.context.canvas, messageSize.width, messageSize.height);
    this.darkenArea(messageBox.x, messageBox.y, messageSize.width, messageSize.height);

    this.context.font = '40px Slackey';
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'hsl(0, 100%, 50%)';
    this.context.fillStyle = 'hsl(60, 100%, 50%)';

    let title = 'You have been';
    this.drawOutlinedText(title, messageBox.x + this.getCentredTextX(title, messageSize.width), messageBox.y + 60);
    title = 'FIRED!';
    this.drawOutlinedText(title, messageBox.x + this.getCentredTextX(title, messageSize.width), messageBox.y + 100);

    this.context.font = '16px Chilanka';
    this.context.lineWidth = 0;
    this.context.strokeStyle = '';
    this.context.fillStyle = 'hsl(61, 100%, 50%)';

    const firedText = newHighScore ? TEXT_STRINGS.newHighScoreText : TEXT_STRINGS.tryAgainText;
    this.drawParagraph([firedText], messageBox.x + 10, messageBox.y + 150, messageSize.width - 20);

    this.context.font = '14px Chilanka';
    const text = 'Press SPACE to play again';
    this.drawText(text, messageBox.x + this.getCentredTextX(text, messageSize.width), messageBox.y + 280);
    await waitForSpaceKey();
  }

  private drawParagraph(paragraph: string[], x: number, y: number, width: number, lineHeight: number = 20) {
    let lineY = y;
    for (const text of paragraph) {
      const lines = this.splitText(text, width);
      for (const line of lines) {
        this.drawText(line, x, lineY);
        lineY += lineHeight;
      }
      lineY += lineHeight / 2;
    }
  }

  private getCentredTextX(text: string, width: number) {
    return (width - this.context.measureText(text).width) / 2;
  }

  private darkenArea(x: number, y: number, w: number, h: number, amount: number = 0.55) {
    this.context.fillStyle = `hsla(0, 0%, 0%, ${amount})`;
    this.context.fillRect(x, y, w, h);
  }
}
