const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardMirrorImage extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Mirror Image', 'Summon two 0/2 minions with [b]Taunt[/b].',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 1, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.NONE);
  }

}



module.exports.CardMirrorImage = CardMirrorImage;