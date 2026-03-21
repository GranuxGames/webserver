const _PATH = require('path');
const _ENUMS = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'enums.js'));
const _MINION_CARD = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'minions', 'minion_card.js'));



class CardBloodmageThalnos extends _MINION_CARD.MinionCard {

  constructor() {
    super('Bloodmage Thalnos', '[b]Spell Damage +1[/b] [b]Deathrattle:[/b] Draw a card.',
          _ENUMS.Rarity.LEGENDARY, _ENUMS.Set.LEGACY, 2, _ENUMS.CostType.MANA,
          _ENUMS.Hero.NEUTRAL, _ENUMS.Race.UNDEAD, 1, 1);
  }

}



module.exports.CardBloodmageThalnos = CardBloodmageThalnos;