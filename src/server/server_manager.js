/**
 * This class is used to manage all the different servers necessary.
 *
 * @class ServerManager
 * @typedef {ServerManager}
 */
class ServerManager {
  
  /**
   * Creates an instance of ServerManager.
   *
   * @constructor
   * @param {Express} expressServer 
   */
  constructor(expressServer) {
    this.expressServer = expressServer;
    this.servers = [];
    this.expressServer.all('/get-api', this.getAPI.bind(this));
  }

  /**
   * This method adds a server to the server manager. It attaches all necessary
   * callbacks to the server.
   *
   * @param {Server} server The server to add.
   */
  addServer(server) {
    this.servers.push(server);
    server.attachCallbacks(this.expressServer);
  }

  /**
   * This method is the callback function for api requests to any of the
   * servers. It checks all available servers to whether one of them responds
   * to the given api request.
   *
   * @param {object} request The request object sent as an api request.
   * @param {object} result The object to which the result is sent.
   * @param {*} next The object to manage the next step in the GET process.
   */
  getAPI(request, result, next) {
    for (var server of this.servers) {
      if (request.body.url.startsWith(server.url)) {
        api = server.getAPI(request.body.url);
        if (api != null) {
          result.send(JSON.stringify({
            status: global.__response.success,
            body: api
          }));
        }
        return;
      }
    }

    result.send(JSON.stringify({
      status: global.__response.failure,
      body: {
        message: 'The requested api does not exist.'
      }
    }));
  }

  
  /**
   * This method checks if the provided url belongs to one of the servers. IF
   * it does the socket is handled by the server.
   *
   * @param {Socket} socket The socket to connect with the server.
   * @param {string} url The url on which the socket is trying to connect.
   * @returns {boolean} Returns true if the socket could be connected and false
   *                    in any other case.
   */
  connectSocket(socket, url) {
    for (var server of this.servers) {
      if (url.startsWith(server.url)) {
        return server.connectSocket(socket, url.substring(server.url.length));
      }
    }
    return false;
  }

}

module.exports.ServerManager = ServerManager;