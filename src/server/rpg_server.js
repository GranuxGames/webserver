const { request } = require('http');
const _PATH = require('path');
const { DNDDatabase } = require('../database/rpgs/dnd/dnd_database');
const _SERVER = require(_PATH.join(global.__path.src, 'server', 'server'));
const _FS = require('fs');

class RPGServer extends _SERVER.Server {

  constructor() {
    super(global.__config.rpg.url);
  }
  
    
  /**
   * This method attaches the GET/POST/... request callbacks to the server. It
   * is an abstract function meant to be overridden by the server subclass.
   * 
   * @param {Express} expressServer 
   */
  attachCallbacks(expressServer) {
    expressServer.all('/' + this.url + '/dnd/character-sheet', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'rpgs', 'dnd', 'character.html'));
    });

    expressServer.all('/' + this.url + '/dnd/items', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'rpgs', 'dnd', 'items.html'));
    });

    expressServer.all('/' + this.url + '/dnd/items{/*path}', async (request, result) => {
      var name = request.url.substring(('/' + this.url + '/dnd/items/').length);
      var names = await DNDDatabase.instance.listItemNames();
      for (var row of names) {
        if ('' + row.id + '-' + row.name == name) {
          var file = '' + _FS.readFileSync(_PATH.join(global.__path.html, 'rpgs', 'dnd', 'item.html'));
          var item = await DNDDatabase.instance.getItem(row.id);
          file = file.replaceAll('$TITLE$', item.name);
          file = file.replaceAll('$ITEM$', JSON.stringify(item));
          result.send(file);
          return;
        }

        if ('' + row.id == name) {
          result.redirect('' + row.id + '-' + row.name);
          return;
        }

        if (row.name.toLowerCase() == name.toLowerCase()) {
          result.redirect('' + row.id + '-' + row.name);
          return;
        }

        if (('' + row.id + '-' + row.name).toLowerCase() == name.toLowerCase()) {
          result.redirect('' + row.id + '-' + row.name);
          return;
        }
      }
    });

    expressServer.all('/' + this.url + '/dnd/creatures', (request, result) => {
      result.sendFile(_PATH.join(global.__path.html, 'rpgs', 'dnd', 'creatures.html'));
    });

    expressServer.post('/' + this.url + '/dnd/api/list-items', async (request, result) => {
      var items = await DNDDatabase.instance.listItems();
      return result.json({ ok: true, items: items });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-rarities', async (request, result) => {
      var rarities = await DNDDatabase.instance.listItemRarities();
      return result.json({ ok: true, rarities: rarities });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-types', async (request, result) => {
      var types = await DNDDatabase.instance.listItemTypes();
      return result.json({ ok: true, types: types });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-subtypes', async (request, result) => {
      var subtypes = await DNDDatabase.instance.listItemSubtypes();
      return result.json({ ok: true, subtypes: subtypes });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-attributes', async (request, result) => {
      var attributes = await DNDDatabase.instance.listItemAttributes();
      return result.json({ ok: true, attributes: attributes });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-bonuses', async (request, result) => {
      var bonuses = await DNDDatabase.instance.listItemBonuses();
      return result.json({ ok: true, bonuses: bonuses });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-requirements', async (request, result) => {
      var requirements = await DNDDatabase.instance.listItemRequirements();
      return result.json({ ok: true, requirements: requirements });
    });

    expressServer.post('/' + this.url + '/dnd/api/list-item-tags', async (request, result) => {
      var tags = await DNDDatabase.instance.listItemTags();
      return result.json({ ok: true, tags: tags });
    });

    expressServer.post('/' + this.url + '/dnd/api/get-item', async (request, result) => {
      if (request.body.id == null)
        return result.status(409).json({ ok: false });

      var item = await DNDDatabase.instance.getItem(request.body.id);

      if (item == null)
        return result.status(409).json({ ok: false });

      return result.json({ ok: true, item: item });
    });

    expressServer.post('/' + this.url + '/dnd/api/get-creature', async (request, result) => {
      if (request.body.id == null)
        return result.status(409).json({ ok: false });

      var creature = await DNDDatabase.instance.getCreature(request.body.id);

      if (creature == null)
        return result.status(409).json({ ok: false });

      return result.json({ ok: true, creature, creature });
    });
  }

  /**
   * This method checks if the provided url belongs to this server. If it does
   * the socket is handled appropriately by this server class. This is an
   * abstract function meant to be overridden by the server subclass.
   *
   * @param {Socket} socket The socket to connect with the server.
   * @param {string} url The url on which the socket is trying to connect.
   * @returns {boolean} Returns true if the socket could be connected and false
   *                    in any other case.
   */
  connectSocket(socket, url) {
    return false;
  }

}

module.exports.RPGServer = RPGServer;