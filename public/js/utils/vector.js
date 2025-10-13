class Vector {

  static ZERO = new Vector(0, 0);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  sub(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  scale(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  scaleIndividual(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  length() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  distance(vector) {
    return vector.sub(this).length();
  }

  normalize() {
    var length = this.length();
    return this.scale(1 / length);
  }

  static DIAG(value) {
    return new Vector(value, value);
  }

}