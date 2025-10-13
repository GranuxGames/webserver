const _PATH = require('path');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));

class ToolsServer extends _SERVER.Server {

  constructor() {
    super(global.__config.tools.url);
  }

  attachCallbacks(expressServer) {
    expressServer.all('/' + this.url + '/insect-tracker', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'tools', 'insect_tracker',
                                 'insect_tracker.html'));
    });

    expressServer.all('/' + this.url + '{/*path}', (request, result, next) => {
      result.redirect('/' + this.url + '/insect-tracker');
    });
  }

  connectSocket(socket, url) {
    return false;
  }

}

module.exports.ToolsServer = ToolsServer;