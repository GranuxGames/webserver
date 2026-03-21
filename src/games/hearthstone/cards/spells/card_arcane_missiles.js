const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardArcaneMissiles extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Arcane Missiles', 'Deal 3 damage randomly split among all enemy characters.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 1, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.ARCANE);
  }

}



module.exports.CardArcaneMissiles = CardArcaneMissiles;