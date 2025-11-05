const CANVAS_SOCKET_PATH = 'tools/canvas';

class CanvasSocket extends Socket {

  constructor() {
    super(CANVAS_SOCKET_PATH);
  }

  attachCallbacks() {
    this.on('connect', this.sendLobbyRequest.bind(this));
    this.on('reconnect', this.sendLobbyRequest.bind(this));
    // open disconnected popup when connection is lost, close it on reconnect

    this.on('repaint', this.onRepaint.bind(this));
    this.on('add-sublayer', this.onAddSubLayer.bind(this));
    this.on('update-layer-order', this.onUpdateLayerOrder.bind(this));
    this.on('tool-use', this.onToolUse.bind(this));
  }

  sendLobbyRequest() {
    var data = { lobby: window.location.pathname.split('/').reverse()[0] };
    this.emit('lobby-request', data);
  }

  onRepaint(data) {
    layers = data.layers.map((json) => {
      return Layer.fromJSON(json);
    });
  }

  onAddSubLayer(data) {
    var layer = null;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id == data.id) {
        layer = layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    layer.generateSubLayer(data.subid, data.baseid);
  }

  onUpdateLayerOrder(data) {
    var layer = null;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id == data.id) {
        layer = layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    layer.subLayerOrder = data.order;
    if (data.apply != -1)
      layer.tiles = layer.subLayers[data.apply];
    layer.history = data.history;

    Object.keys(layer.subLayers).map((key) => {
      return !layer.subLayerOrder.includes(key);
    }).forEach((key) => {
      delete layer.subLayers[key];
    });
  }

  onToolUse(data) {
    if (data.type == 'pencil')
      this.onPencilUse(data);
    if (data.type == 'eraser')
      this.onEraserUse(data);
  }

  onPencilUse(data) {
    var shape = Shape.fromJSON(data.shape);
    var layerID = data.layer_id;
    var subID = data.sub_id;
    var points = data.points.map((point) => {
      return Vector.fromJSON(point);
    });
    var layer = null;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id == layerID) {
        layer = layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    for (var i = 1; i < points.length; i++) {
      var line = new Line(points[i - 1].x, points[i - 1].y,
                          points[i].x, points[i].y);
      line.callbackOnPoint((p) => {
        layer.drawShape(shape, p, subID);
      });
    }
  }

  onEraserUse(data) {
    var shape = Shape.fromJSON(data.shape);
    var layerID = data.layer_id;
    var subID = data.sub_id;
    var points = data.points.map((point) => {
      return Vector.fromJSON(point);
    });
    var layer = null;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id == layerID) {
        layer = layers[i];
        break;
      }
    }

    if (layer == null)
      return;

    for (var i = 1; i < points.length; i++) {
      var line = new Line(points[i - 1].x, points[i - 1].y,
                          points[i].x, points[i].y);
      line.callbackOnPoint((p) => {
        layer.placeShape(shape, p, subID);
      });
    }
  }

}