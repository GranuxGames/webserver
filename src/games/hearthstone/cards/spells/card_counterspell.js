const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardCounterspell extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Counterspell', '[b]Secret:[/b] When your opponent casts a spell, [b]Counter[/b] it.',
          _ENUMS.Rarity.RARE, _ENUMS.Set.LEGACY, 3, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.ARCANE);
  }

}



module.exports.CardCounterspell = CardCounterspell;