import BonusTypes from '../enum/BonusTypes';

const bonuses = [
  {
    type: BonusTypes.WORD,
    multiplier: 2,
    text: 'S2',
    color: 'pink',
  }, {
    type: BonusTypes.WORD,
    multiplier: 3,
    text: 'S3',
    color: 'red',
  }, {
    type: BonusTypes.LETTER,
    multiplier: 2,
    text: 'L2',
    color: 'paleblue',
  }, {
    type: BonusTypes.LETTER,
    multiplier: 3,
    text: 'L3',
    color: 'blue',
  },
];

export const getBonusTextAndColor = (bonus) => {
  const matching = bonuses.find(knownBonus => {
    return knownBonus.type === bonus.type && knownBonus.multiplier === bonus.multiplier;
  }) || { text: '?', color: 'paleblue' };
  return { text: matching.text, color: matching.color };
}
