const _PATH = require('path');
const _SHAPE = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape'));

class ShapeSquare extends _SHAPE.Shape {

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

}

module.exports.ShapeSquare = ShapeSquare;