const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardFrostbolt extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Frostbolt', 'Deal 3 damage to a character and [b]Freeze[/b] it.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 2, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FROST);
  }

}



module.exports.CardFrostbolt = CardFrostbolt;