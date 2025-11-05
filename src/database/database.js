const _PATH = require('path');

const _SQLITE3 = require('sqlite3').verbose();


/**
 * A class to hold and access an sqlite database.
 *
 * @class Database
 * @typedef {Database}
 */
class Database {

  /**
   * Creates an instance of Database.
   *
   * @constructor
   * @param {string} path The path to the database relative to the global base
   *                      database path.
   */
  constructor(path) {
    this.path = _PATH.join(global.__path.databases, path);

    this.db = new _SQLITE3.Database(this.path, (err) => {
      if (err)
        console.log('Error connecting to the database: ', err.message);
    });
  }
  
  /**
   * An asynchronous function that executes sql code in the sqlite databse
   * without returning any value.
   *
   * @async
   * @param {string} sql The sql request.
   * @param {string[]} [params=[]] The list of parameters of the sql request.
   */
  async execute(sql, params = []) {
    if (params && params.length > 0) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  
  /**
   * An asynchronous function that queries all rows according to the sql
   * request.
   *
   * @async
   * @param {string} sql The sql request.
   * @param {string[]} [params=[]]  The list of parameters of the sql request.
   * @returns {Promise} A promise with the result of the request.
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
  
  /**
   * An asynchronous function that queries the first rows according to the sql
   * request.
   *
   * @async
   * @param {string} sql The sql request.
   * @param {string[]} [params=[]]  The list of parameters of the sql request.
   * @returns {Promise} A promise with the result of the request. The promise
   *                    will return null if the request does not return a row.
   */
  async queryFirst(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

}

module.exports.Database = Database;