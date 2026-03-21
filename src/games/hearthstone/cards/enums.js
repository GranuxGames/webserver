const Rarity = {
  FREE: 0,
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4
};

const Set = {
  CORE: 0,
  LEGACY: 1
};

const CostType = {
  MANA: 0,
  HEALTH: 1
};

const Hero = {
  NEUTRAL: 0,
  MAGE: 1
};

const School = {
  NONE: -1,
  ARCANE: 0,
  FROST: 1,
  FIRE: 2
};

const Race = {
  ELEMENTAL: 0,
  GNOME: 1,
  HUMAN: 2,
  UNDEAD: 3,
  DRAGON: 4
};

module.exports.Rarity = Rarity;
module.exports.Set = Set;
module.exports.CostType = CostType;
module.exports.Hero = Hero;
module.exports.School = School;
module.exports.Race = Race;