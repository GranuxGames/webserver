const _PATH = require('path');
const _CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'card.js'));



class SpellCard extends _CARD.Card {

  constructor(name, description, rarity, set, cost, costType, hero, school) {
    super(name, description, rarity, set, cost, costType, hero);

    this.school = school;
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      'school': this.school,
      'type': 'spell'
    });
  }

}



module.exports.SpellCard = SpellCard;