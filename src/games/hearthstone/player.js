const _PATH = require('path');
const { CARD, CARDS } = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'cards.js'));



class Player {

  constructor(socket, deck, starting) {
    this.socket = socket;
    
    this.deck = deck.map((card) => {
      return new CARDS[card]();
    }).toSorted((a, b) => {
      return Math.random() * 4 - 2;
    });

    this.hand = [];
    if (starting) {
      this.hand = this.getCards(4);
    } else {
      this.hand = this.getCards(3);
    }
  }

  getCards(count) {
    var cards = [];
    for (var i = 0; i < count; i++) {
      cards.push(this.getCard());
    }
    return cards;
  }

  getCard() {
    // TODO: check for decking out
    if (this.deck.length <= 0)
      return null;
    var card = this.deck.splice(0, 1);
    return card[0];
  }

}

module.exports.Player = Player;