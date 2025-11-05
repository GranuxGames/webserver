const _PATH = require('path');
const _LOGGER = require(_PATH.join(global.__path.src, 'logger'));
const _TILE_LAYER = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'tile_layer'));
const { ShapeManager } = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape_manager'));
const { Vector2 } = require(_PATH.join(global.__path.src, 'utils', 'vector2'));
const { Line2 } = require(_PATH.join(global.__path.src, 'utils', 'line2'));

class CanvasLobby {

  constructor(lobbyID) {
    this.lobbyID = lobbyID;
    this.sockets = {};

    this.layers = [];

    this.createLobby();
  }

  toJSON() {
    var json = {};
    json.layers = this.layers.map((layer) => {
      return layer.toJSON();
    });
    return json;
  }

  createLobby() {
    // check if lobby exists in database, if so load it
    // also start interval to save the lobby in the database to not do it every
    // request

    this.layers.push(new _TILE_LAYER.TileLayer());
  }

  getSocketsString() {
    return '[' + Object.keys(this.sockets).join(', ') + ']';
  }

  join(socket) {
    this.sockets[socket.socket.id] = socket;
    _LOGGER.log('' + socket.socket.id + ' joined lobby ' + this.lobbyID);
    _LOGGER.log('  ' + this.getSocketsString());
    socket.socket.emit('repaint', JSON.stringify(this.toJSON()));

    // event when a sublayer gets added to a tile layer due to someone editing
    // one of them
    socket.socket.on('add-sublayer', (data) => {
      this.onAddSubLayer(socket.socket.id, JSON.parse(data));
    });

    socket.socket.on('undo-layer', (data) => {
      this.onUndoLayer(JSON.parse(data));
    });

    socket.socket.on('redo-layer', (data) => {
      this.onRedoLayer(JSON.parse(data));
    });

    socket.socket.on('tool-use', (data) => {
      this.onToolUse(socket.socket.id, JSON.parse(data));
    });

    socket.socket.on('remove-sublayer', (data) => {
      this.onRemoveSubLayer(socket.socket.id, JSON.parse(data));
    });
  }

  leave(socket) {
    delete this.sockets[socket.socket.id];
    _LOGGER.log('' + socket.socket.id + ' left lobby ' + this.lobbyID);
    _LOGGER.log('  ' + this.getSocketsString());
  }

  onToolUse(socketID, data) {
    if (data.type == 'pencil')
      this.onPencilUse(data);
    if (data.type == 'eraser')
      this.onEraserUse(data);

    Object.keys(this.sockets).forEach((id) => {
      if (id == socketID)
        return;

      this.sockets[id].socket.emit('tool-use', JSON.stringify(data));
    })
  }

  onPencilUse(data) {
    var shape = ShapeManager.fromJSON(data.shape);
    var layerID = data.layer_id;
    var subID = data.sub_id;
    var points = data.points.map((point) => {
      return Vector2.fromJSON(point);
    });
    var layer = null;
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i].layer_id == layerID) {
        layer = this.layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    for (var i = 1; i < points.length; i++) {
      var line = new Line2(points[i - 1].x, points[i - 1].y,
                           points[i].x, points[i].y);
      line.callbackOnPoint((p) => {
        layer.drawShape(shape, p, subID);
      });
    }
  }

  onEraserUse(data) {
    var shape = ShapeManager.fromJSON(data.shape);
    var layerID = data.layer_id;
    var subID = data.sub_id;
    var points = data.points.map((point) => {
      return Vector2.fromJSON(point);
    });
    var layer = null;
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i].layer_id == layerID) {
        layer = this.layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    for (var i = 1; i < points.length; i++) {
      var line = new Line2(points[i - 1].x, points[i - 1].y,
                           points[i].x, points[i].y);
      line.callbackOnPoint((p) => {
        layer.placeShape(shape, p, subID);
      });
    }
  }

  sendSubLayerOrder(layerID, order, apply, history) {
    Object.keys(this.sockets).forEach((socketID) => {
      this.sockets[socketID].socket.emit('update-layer-order', JSON.stringify({
        id: layerID,
        order: order,
        apply: apply,
        history: history
      }));
    });
  }

  onUndoLayer(data) {
    var order = null;
    var apply = -1;
    var history = 0;
    this.layers.forEach((layer) => {
      if (layer.layer_id != data.id)
        return;

      order = layer.subLayerOrder;
      layer.history++;
      layer.history = Math.min(layer.history, layer.subLayerOrder.length);
      history = layer.history;
    });

    if (order == null)
      return;

    this.sendSubLayerOrder(data.id, order, apply, history);
  }

  onRedoLayer(data) {
    var order = null;
    var apply = -1;
    var history = 0;
    this.layers.forEach((layer) => {
      if (layer.layer_id != data.id)
        return;

      order = layer.subLayerOrder;
      layer.history--;
      layer.history = Math.max(layer.history, 0);
      history = layer.history;
    });

    if (order == null)
      return;

    this.sendSubLayerOrder(data.id, order, apply, history);
  }

  onRemoveSubLayer(socketID, data) {
    var order = null;
    var apply = -1;
    var history = 0;
    this.layers.forEach((layer) => {
      if (layer.layer_id != data.id)
        return;

      var index = layer.subLayerOrder.indexOf(data.sub_id);
      if (index != -1) {
        if (layer.history < index)
          layer.history--;
        layer.subLayerOrder.splice(index, 1);
        delete layer.subLayers[layer.sub_id];
      }
      order = layer.subLayerOrder;
      history = layer.history;
    });

    if (order == null)
      return;

    this.sendSubLayerOrder(data.id, order, apply, history);
  }

  onAddSubLayer(socketID, data) {
    var order = null;
    var apply = -1;
    var history = 0;
    this.layers.forEach((layer) => {
      if (layer.layer_id != data.id)
        return;

      layer.generateSubLayer(data.subid, data.baseid);
      for (var i = 0; i < layer.history; i++) {
        layer.subLayerOrder.shift();
      }
      layer.history = 0;
      layer.subLayerOrder.unshift(data.subid);
      if (layer.subLayerOrder.length >
          global.__config.tools.canvas.history_length) {
        apply = layer.subLayerOrder.pop();
        layer.tiles = layer.subLayers[apply];
      }
      history = layer.history;
      order = layer.subLayerOrder;

      Object.keys(layer.subLayers).map((key) => {
        return !layer.subLayerOrder.includes(key);
      }).forEach((key) => {
        delete layer.subLayers[key];
      });
    });

    Object.keys(this.sockets).forEach((id) => {
      if (id == socketID)
        return;

      this.sockets[id].socket.emit('add-sublayer', JSON.stringify(data));
    });

    if (order == null)
      return;

    this.sendSubLayerOrder(data.id, order, apply, history);
  }

}

module.exports.CanvasLobby = CanvasLobby;