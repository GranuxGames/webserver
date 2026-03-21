const _PATH = require('path');
const _PLAYER = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'player.js'));
const { CARDS, cardToJSON } = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'cards', 'cards.js'));



class Game {

  constructor(lobby) {
    this.players = Object.keys(lobby.sockets).toSorted((a, b) => {
      return Math.random() * 4 - 2;
    }).map((key, index) => {
      return new _PLAYER.Player(lobby.sockets[key], lobby.decks[key], index == 0);
    });
    this.turn = 0;
  }

  broadcast(name, data) {
    this.players.forEach((player) => {
      player.socket.socket.emit(name, JSON.stringify(data));
    });
  }

  broadcastState() {
    var data = {};
    this.players.forEach((player) => {
      data[player.socket.clientId] = {
        'hand_size': player.hand.length,
        'deck_size': player.deck.length
      }
    });
    this.players.forEach((player) => {
      var playerData = structuredClone(data);
      playerData[player.socket.clientId].hand = player.hand.map((card) => {
        return cardToJSON(card);
      });
      player.socket.socket.emit('game-state', JSON.stringify(playerData));
    });
  }

  start() {
    // send start with initial hand
    // wait for mulligan or confirmation
    // set up first turn --> enter turn order
    this.broadcast('start-game', {});
    this.broadcastState();
  }

  lose(id) {
    this.players.forEach((player) => {
      var data = {
        'win': player.socket.socket.id != id
      };
      player.socket.socket.emit('stop-game', JSON.stringify(data));
    });
  }

  win(id) {
    this.players.forEach((player) => {
      var data = {
        'win': player.socket.socket.id == id
      };
      player.socket.socket.emit('stop-game', JSON.stringify(data));
    });
  }

  cancel() {
    this.broadcast('stop-game', { 'win': false });
  }

}

module.exports.Game = Game;