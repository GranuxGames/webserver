const { request } = require('http');
const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));

class ObsidianServer extends _SERVER.Server {

  constructor() {
    super(global.__config.obsidian.url);
    
    this.sites.push('');
  }
  
    
  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {
    expressServer.all('/' + this.url, (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'obsidian', 'library.html'));
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

module.exports.ObsidianServer = ObsidianServer;