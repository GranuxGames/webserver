const { request } = require('http');
const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));
const _UUID = require('uuid');
const _CANVAS_SOCKET = require(_PATH.join(global.__path.src, 'socket', 'tools', 'canvas_socket'));


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

    expressServer.all('/' + this.url + '/phone-book-editor', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'tools',
                                 'phone_book_editor',
                                 'phone_book_editor.html'));
    });

    // disable canvas until loading is fixed
    // expressServer.all('/' + this.url + '/canvas', (request, result) => {
    //   result.redirect('/' + this.url + '/canvas/' + _UUID.v4());
    // });

    // expressServer.all('/' + this.url + '/canvas{/*path}', (request, result) => {
    //   result.sendFile(_PATH.join(global.__path.html, 'tools', 'canvas',
    //                              'canvas.html'));
    // });

    expressServer.all('/' + this.url, (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'tools', 'tools.html'));
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
    if (url == '/canvas') {
      new _CANVAS_SOCKET.CanvasSocket(socket);
      return true;
    }
    return false;
  }

}

module.exports.ToolsServer = ToolsServer;