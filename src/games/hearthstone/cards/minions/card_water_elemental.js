const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardWaterElemental extends _MINION_CARD.MinionCard {

  constructor() {
    super('Water Elemental', '[b]Freeze[/b] any character damaged by this minion.',
          _ENUMS.Rarity.FREE, _ENUMS.Set.LEGACY, 4, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.Race.ELEMENTAL, 3, 6);
  }

}



module.exports.CardWaterElemental = CardWaterElemental;