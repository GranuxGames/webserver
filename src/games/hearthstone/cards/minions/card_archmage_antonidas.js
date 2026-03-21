const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardArchmageAntonidas extends _MINION_CARD.MinionCard {

  constructor() {
    super('Archmage Antonidas', 'Whenever you cast a spell, add a \'Fireball\' spell to your hand.',
          _ENUMS.Rarity.LEGENDARY, _ENUMS.Set.LEGACY, 7, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.Race.HUMAN, 5, 7);
  }

}



module.exports.CardArchmageAntonidas = CardArchmageAntonidas;