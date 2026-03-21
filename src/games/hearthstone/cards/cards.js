const _PATH = require('path');
const _FS = require('fs');



const CARD = Object.assign({}, ...['spells', 'minions'].map((path) => {
  return _PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', path);
}).map((path) => {
  return _FS.readdirSync(path).map((file) => {
    return _PATH.join(path, file);
  }).filter((path) => {
    return !path.endsWith('_card.js');
  });
}).flat().map((path) => {
  var card = require(path);
  var cardOut = {};
  Object.entries(card).forEach(([key, value]) => {
    if (key.startsWith('Card'))
      key = key.substring(4);
    cardOut[key] = value;
  });
  return cardOut;
}));

const CARDS = [
  CARD.Coin,
  CARD.ArcaneMissiles,
  CARD.ManaWyrm,
  CARD.MirrorImage,
  CARD.ArcaneExplosion,
  CARD.Frostbolt,
  CARD.SorcerersApprentice,
  CARD.ArcaneIntellect,
  CARD.Counterspell,
  CARD.FrostNova,
  CARD.IceBarrier,
  CARD.MirrorEntity,
  CARD.Fireball,
  CARD.Polymorph,
  CARD.WaterElemental,
  CARD.Blizzard,
  CARD.ArchmageAntonidas,
  CARD.Flamestrike,
  CARD.Pyroblast,
  CARD.BloodmageThalnos,
  CARD.AzureDrake,
  CARD.Malygos
];

function cardToJSON(card) {
  return Object.assign(card.toJSON(), {
    'id': CARDS.indexOf(card.constructor)
  });
}



module.exports.CARDS = CARDS;
module.exports.CARD = CARD;
module.exports.cardToJSON = cardToJSON;