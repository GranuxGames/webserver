const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardBlizzard extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Blizzard', 'Deal 2 damage to all enemy minions and [b]Freeze[/b] them.',
          _ENUMS.Rarity.RARE, _ENUMS.Set.LEGACY, 6, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FROST);
  }

}



module.exports.CardBlizzard = CardBlizzard;