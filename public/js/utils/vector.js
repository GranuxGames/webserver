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

  scaleInverted(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  scaleIndividual(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  scaleIndividualInverted(vector) {
    return new Vector(this.x / vector.x, this.y / vector.y);
  }

  floor() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }

  round() {
    return new Vector(Math.round(this.x), Math.round(this.y));
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

  toJSON() {
    return { x: this.x, y: this.y };
  }

  static fromJSON(json) {
    return new Vector(json.x, json.y);
  }

  static DIAG(value) {
    return new Vector(value, value);
  }

  equal(vector) {
    return this.x == vector.x && this.y == vector.y;
  }

  min(vector) {
    return new Vector(Math.min(this.x, vector.x), Math.min(this.y, vector.y));
  }

  max(vector) {
    return new Vector(Math.max(this.x, vector.x), Math.max(this.y, vector.y));
  }

  rotate(angle) {
    var sn = Math.sin(angle);
    var cs = Math.cos(angle);
    return new Vector(this.x * cs - this.y * sn, this.x * sn + this.y * cs);
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

}