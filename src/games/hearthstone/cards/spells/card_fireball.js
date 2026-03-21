const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardFireball extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Fireball', 'Deal 6 damage.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 4, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FIRE);
  }

}



module.exports.CardFireball = CardFireball;