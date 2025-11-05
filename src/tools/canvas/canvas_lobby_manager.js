const _PATH = require('path');
const _CANVAS_LOBBY = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'canvas_lobby'));

class CanvasLobbyManager {

  constructor() {
    this.lobbies = {};
  }

  joinLobby(lobbyID, socket) {
    if (!Object.keys(this.lobbies).includes(lobbyID))
      this.lobbies[lobbyID] = new _CANVAS_LOBBY.CanvasLobby(lobbyID);
    this.lobbies[lobbyID].join(socket);
  }

  leaveLobby(lobbyId, socket) {
    if (!Object.keys(this.lobbies).includes(lobbyId))
      return;
    this.lobbies[lobbyId].leave(socket);
  }

}

CanvasLobbyManager.instance = new CanvasLobbyManager();

module.exports.CanvasLobbyManager = CanvasLobbyManager;