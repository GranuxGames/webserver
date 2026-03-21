const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardIceBarrier extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Ice Barrier', '[b]Secret:[/b] When your hero is attacked, gain 8 Armor.',
          _ENUMS.Rarity.COMMON, _ENUMS.Set.LEGACY, 3, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FROST);
  }

}



module.exports.CardIceBarrier = CardIceBarrier;