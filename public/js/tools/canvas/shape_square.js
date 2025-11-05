class ShapeSquare extends Shape {

  constructor(size, r = 0, g = 0, b = 0, a = 255) {
    super(size, r, g, b, a);
  }

  generateImageData() {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        this.setColor(x, y, this.r, this.g, this.b, this.a);
      }
    }
  }

  drawOnCanvas(canvasScreen, position) {
    canvasScreen.ctx.save();

    canvasScreen.ctx.strokeStyle = '#0003';
    canvasScreen.ctx.lineWidth = 1;
    
    position = this.getTopLeft(position);

    var corner = canvasScreen.canvasToScreen(
        position.add(Vector.DIAG(this.size)));
    
    position = canvasScreen.canvasToScreen(position);
    var dimension = corner.sub(position);
    canvasScreen.ctx.strokeRect(position.x, position.y,
                                dimension.x, dimension.y);

    canvasScreen.ctx.restore();
  }

  toJSON() {
    var json = {};
    json.type = Shape.TYPE.square;
    json.size = this.size;
    json.color = {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
    return json;
  }

}