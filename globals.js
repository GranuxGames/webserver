const _PATH = require('path');

/**
 * An object containing the paths to all important locations.
 */
global.__path = {
  root: __dirname,
  config: _PATH.join(__dirname, 'settings.yaml'),
  databases: _PATH.join(__dirname, 'databases'),
  src: _PATH.join(__dirname, 'src'),
  public: _PATH.join(__dirname, 'public'),
  html: _PATH.join(__dirname, 'public', 'html'),
  log: _PATH.join(__dirname, 'logs')
};

/**
 * The possible responses for a request to the server.
 */
global.__response = {
  success: 'success',
  failure: 'failure'
};