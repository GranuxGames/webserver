const _PATH = require('path');
const _GLOBALS = require(_PATH.join(__dirname, 'globals.js'));
const _CONFIG = require(_PATH.join(global.__path.src, 'config'));
const _LOGGER = require(_PATH.join(global.__path.src, 'logger'));
const _EXPRESS = require('express');
const _SESSION = require('express-session');
const _HTTP = require('http');
const _HTTPS = require('https');
const _FS = require('fs');
const _SOCKET = require('socket.io');
const _SERVER_MANAGER = require(_PATH.join(global.__path.src, 'server', 'server_manager'));
const _TOOLS_SERVER = require(_PATH.join(global.__path.src, 'server', 'tools_server'));
const _OBSIDIAN_SERVER = require(_PATH.join(global.__path.src, 'server', 'obsidian_server'));
const _RPG_SERVER = require(_PATH.join(global.__path.src, 'server', 'rpg_server'));
const _GAMES_SERVER = require(_PATH.join(global.__path.src, 'server', 'games_server'));
const _INDEX_SERVER = require(_PATH.join(global.__path.src, 'server', 'index_server'));

_LOGGER.init();
_LOGGER.log('Loading Config...');

// load config
_CONFIG.loadConfig(global.__path.config);

_LOGGER.log('Starting HTTP Server...');

// start express server
const EXPRESS_SERVER = _EXPRESS();
// set in case of server behind proxy
EXPRESS_SERVER.set("trust proxy", 1);
// use json in requests and responses
EXPRESS_SERVER.use(_EXPRESS.json());
// session authentication
EXPRESS_SERVER.use(_SESSION({
  name: 'sdi',
  secret: process.env[global.__config.server.users.session_secret],
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// launch html server
var HTTP_SERVER;
if (global.__config.server.https.key.length <= 0) {
  HTTP_SERVER = _HTTP.createServer(EXPRESS_SERVER);
} else {
  _LOGGER.log('Enabling HTTPS...');
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
  if (req.session.userName != undefined)
    console.log(req.session.userName);
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
  } else {
    var ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;
    ip = ip.replace(/^.*:/, '');
    _LOGGER.log(ip + ' requested "' + req.url + '"');
    next();
  }
});

var serverManager = new _SERVER_MANAGER.ServerManager(EXPRESS_SERVER);
serverManager.addServer(new _TOOLS_SERVER.ToolsServer());
serverManager.addServer(new _OBSIDIAN_SERVER.ObsidianServer());
serverManager.addServer(new _RPG_SERVER.RPGServer());
serverManager.addServer(new _GAMES_SERVER.GamesServer());
serverManager.addServer(new _INDEX_SERVER.IndexServer());

// callback for socket connections
IO_SERVER.on('connection', (socket) => {
  socket.on('request-connection', (url) => {
    if (serverManager.connectSocket(socket, url)) {
      _LOGGER.log('Socket ' + socket.id + ' connected on ' + url);
    } else {
      _LOGGER.warn('Socket ' + socket.id + ' tried to connect to ' + url);
    }
    socket.emit('request-connection-response');
  });
});

// start server listen
HTTP_SERVER.listen(global.__config.server.port, () => {
  _LOGGER.log('Server Listening on port ' + global.__config.server.port);
});