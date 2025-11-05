class Layer {

  constructor() {
    this.id = null;
    this.owner = null;
    this.opacity = 1.0;
    this.visible = true;
    this.editable = true;
  }

  static fromJSON(json) {
    if (json.type == 'tile_layer')
      return TileLayer.fromJSON(json);

    return null;
  }

  repaint(canvasScreen) {}

}