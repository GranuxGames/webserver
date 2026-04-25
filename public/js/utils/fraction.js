function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);   
}

class Fraction {

  constructor(numerator, denominator = 1) {
    this.numerator = parseInt(numerator);
    this.denominator = parseInt(denominator);
  }

  reduce() {
    var g = gcd(this.numerator, this.denominator);
    var fraction = new Fraction(this.numerator / g, this.denominator / g);
    if (fraction.denominator < 0) {
      fraction.numerator *= -1;
      fraction.denominator *= -1;
    }
    return fraction;
  }

  mul(fraction) {
    return new Fraction(this.numerator * fraction.numerator, this.denominator * fraction.denominator).reduce();
  }

  div(fraction) {
    return this.mul(fraction.invert());
  }

  add(fraction) {
    return new Fraction(this.numerator * fraction.denominator + fraction.numerator * this.denominator, this.denominator * fraction.denominator).reduce();
  }

  sub(fraction) {
    return this.add(fraction.mul(new Fraction(-1)));
  }

  invert() {
    return new Fraction(this.denominator, this.numerator);
  }

  pow(power) {
    power = parseInt(power);
    
    var fraction = this.clone();
    if (power < 0) {
      power = -power;
      fraction = fraction.invert();
    }

    var result = new Fraction(1, 1);
    for (var i = 0; i < power; i++) {
      result = result.mul(fraction);
    }

    return result.reduce();
  }

  clone() {
    return new Fraction(this.numerator, this.denominator);
  }

  toNumber() {
    return this.numerator / this.denominator;
  }

  toString() {
    return '' + this.numerator + '/' + this.denominator;
  }

  eq(fraction) {
    return fraction.sub(this).numerator == 0;
  }

  lt(fraction) {
    return fraction.sub(this).numerator > 0;
  }

  gt(fraction) {
    return fraction.sub(this).numerator < 0;
  }

  leq(fraction) {
    return fraction.sub(this).numerator >= 0;
  }

  geq(fraction) {
    return fraction.sub(this).numerator <= 0;
  }

  max(fraction) {
    if (fraction.lt(this))
      return this.clone();
    return fraction.clone();
  }

  min(fraction) {
    if (fraction.lt(this))
      return fraction.clone();
    return this.clone();
  }

}