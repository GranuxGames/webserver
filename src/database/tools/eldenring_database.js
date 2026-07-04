const _PATH = require('path');

const _DATABASE = require(_PATH.join(global.__path.src, 'database', 'database'));


/**
 * The class to hold the canvas database for the canvas tool.
 *
 * @class EldenRingDatabase
 * @typedef {EldenRingDatabase}
 * @extends {_DATABASE.Database}
 */
class EldenRingDatabase extends _DATABASE.Database {

  /**
   * Creates an instance of EldenRingDatabase.
   *
   * @constructor
   */
  constructor() {
    super(_PATH.join('tools', 'eldenring.db'));
  }

  async saveRandomizerGraph(graph, url) {
    graph = JSON.stringify(graph);

    var table = await this.query('SELECT * FROM RandomizerGraphs WHERE RandomizerGraphs.URL == ?', [url]);

    if (table.length <= 0) {
      this.execute('INSERT INTO RandomizerGraphs (URL, Graph) VALUES (?, ?)', [url, graph]);
      return;
    }

    this.execute('UPDATE RandomizerGraphs SET Graph = ? WHERE RandomizerGraphs.URL == ?', [graph, url]);
  }

  async loadRandomizerGraph(url) {
    var table = await this.queryFirst('SELECT * FROM RandomizerGraphs WHERE RandomizerGraphs.URL == ?', [url]);
    if (table == null)
      return {};
    return JSON.parse(table.Graph);
  }

}

EldenRingDatabase.instance = new EldenRingDatabase();

module.exports.EldenRingDatabase = EldenRingDatabase;