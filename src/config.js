const _YAML = require('js-yaml');
const _FS = require('fs');
const _PATH = require('path');
const _UTILS = require(_PATH.join(global.__path.src, 'utils'));

/**
 * The default config as an object.
 */
const DEFAULT_CONFIG = {
  tools: {
    url: 'tools',
    canvas: {
      history_length: 32,
      tile_size: 512
    }
  },
  server: {
    port: 12345,
    https: {
      key: '',
      certificate: ''
    }
  }
};


/**
 * This function loads a YAML file into a config object. It is checked for its
 * validity and fixed using the DEFAULT_CONFIG object. The config yaml file is
 * replaced with the fixed file and, if it does not exist, it is created.
 *
 * @param {string} path The path to the config file.
 */
function loadConfig(path) {
  var config = {};

  // try loading the config file
  try {
    config = _YAML.load(_FS.readFileSync(path, 'utf8'));
  } catch (e) {
    // if the file does not exist load the default config
    config = DEFAULT_CONFIG;
  }

  // fix the config 
  config = _UTILS.fixObject(config, DEFAULT_CONFIG);
  // write the fixed config back to the yaml file
  _FS.writeFileSync(path, _YAML.dump(config));

  // put the config into the global variables
  global.__config = config;

  // check the config for validity
  checkConfig(config);
}


/**
 * This function checks the config for errors. In case of an error an exception
 * is thrown.
 *
 * @param {object} config The config object to be checked.
 * 
 * @throws {Error} An error detailing the error in the config.
 */
function checkConfig(config) {
  _UTILS.checkURL(config.tools.url);
  checkHttps(config.server.https);
}


/**
 * This function checks the https config for errors. In case of an error an
 * exception is thrown.
 *
 * @param {object} https The https object of the config.
 * 
 * @returns {boolean} A value of true if the https config is valid.
 * 
 * @throws {Error} An error detailing the error in the https config.
 */
function checkHttps(https) {
  if (https.key.length <= 0 && https.certificate.length <= 0)
    return true;

  if (https.key.length <= 0 || https.certificate.length <= 0)
    throw new Error('For HTTPS both key and certificate paths must exist!');

  if (https.key.startsWith('.')) {
    global.__config.server.https.key = global.__path.root + https.key.slice(1);
    https.key = global.__config.server.https.key;
  }

  if (https.certificate.startsWith('.')) {
    global.__config.server.https.certificate = global.__path.root
                                               + https.certificate.slice(1);
    https.certificate = global.__config.server.https.certificate;
  }

  if (!_FS.existsSync(https.key))
    throw new Error('HTTPS key file must exist');

  if (!_FS.existsSync(https.certificate))
    throw new Error('HTTPS certificate file must exist');

  return true;
}

module.exports.loadConfig = loadConfig;