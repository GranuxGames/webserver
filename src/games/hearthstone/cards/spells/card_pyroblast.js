const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardPyroblast extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Pyroblast', 'Deal 10 damage.',
          _ENUMS.Rarity.EPIC, _ENUMS.Set.LEGACY, 10, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FIRE);
  }

}



module.exports.CardPyroblast = CardPyroblast;