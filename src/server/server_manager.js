class ServerManager {

  constructor(expressServer) {
    this.expressServer = expressServer;
    this.servers = [];
    this.expressServer.all('/get-api', this.getAPI.bind(this));
  }

  addServer(server) {
    this.servers.push(server);
    server.attachCallbacks(this.expressServer);
  }

  getAPI(request, result, next) {
    for (var server of this.servers) {
      if (request.body.url.startsWith(server.url)) {
        result.send(JSON.stringify({
          status: global.__response.success,
          body: server.getAPI(request.body.url)
        }));
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

  connectSocket(socket, url) {
    for (var server of this.servers) {
      if (url.startsWith(server.url)) {
        return server.connectSocket(socket, url);
      }
    }
    return false;
  }

}

module.exports.ServerManager = ServerManager;