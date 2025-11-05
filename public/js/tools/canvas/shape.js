var shapes = {
  square: {},
  circle: {}
};

class Shape {

  static TYPE = {
    square: 'square',
    circle: 'circle'
  };

  constructor(size, r = 0, g = 0, b = 0, a = 255) {
    this.size = size;
    this.imageData = new ImageData(this.size, this.size);
    this.img = document.createElement('canvas');
    this.img.width = size;
    this.img.height = size;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.generated = false;
  }

  setColor(x, y, r, g, b, a) {
    this.imageData.data[(x + y * this.size) * 4 + 0] = r;
    this.imageData.data[(x + y * this.size) * 4 + 1] = g;
    this.imageData.data[(x + y * this.size) * 4 + 2] = b;
    this.imageData.data[(x + y * this.size) * 4 + 3] = a;
  }

  generate() {
    if (this.generated)
      return;

    this.generated = true;
    this.generateImageData();
    this.img.getContext('2d').putImageData(this.imageData, 0, 0);
  }

  generateImageData() {}

  drawOnCanvas(canvasScreen, position) {}

  getTopLeft(pos) {
    var d = new Vector(this.size, this.size).sub(new Vector(1, 1))
                                            .scale(0.5).floor();
    return pos.sub(d);
  }

  getBottomRight(pos) {
    var d = new Vector(this.size, this.size).sub(new Vector(1, 1))
                                            .scale(0.5).floor();
    return pos.sub(d).add(Vector.DIAG(this.size - 1));
  }

  place(ctx, position) {
    this.generate();
    
    var p = this.getTopLeft(position);
    ctx.putImageData(this.imageData, p.x, p.y);
  }

  draw(ctx, position) {
    this.generate();

    var p = this.getTopLeft(position);
    ctx.drawImage(this.img, p.x, p.y);
  }

  static getShape(type, size, r = 0, g = 0, b = 0, a = 255) {
    var color = '' + r + ',' + g + ',' + b + ',' + a;

    if (type == Shape.TYPE.square) {
      if (shapes.square[size] == null)
        shapes.square[size] = {};
      if (shapes.square[size][color] == null)
        shapes.square[size][color] = new ShapeSquare(size, r, g, b, a);
      return shapes.square[size][color];
    }

    if (type == Shape.TYPE.circle) {
      if (shapes.circle[size] == null)
        shapes.circle[size] = {};
      if (shapes.circle[size][color] == null)
        shapes.circle[size][color] = new ShapeCircle(size, r, g, b, a);
      return shapes.circle[size][color];
    }

    return null;
  }

  static getShapeType(shape) {
    if (shape instanceof ShapeSquare)
      return Shape.TYPE.square;
    if (shape instanceof ShapeCircle)
      return Shape.TYPE.circle;

    return null;
  }

  static fromJSON(data) {
    var type = data.type;
    var size = data.size;
    var r = data.color.r;
    var g = data.color.g;
    var b = data.color.b;
    var a = data.color.a;
    return Shape.getShape(type, size, r, g, b, a);
  }

  toJSON() {}

}