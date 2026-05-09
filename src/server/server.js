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
    this.sites = [];
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

  getSitemap() {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
           this.sites.map((site) => {
             return '  <url>\n' +
                    '    <loc>' + (global.__config.server.https.key.length <= 0?'http://':'https://') +
                    global.__config.base_url + ':' + global.__config.server.port +
                    (this.url.length > 0?'/':'') + this.url + site + '</loc>\n' +
                    '    <lastmod>' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '</lastmod>\n' +
                    '  </url>\n';
           }).join('') +
           '</urlset>';
  }

}

module.exports.Server = Server;