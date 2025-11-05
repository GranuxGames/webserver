class Vector2 {

  static ZERO = new Vector2(0, 0);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  add(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  sub(vector) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  scale(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  scaleInverted(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  scaleIndividual(vector) {
    return new Vector2(this.x * vector.x, this.y * vector.y);
  }

  scaleIndividualInverted(scalar) {
    return new Vector2(this.x / vector.x, this.y / vector.y);
  }

  floor() {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  round() {
    return new Vector2(Math.round(this.x), Math.round(this.y));
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
    return new Vector2(json.x, json.y);
  }

  static DIAG(value) {
    return new Vector2(value, value);
  }

  equal(vector) {
    return this.x == vector.x && this.y == vector.y;
  }

  min(vector) {
    return new Vector2(Math.min(this.x, vector.x), Math.min(this.y, vector.y));
  }

  max(vector) {
    return new Vector2(Math.max(this.x, vector.x), Math.max(this.y, vector.y));
  }

}

module.exports.Vector2 = Vector2;