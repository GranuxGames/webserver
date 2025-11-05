class Layer {

  constructor() {
    this.layer_id = 0;
    this.owner = null;
    this.opacity = 1.0;
    this.visible = true;
    this.editable = true;
  }

  toJSON() {
    var json = {};
    json.id = this.layer_id;
    json.owner = this.owner;
    json.opacity = this.opacity;
    json.visible = this.visible;
    json.editable = this.editable;
    return json;
  }

}

module.exports.Layer = Layer;