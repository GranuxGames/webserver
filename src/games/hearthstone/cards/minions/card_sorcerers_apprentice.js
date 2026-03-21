const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardSorcerersApprentice extends _MINION_CARD.MinionCard {

  constructor() {
    super('Sorcerer\'s Apprentice', 'Your spells cost (1) less [i](but not less than 1)[/i].',
          _ENUMS.Rarity.COMMON, _ENUMS.Set.LEGACY, 2, _ENUMS.CostType.MANA,
          _ENUMS.Hero.MAGE, _ENUMS.Race.GNOME, 3, 2);
  }

}



module.exports.CardSorcerersApprentice = CardSorcerersApprentice;