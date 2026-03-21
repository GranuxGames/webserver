const _PATH = require('path');
const _CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'card.js'));



class MinionCard extends _CARD.Card {

  constructor(name, description, rarity, set, cost, costType, hero, race, attack, health) {
    super(name, description, rarity, set, cost, costType, hero);
    
    this.race = race;
    this.attack = attack;
    this.health = health;
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      'race': this.race,
      'attack': this.attack,
      'health': this.health,
      'type': 'minion'
    });
  }

}



module.exports.MinionCard = MinionCard;