class TileLayer extends Layer {

  constructor() {
    super();

    this.tiles = {};
    this.subLayers = {};
    this.subLayerOrder = [];
    this.history = -1;
  }

  generateSubLayer(id, baseID = null) {
    if (Object.keys(this.subLayers).includes(id))
      return;

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

    var topLeftTilePos = topLeft.scale(1 / TILE_SIZE).floor();
    var bottomRightTilePos = bottomRight.scale(1 / TILE_SIZE).floor();

    for (var tileX = topLeftTilePos.x; tileX <= bottomRightTilePos.x; tileX++) {
      for (var tileY = topLeftTilePos.y; tileY <= bottomRightTilePos.y; tileY++) {
        if (this.subLayers[subLayerID][tileX + ',' + tileY] == null)
          this.subLayers[subLayerID][tileX + ',' + tileY] = new Tile(tileX, tileY);

        var tile = this.subLayers[subLayerID][tileX + ',' + tileY];
        
        var tileLocation = location.sub(tile.pos.scale(TILE_SIZE));
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

  static fromJSON(json) {
    var tileLayer = new TileLayer();
    tileLayer.id = json.id;
    tileLayer.owner = json.owner;
    tileLayer.opacity = json.opacity;
    tileLayer.visible = json.visible;
    tileLayer.editable = json.editable;
    json.tiles.forEach((tile) => {
      tileLayer.tiles['' + tile.x + ',' + tile.y] = Tile.fromJSON(tile);
    });
    Object.keys(json.subLayers).forEach((subLayerID) => {
      tileLayer.subLayers[subLayerID] = {};
      json.subLayers[subLayerID].forEach((tile) => {
        tileLayer.subLayers[subLayerID]['' + tile.x + ',' + tile.y] =
            Tile.fromJSON(tile);
      })
    });
    tileLayer.subLayerOrder = json.subLayerOrder;
    tileLayer.history = json.history;
    return tileLayer;
  }
  
  paintLayer(canvasScreen, tiles) {
    var topLeftCanvas = canvasScreen.getTopLeftCanvas();
    var bottomRightCanvas = canvasScreen.getBottomRightCanvas();
    Object.values(tiles).filter((tile) => {
      var topLeft = tile.pos.scale(TILE_SIZE);
      var bottomRight = tile.pos.add(Vector.DIAG(1)).scale(TILE_SIZE);

      return topLeft.x <= bottomRightCanvas.x && topLeft.y <= bottomRightCanvas.y
          && bottomRight.x >= topLeftCanvas.x && bottomRight.y >= topLeftCanvas.y;
    }).forEach((tile) => {
      tile.repaint(canvasScreen);
    });
  }

  repaint(canvasScreen) {
    if (this.history < this.subLayerOrder.length)
      this.paintLayer(canvasScreen,
                      this.subLayers[this.subLayerOrder[this.history]]);
    else
      this.paintLayer(canvasScreen, this.tiles);
  }

}