const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardCoin extends _SPELL_CARD.SpellCard {

  constructor() {
    super('The Coin', 'Gain 1 Mana Crystal this turn only.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.CORE, 0, _ENUMS.CostType.MANA,
          _ENUMS.Hero.NEUTRAL, _ENUMS.School.NONE);
  }

}



module.exports.CardCoin = CardCoin;