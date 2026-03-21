const _PATH = require('path');
const _GAME = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'game.js'));



class Lobby {

  constructor(id) {
    this.id = id;

    this.sockets = {};
    this.readied = {};
    this.decks = {};

    this.game = null;
  }

  join(socket) {
    if (Object.keys(this.sockets).length >= 2)
      return { ok: false, reason: 'Lobby is full already.' };

    this.sockets[socket.socket.id] = socket;
    this.readied[socket.socket.id] = false;
    this.decks[socket.socket.id] = [];
    socket.lobby = this;
    socket.socket.on('toggle-ready', (data) => {
      this.toggleReady(socket, data);
    });

    return { ok: true };
  }

  leave(socket) {
    if (!Object.keys(this.sockets).includes(socket.socket.id))
      return { ok: false, reason: 'You are not in the lobby.' };

    delete this.sockets[socket.socket.id];
    delete this.readied[socket.socket.id];
    delete this.decks[socket.socket.id];
    socket.lobby = null;
    socket.socket.removeAllListeners('toggle-ready');

    if (this.game != null) {
      this.game.lose(socket.socket.id);
      this.game = null;
    }

    return { ok: true };
  }

  toggleReady(socket, data) {
    this.readied[socket.socket.id] = !this.readied[socket.socket.id];
    this.decks[socket.socket.id] = data.deck;
    // TODO: check deck validity here
    this.sendLobbyUpdate();
    for (var i = 0; i < Object.keys(this.readied).length; i++) {
      if (!this.readied[Object.keys(this.readied)[i]])
        return;
    }
    // everyone is ready --> start match
    this.game = new _GAME.Game(this);
    this.game.start();
  }

  sendLobbyUpdate() {
    var data = {};
    data.players = Object.keys(this.sockets).map((key) => {
      return { 'id': this.sockets[key].clientId, 'name': this.sockets[key].clientId, 'ready': this.readied[key] };
    });
    data.id = this.id;
    data = JSON.stringify(data);

    Object.values(this.sockets).forEach((socket) => {
      socket.socket.emit('lobby-update', data);
    });
  }

}

module.exports.Lobby = Lobby;