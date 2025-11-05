class Tile {

  constructor(x, y) {
    this.pos = new Vector(x, y);
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = TILE_SIZE;
    this.canvas.height = TILE_SIZE;

    var scaledPos = this.pos.scale(TILE_SIZE);
    this.rect = new Rect(scaledPos.x, scaledPos.y, TILE_SIZE, TILE_SIZE);
  }

  static fromJSON(json) {
    var tile = new Tile(json.x, json.y);
    var img = new Image();
    img.onload = () => {
      tile.ctx.drawImage(img, 0, 0, tile.canvas.width, tile.canvas.height);
    };
    img.src = json.img;
    return tile;
  }

  repaint(canvasScreen) {
    canvasScreen.ctx.save();

    var rect = this.rect.toScreen(canvasScreen);
    canvasScreen.ctx.drawImage(this.canvas, rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
    
    canvasScreen.ctx.restore();
  }
  
}