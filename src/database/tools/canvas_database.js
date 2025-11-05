const _PATH = require('path');

const _DATABASE = require(_PATH.join(global.__path.src, 'database', 'database'));


/**
 * The class to hold the canvas database for the canvas tool.
 *
 * @class CanvasDatabase
 * @typedef {CanvasDatabase}
 * @extends {_DATABASE.Database}
 */
class CanvasDatabase extends _DATABASE.Database {

  /**
   * Creates an instance of CanvasDatabase.
   *
   * @constructor
   */
  constructor() {
    super(_PATH.join('tools', 'canvas.db'));
  }

}

module.exports.CanvasDatabase = CanvasDatabase;