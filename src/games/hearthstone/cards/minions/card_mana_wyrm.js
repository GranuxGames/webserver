const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardManaWyrm extends _MINION_CARD.MinionCard {

  constructor() {
    super('Mana Wyrm', 'Whenever you cast a spell, gain +1 Attack.',
          _ENUMS.Rarity.COMMON, _ENUMS.Set.LEGACY, 1, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.Race.ELEMENTAL, 1, 3);
  }

}



module.exports.CardManaWyrm = CardManaWyrm;