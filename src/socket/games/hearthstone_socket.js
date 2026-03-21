const _PATH = require('path');
const _LOBBY = require(_PATH.join(global.__path.src, 'games', 'hearthstone', 'lobby.js'));



/**
 * This object holds all hearthstone sockets currently connected.
 */
var hearthstoneSockets = {};

var hearthstoneLobbies = {};



class HearthstoneSocket {

  /**
   * Creates an instance of HearthstoneSocket.
   *
   * @constructor
   * @param {Socket} socket The SocketIO socket that connected.
   */
  constructor(socket) {
    this.socket = socket;

    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('host-lobby', this.onHostLobby.bind(this));
    this.socket.on('join-lobby', this.onJoinLobby.bind(this));
    this.socket.on('leave-lobby', this.onLeaveLobby.bind(this));
    this.socket.on('kick-player', this.onKickPlayer.bind(this));

    hearthstoneSockets[this.socket.id] = this;

    this.lobby = null;

    this.onConnect();
  }

  onConnect() {

  }

  onDisconnect() {
    delete hearthstoneSockets[this.socket.id];
    this.onLeaveLobby();
  }



  onHostLobby(data) {
    this.clientId = data.id;

    if (this.lobby != null) {
      this.socket.emit('host-lobby-response', JSON.stringify({ 'ok': false, 'reason': 'You are already in a lobby.' }));
      return;
    }

    var lobbyId = this.generateRandomLobbyID(5);
    while (Object.keys(hearthstoneLobbies).includes(lobbyId))
      lobbyId = this.generateRandomLobbyID(5);
    hearthstoneLobbies[lobbyId] = new _LOBBY.Lobby(lobbyId);
    var result = hearthstoneLobbies[lobbyId].join(this);
    result.id = lobbyId;
    this.socket.emit('host-lobby-response', JSON.stringify(result));

    hearthstoneLobbies[lobbyId].sendLobbyUpdate();
  }

  onJoinLobby(data) {
    var lobbyId = data.lobby;
    this.clientId = data.id;

    if (this.lobby != null) {
      this.socket.emit('join-lobby-response', JSON.stringify({ 'ok': false, 'reason': 'You are already in a lobby.' }));
      return;
    }

    var result = { ok: true };
    if (!Object.keys(hearthstoneLobbies).includes(lobbyId))
      result = { ok: false, reason: 'That lobby does not exist.' };
    else
      hearthstoneLobbies[lobbyId].join(this);
    this.socket.emit('join-lobby-response', JSON.stringify(result));

    if (result.ok)
      hearthstoneLobbies[lobbyId].sendLobbyUpdate();
  }

  onLeaveLobby() {
    if (this.lobby == null)
      return;

    var lobby = this.lobby;
    this.socket.emit('leave-lobby-response', JSON.stringify(this.lobby.leave(this)));
    lobby.sendLobbyUpdate();
  }

  onKickPlayer(data) {
    Object.values(hearthstoneLobbies).forEach((lobby) => {
      Object.values(lobby.sockets).forEach((socket) => {
        if (socket.clientId == data.id)
          socket.onLeaveLobby();
      });
    });
  }



  generateRandomLobbyID(length) {
    var id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

}

module.exports.HearthstoneSocket = HearthstoneSocket;