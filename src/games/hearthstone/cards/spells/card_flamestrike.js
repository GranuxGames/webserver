const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardFlamestrike extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Flamestrike', 'Deal 5 damage to all enemy minions.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 7, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FIRE);
  }

}



module.exports.CardFlamestrike = CardFlamestrike;