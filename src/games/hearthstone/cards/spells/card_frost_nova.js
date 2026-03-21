const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardFrostNova extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Frost Nova', '[b]Freeze[/b] all enemy minions.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 3, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.FROST);
  }

}



module.exports.CardFrostNova = CardFrostNova;