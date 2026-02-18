const _PATH = require('path');
const _UTILS = require(_PATH.join(global.__path.src, 'utils'));
const _FS = require('fs');

/**
 * The types of messages possible to log.
 */
const MSG_TYPE = {
  log: 'info',
  error: 'error',
  warning: 'warn'
};

/**
 * This string holds the current log file name.
 */
var currentFileName = null;

/**
 * This fild holds the current log file.
 */
var currentFile = null;

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
  createLogFile();
  lines.forEach((line) => {
    console.log(beginning + line);
    currentFile.write(beginning + line + '\n');
  })
}

/**
 * This function initiates the log files
 */
function init() {
  createLogFile();
}

/**
 * This function creates the log file to log to.
 */
function createLogFile() {
  var date = new Date();
  var name = date.getFullYear() + '-'
           + (date.getMonth() + 1) + '-'
           + date.getDate()
           + '.log';
  if (currentFileName != name) {
    if (currentFile != null)
      currentFile.end();
    currentFileName = name;
    currentFile = _FS.createWriteStream(_PATH.join(global.__path.log, name),
                                        {flags: 'a'});
  }
}

module.exports.init = init;
module.exports.log = log;
module.exports.warn = warn;
module.exports.error = error;