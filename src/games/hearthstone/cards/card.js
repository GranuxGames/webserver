class Card {

  constructor(name, description, rarity, set, cost, costType, hero) {
    this.name = name;
    this.description = description;
    this.rarity = rarity;
    this.set = set;
    this.cost = cost;
    this.costType = costType;
    this.hero = hero;
  }

  toJSON() {
    return {
      'name': this.name,
      'description': this.description,
      'rarity': this.rarity,
      'set': this.set,
      'cost': this.cost,
      'cost_type': this.costType,
      'hero': this.hero
    };
  }

}

module.exports.Card = Card;