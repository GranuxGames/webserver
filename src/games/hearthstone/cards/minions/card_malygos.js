const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardMalygos extends _MINION_CARD.MinionCard {

  constructor() {
    super('Malygos', '[b]Spell Damage +5[/b]',
          _ENUMS.Rarity.LEGENDARY, _ENUMS.Set.LEGACY, 9, _ENUMS.CostType.MANA,
          _ENUMS.Hero.NEUTRAL, _ENUMS.Race.DRAGON, 4, 12);
  }

}



module.exports.CardMalygos = CardMalygos;