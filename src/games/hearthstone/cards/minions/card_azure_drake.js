const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardAzureDrake extends _MINION_CARD.MinionCard {

  constructor() {
    super('Azure Drake', '[b]Spell Damage +1[/b] [b]Battlecry:[/b] Draw a card.',
          _ENUMS.Rarity.RARE, _ENUMS.Set.LEGACY, 5, _ENUMS.CostType.MANA,
          _ENUMS.Hero.NEUTRAL, _ENUMS.Race.DRAGON, 4, 5);
  }

}



module.exports.CardAzureDrake = CardAzureDrake;