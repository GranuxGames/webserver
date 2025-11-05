class Line {

  constructor(x1, y1, x2, y2) {
    this.p1 = new Vector(x1, y1);
    this.p2 = new Vector(x2, y2);
  }

  callbackOnPoint(callback) {
    var p1 = this.p1.clone();
    var p2 = this.p2.clone();
    if (p1.equal(p2)) {
      callback(p1);
      return;
    }

    var m = (p2.y - p1.y) / (p2.x - p1.x);

    if (m <= 1 && m >= -1) {
      if (p2.x < p1.x) {
        var tmp = p2;
        p2 = p1;
        p1 = tmp;
      }

      for (var x = p1.x; x <= p2.x; x++) {
        callback(new Vector(x, m * (x - p1.x) + p1.y).round());
      }
    } else {
      m = (p2.x - p1.x) / (p2.y - p1.y);
      if (p2.y < p1.y) {
        var tmp = p2;
        p2 = p1;
        p1 = tmp;
      }

      for (var y = p1.y; y <= p2.y; y++) {
        callback(new Vector(m * (y - p1.y) + p1.x, y).round());
      }
    }
  }

  getPoints() {
    var p1 = this.p1.clone();
    var p2 = this.p2.clone();
    var positions = [];
    if (p1.equal(p2))
      return [p1];

    var m = (p2.y - p1.y) / (p2.x - p1.x);

    if (m <= 1 && m >= -1) {
      if (p2.x < p1.x) {
        var tmp = p2;
        p2 = p1;
        p1 = tmp;
      }

      for (var x = p1.x; x <= p2.x; x++) {
        positions.push(new Vector(x, m * (x - p1.x) + p1.y).round());
      }
    } else {
      m = (p2.x - p1.x) / (p2.y - p1.y);
      if (p2.y < p1.y) {
        var tmp = p2;
        p2 = p1;
        p1 = tmp;
      }

      for (var y = p1.y; y <= p2.y; y++) {
        positions.push(new Vector(m * (y - p1.y) + p1.x, y).round());
      }
    }

    return positions;
  }

}