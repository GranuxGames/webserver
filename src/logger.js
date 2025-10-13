const _PATH = require('path');
const _UTILS = require(_PATH.join(global.__path.src, 'utils'));

/**
 * The types of messages possible to log.
 */
const MSG_TYPE = {
  log: 'info',
  error: 'error',
  warning: 'warn'
};

/**
 * The greatest length among the message type prefixes.
 */
const MSG_TYPE_LENGTH = Object.values(MSG_TYPE).map((type) => {
  return type.length;
}).sort().reverse()[0];

/**
 * This function logs a message.
 *
 * @param {string} msg The message to log.
 */
function log(msg) {
  writeToConsole(msg, MSG_TYPE.log);
}

/**
 * This function logs a message as a warning.
 *
 * @param {string} msg The message to log.
 */
function warn(msg) {
  writeToConsole(msg, MSG_TYPE.warning);
}

/**
 * This function logs a message as an error.
 *
 * @param {string} msg The message to log.
 */
function error(msg) {
  writeToConsole(msg, MSG_TYPE.error);
}

/**
 * This function writes a message with a given prefix to the console.
 *
 * @param {string} msg The message to write.
 * @param {string} prefix The prefix before the message.
 */
function writeToConsole(msg, prefix) {
  var lines = msg.match(/[^\r\n]+/g);
  var beginning = _UTILS.getDateTimeString() + ' ';
  beginning += ('[' + prefix + ']:').padEnd(MSG_TYPE_LENGTH + 4, ' ');
  lines.forEach((line) => {
    console.log(beginning + line);
  })
}

module.exports.log = log;
module.exports.warn = warn;
module.exports.error = error;