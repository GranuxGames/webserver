const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _SPELL_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'spells', 'spell_card.js'));



class CardArcaneExplosion extends _SPELL_CARD.SpellCard {

  constructor() {
    super('Arcane Explosion', 'Deal 1 damage to all enemy minions.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 2, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.School.ARCANE);
  }

}



module.exports.CardArcaneExplosion = CardArcaneExplosion;