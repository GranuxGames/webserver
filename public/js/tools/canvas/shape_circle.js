class ShapeCircle extends Shape {

  constructor(size, r = 0, g = 0, b = 0, a = 255) {
    super(size, r, g, b, a);
  }

  generateImageData() {
    var r = this.size / 2.0;
    r **= 2.0;
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var dx = x - (this.size - 1.0) / 2.0;
        dx **= 2.0;
        var dy = y - (this.size - 1.0) / 2.0;
        dy **= 2.0;

        if (dx + dy > r)
          continue;

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

    position = position.add(dimension.scale(0.5));
    canvasScreen.ctx.beginPath();
    canvasScreen.ctx.arc(position.x, position.y, dimension.x / 2, 0, 2 * Math.PI);
    canvasScreen.ctx.stroke();

    canvasScreen.ctx.restore();
  }

  toJSON() {
    var json = {};
    json.type = Shape.TYPE.circle;
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