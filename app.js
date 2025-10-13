const _PATH = require('path');
const _GLOBALS = require(_PATH.join(__dirname, 'globals.js'));
const _CONFIG = require(_PATH.join(global.__path.src, 'config'));
const _LOGGER = require(_PATH.join(global.__path.src, 'logger'));
const _EXPRESS = require('express');
const _HTTP = require('http');
const _HTTPS = require('https');
const _FS = require('fs');
const _SOCKET = require('socket.io');
const _SERVER_MANAGER = require(_PATH.join(global.__path.src, 'server', 'server_manager'));
const _TOOLS_SERVER = require(_PATH.join(global.__path.src, 'server', 'tools_server'));

_LOGGER.log('Loading Config...');

// load config
_CONFIG.loadConfig(global.__path.config);

_LOGGER.log('Starting HTTP Server...');

// start express server
const EXPRESS_SERVER = _EXPRESS();
// use json in requests and responses
EXPRESS_SERVER.use(_EXPRESS.json());

// launch html server
var HTTP_SERVER;
if (global.__config.server.https.key.length <= 0) {
  HTTP_SERVER = _HTTP.createServer(EXPRESS_SERVER);
} else {
  const PRIVATE_KEY = _FS.readFileSync(global.__config.server.https.key, 'utf8');
  const CERTIFICATE = _FS.readFileSync(global.__config.server.https.certificate, 'utf8');
  const CREDENTIALS = { key: PRIVATE_KEY, cert: CERTIFICATE };
  HTTP_SERVER = _HTTPS.createServer(CREDENTIALS, EXPRESS_SERVER);
}

_LOGGER.log('Starting IO Server...');

// launch io server
const IO_SERVER = new _SOCKET.Server(HTTP_SERVER, {
  pingInterval: 5000,
  pingTimeout: 10000,
  cors: {
    origin: '*'
  }
});

// use the public folder for static files
EXPRESS_SERVER.use(_EXPRESS.static('public'));

// remove trailing slashes from all adresses
EXPRESS_SERVER.use((req, res, next) => {
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

var serverManager = new _SERVER_MANAGER.ServerManager(EXPRESS_SERVER);
serverManager.addServer(new _TOOLS_SERVER.ToolsServer());

// callback for socket connections
IO_SERVER.on('connection', (socket) => {
  socket.on('request-connection', (url) => {
    if (serverManager.connectSocket(socket, url)) {
      _LOGGER.log('Socket ' + socket.id + ' connected on ' + url);
    } else {
      _LOGGER.warn('Socket ' + socket.id + ' tried to connect to ' + url);
    }
  });
});

// start server listen
HTTP_SERVER.listen(global.__config.server.port, () => {
  _LOGGER.log('Server Listening on port ' + global.__config.server.port);
});