const _PATH = require('path');
const _SHAPE = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape'));

class ShapeCircle extends _SHAPE.Shape {

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

}

module.exports.ShapeCircle = ShapeCircle;