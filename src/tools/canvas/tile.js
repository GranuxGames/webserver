const { createCanvas } = require("canvas");
const _PATH = require('path');
const { Vector2 } = require(_PATH.join(global.__path.src, 'utils', 'vector2'));

class Tile {

  constructor(x, y) {
    this.tile_id = null;
    this.pos = new Vector2(x, y);

    this.canvas = createCanvas(global.__config.tools.canvas.tile_size,
                               global.__config.tools.canvas.tile_size);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = global.__config.tools.canvas.tile_size;
    this.canvas.height = global.__config.tools.canvas.tile_size;
  }

  toJSON() {
    var json = {};
    json.x = this.pos.x;
    json.y = this.pos.y;
    json.img = this.canvas.toDataURL();
    return json;
  }

}

module.exports.Tile = Tile;