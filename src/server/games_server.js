const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));
const _HEARTHSTONE_SOCKET = require(_PATH.join(global.__path.src, 'socket', 'games', 'hearthstone_socket'));

class GamesServer extends _SERVER.Server {

  constructor() {
    super(global.__config.games.url);
    
    // this.sites.push('/' + global.__config.games.hearthstone.url);
    this.sites.push('/' + global.__config.games.stickerball.url);
  }
  
    
  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {
    // expressServer.all('/' + this.url + '/' + global.__config.games.hearthstone.url, (request, result) => {
    //   result.sendFile(_PATH.join(global.__path.html, 'games', 'hearthstone', 'game.html'));
    //   // result.sendFile(_PATH.join(global.__path.public, 'exports', 'godot', 'hearthstone', 'index.html'));
    // });

    expressServer.all('/' + this.url + '/' + global.__config.games.stickerball.url, (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'games', 'stickerball', 'game.html'));
    });
  }

  /**
   * This method checks if the provided url belongs to this server. If it does
   * the socket is handled appropriately by this server class. This is an
   * abstract function meant to be overridden by the server subclass.
   *
   * @param {Socket} socket The socket to connect with the server.
   * @param {string} url The url on which the socket is trying to connect.
   * @returns {boolean} Returns true if the socket could be connected and false
   *                    in any other case.
   */
  connectSocket(socket, url) {
    if (url == '/hearthstone') {
      new _HEARTHSTONE_SOCKET.HearthstoneSocket(socket);
      return true;
    }
    return false;
  }

}

module.exports.GamesServer = GamesServer;