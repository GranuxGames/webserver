const { createCanvas } = require('canvas');
const { createImageData } = require('canvas');
const _PATH = require('path');

const { Vector2 } = require(_PATH.join(global.__path.src, 'utils', 'vector2'));

class Shape {

  static TYPE = {
    square: 'square',
    circle: 'circle'
  };

  constructor(size, r = 0, g = 0, b = 0, a = 255) {
    this.size = size;
    var data = new Uint8ClampedArray(this.size * this.size * 4);
    this.imageData = createImageData(data, size, size);
    this.img = createCanvas(size, size);
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

  getTopLeft(pos) {
    var d = new Vector2(this.size, this.size).sub(new Vector2(1, 1))
                                             .scale(0.5).floor();
    return pos.sub(d);
  }

  getBottomRight(pos) {
    var d = new Vector2(this.size, this.size).sub(new Vector2(1, 1))
                                             .scale(0.5).floor();
    return pos.sub(d).add(Vector2.DIAG(this.size - 1));
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

  getColorString() {
    return '' + this.r + ',' + this.g + ',' + this.b + ',' + this.a;
  }

}

module.exports.Shape = Shape;