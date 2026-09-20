export const SCORE_DEFAULTS = {
  lineHeight: 35,
  labelX: 10,
  numberX: 215,
  numberYOffset: 2,

  gradientX1: 10,
  gradientY1: 0,
  gradientX2: 300,
  gradientY2: 0,
  gradientOrange: 'hsl(27, 100%, 50%)',
  gradientYellow: 'hsl(58, 100%, 50%)',
} as const;

export const TEXT_STRINGS = {
  instructionText: [
    'Naughty MONKEY is throwing away good bananas! You have been hired to stop the wastefulness.',
    'Using DONKEY, (with cursor keys), catch the BANANAS before they splat on the shore.',
    'Banana waste will not be tolerated. If you drop too many bananas, you will be FIRED! ',
  ],
  instructionTextMobile: [
    'Naughty MONKEY is throwing away good bananas! You have been hired to stop the wastefulness.',
    'Using DONKEY catch the BANANAS before they splat on the shore.',
    'Banana waste will not be tolerated. If you drop too many bananas, you will be FIRED! ',
  ],
  newHighScoreText:
    "Well, that went as well as expected! You did manage to save a bunch of banana's and earn the EMPLOYEE OF THE MONTH badge but dropping that many bananas will not do. Maybe try again?",
  tryAgainText:
    'Well, that went as well as expected! Dropping that many bananas is a breach of your employment contract. Maybe try again? ',
} as const;
