const _PATH = require('path');
const _CANVAS_LOBBY_MANAGER = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'canvas_lobby_manager'));


/**
 * This object holds all canvas sockets currently connected.
 */
var canvasSockets = {};


/**
 * This class contains a socket for the canvas page.
 *
 * @class CanvasSocket
 * @typedef {CanvasSocket}
 */
class CanvasSocket {

  
  /**
   * Creates an instance of CanvasSocket.
   *
   * @constructor
   * @param {Socket} socket The SocketIO socket that connected.
   */
  constructor(socket) {
    this.socket = socket;
    this.lobbyID = null;

    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('lobby-request', this.onLobbyRequest.bind(this));

    canvasSockets[this.socket.id] = this;

    this.onConnect();
  }

  onConnect() {

  }

  onLobbyRequest(data) {
    data = JSON.parse(data);
    this.lobbyID = data.lobby;
    _CANVAS_LOBBY_MANAGER.CanvasLobbyManager.instance.joinLobby(data.lobby,
                                                                this);
  }

  onDisconnect() {
    delete canvasSockets[this.socket.id];
    _CANVAS_LOBBY_MANAGER.CanvasLobbyManager.instance.leaveLobby(this.lobbyID,
                                                                 this);
  }

}

module.exports.CanvasSocket = CanvasSocket;