export default class Player {
  constructor({ id, score, isYou }) {
    this.id = id;
    this.score = score || 0;
    this.isYou = isYou ?? false;
  }
};
