const _PATH = require('path');
const _LAYER = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'layer'));
const { Tile } = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'tile'));

class TileLayer extends _LAYER.Layer {

  constructor() {
    super();

    this.tile_layer_id = 0;
    this.tiles = {};
    this.subLayers = {};
    this.subLayerOrder = [];
    this.history = 0;
  }

  generateSubLayer(id, baseID = null) {
    var tiles = {};
    var originalTiles = this.tiles;
    if (baseID == null) {
      if (this.history < this.subLayerOrder.length) {
        originalTiles = this.subLayers[this.subLayerOrder[this.history]];
        baseID = this.subLayerOrder[this.history];
      } else {
        baseID = -1;
      }
    } else {
      if (baseID != -1) {
        originalTiles = this.subLayers[baseID];
      }
    }
    Object.keys(originalTiles).forEach((key) => {
      var tile = new Tile(originalTiles[key].pos.x, originalTiles[key].pos.y);
      tile.ctx.drawImage(originalTiles[key].canvas, 0, 0);
      tiles[key] = tile;
    });
    this.subLayers[id] = tiles;

    return baseID;
  }

  shapeCB(shape, location, subLayerID, cb) {
    var topLeft = shape.getTopLeft(location);
    var bottomRight = shape.getBottomRight(location);

    var topLeftTilePos = topLeft.scale(1 / global.__config.tools.canvas.tile_size).floor();
    var bottomRightTilePos = bottomRight.scale(1 / global.__config.tools.canvas.tile_size).floor();

    for (var tileX = topLeftTilePos.x; tileX <= bottomRightTilePos.x; tileX++) {
      for (var tileY = topLeftTilePos.y; tileY <= bottomRightTilePos.y; tileY++) {
        if (this.subLayers[subLayerID][tileX + ',' + tileY] == null)
          this.subLayers[subLayerID][tileX + ',' + tileY] = new Tile(tileX, tileY);

        var tile = this.subLayers[subLayerID][tileX + ',' + tileY];
        
        var tileLocation = location.sub(tile.pos.scale(global.__config.tools.canvas.tile_size));
        cb(tile.ctx, tileLocation);
      }
    }
  }

  drawShape(shape, location, subLayerID) {
    this.shapeCB(shape, location, subLayerID, (ctx, loc) => {
      shape.draw(ctx, loc);
    });
  }

  placeShape(shape, location, subLayerID) {
    this.shapeCB(shape, location, subLayerID, (ctx, loc) => {
      shape.place(ctx, loc);
    });
  }

  toJSON() {
    var json = super.toJSON();
    json.type = 'tile_layer';
    json.tiles = Object.values(this.tiles).map((tile) => {
      return tile.toJSON();
    });
    json.subLayers = {};
    Object.keys(this.subLayers).forEach((subLayerID) => {
      json.subLayers[subLayerID] = Object.values(this.subLayers[subLayerID])
          .map((tile) => {
        return tile.toJSON();
      });
    });
    json.subLayerOrder = this.subLayerOrder;
    json.history = this.history;
    return json;
  }

}

module.exports.TileLayer = TileLayer;