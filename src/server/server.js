class Server {

  constructor(url) {
    this.url = url;
  }

  attachCallbacks(expressServer) {}

  connectSocket(socket, url) {}

}

module.exports.Server = Server;