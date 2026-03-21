const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardMirrorEntity extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Mirror Entity', '[b]Secret:[/b] After your opponent plays a minion, summon a copy of it.',
          _ENUMS.Rarity.COMMON, _ENUMS.Set.LEGACY, 3, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.ARCANE);
  }

}



module.exports.CardMirrorEntity = CardMirrorEntity;