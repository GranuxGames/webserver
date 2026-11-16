const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));
const { UserDatabase } = require(_PATH.join(global.__path.src, 'database', 'index', 'user_database'));


/**
 * A server to collect all different tools.
 *
 * @class ToolsServer
 * @typedef {IndexServer}
 * @extends {_SERVER.Server}
 */
class IndexServer extends _SERVER.Server {

  /**
   * Creates an instance of IndexServer.
   *
   * @constructor
   */
  constructor() {
    super('');
    
    this.sites.push('');
    this.sites.push('/login');
    this.sites.push('/register');
  }

  
  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {
    expressServer.all('', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'general', 'index.html'));
    });

    expressServer.all('/login', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'general', 'login.html'));
    });

    expressServer.post('/api/login', async (request, result) => {
      var error = await UserDatabase.instance.login(request.body.username || '', request.body.password || '', request, result);

      if (error == UserDatabase.instance.ERROR.none)
        return result.json({ ok: true });

      return result.status(409).json({ ok: false, error: error });
    });

    expressServer.all('/api/logout', async (request, result) => {
      await UserDatabase.instance.logout(request, result);
    });

    expressServer.all('/register', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'general', 'register.html'));
    });

    expressServer.post('/api/register', async (request, result) => {
      var error = await UserDatabase.instance.register(request.body.username || '', request.body.email || '', request.body.password || '');

      if (error == UserDatabase.instance.ERROR.none)
        return result.json({ ok: true });

      return result.status(409).json({ ok: false, error: error });
    });

    expressServer.all('{/*path}', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'general', '404.html'));
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

module.exports.IndexServer = IndexServer;