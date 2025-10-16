const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));


/**
 * A server to collect all different tools.
 *
 * @class ToolsServer
 * @typedef {ToolsServer}
 * @extends {_SERVER.Server}
 */
class ToolsServer extends _SERVER.Server {

  /**
   * Creates an instance of ToolsServer.
   *
   * @constructor
   */
  constructor() {
    super(global.__config.tools.url);
  }

  
  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {
    expressServer.all('/' + this.url + '/insect-tracker', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'tools', 'insect_tracker',
                                 'insect_tracker.html'));
    });

    expressServer.all('/' + this.url + '{/*path}', (request, result, next) => {
      result.redirect('/' + this.url + '/insect-tracker');
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
    return false;
  }

}

module.exports.ToolsServer = ToolsServer;