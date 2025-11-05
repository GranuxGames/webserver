const _PATH = require('path');
const { Shape } = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape'));
const { ShapeSquare } = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape_square'));
const { ShapeCircle } = require(_PATH.join(global.__path.src, 'tools', 'canvas', 'shape_circle'));

class ShapeManager {

  static shapes = {
    square: {},
    circle: {}
  };

  static getShape(type, size, r = 0, g = 0, b = 0, a = 255) {
    var color = '' + r + ',' + g + ',' + b + ',' + a;

    if (type == Shape.TYPE.square) {
      if (ShapeManager.shapes.square[size] == null)
        ShapeManager.shapes.square[size] = {};
      if (ShapeManager.shapes.square[size][color] == null)
        ShapeManager.shapes.square[size][color] = new ShapeSquare(size, r, g, b, a);
      return ShapeManager.shapes.square[size][color];
    }

    if (type == Shape.TYPE.circle) {
      if (ShapeManager.shapes.circle[size] == null)
        ShapeManager.shapes.circle[size] = {};
      if (ShapeManager.shapes.circle[size][color] == null)
        ShapeManager.shapes.circle[size][color] = new ShapeCircle(size, r, g, b, a);
      return ShapeManager.shapes.circle[size][color];
    }

    return null;
  }

  static fromJSON(data) {
    var type = data.type;
    var size = data.size;
    var r = data.color.r;
    var g = data.color.g;
    var b = data.color.b;
    var a = data.color.a;
    return ShapeManager.getShape(type, size, r, g, b, a);
  }

}

module.exports.ShapeManager = ShapeManager;