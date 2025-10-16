/**
 * This super class contains methods and attributes to handle a generic html or
 * socket server.
 *
 * @class Server
 * @typedef {Server}
 */
class Server {

  /**
   * Creates an instance of Server.
   * 
   * @constructor
   * @param {string} url The (sub-) url on which the server should run.
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {}

  
  /**
   * This method requests an api url from the server.
   *
   * @param {string} url The url for which an api was requested.
   * @returns {string} The url under which the api can be reached or null if
   *                   there is no api available for the url.
   */
  getAPI(url) {
    return null;
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

module.exports.Server = Server;