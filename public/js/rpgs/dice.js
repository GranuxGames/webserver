class DiceCalc {

  constructor() {}

  calc() {}
  calcAverage() {}

  static parse(calc) {
    calc = calc.replaceAll(' ', '');
    calc = calc.replaceAll('D', 'd');
    if (!DiceCalc.checkBraces(calc))
      return null;
    try {
      return DiceCalc.parseCalc(calc);
    } catch (e) {
      return null;
    }
  }

  static checkBraces(calc) {
    var indent = 0;
    for (var i = 0; i < calc.length; i++) {
      if (calc[i] == '(')
        indent++;
      else if (calc[i] == ')')
        indent--;
      else if (indent < 0)
        return false;
    }
    return true;
  }

  static parseCalc(calc) {
    calc = DiceCalc.removeEnclosingBrackets(calc);
    for (var i = 0; i < DICE_CALCULATIONS.length; i++) {
      var parts = DiceCalc.getParts(calc, DICE_CALCULATIONS[i].SIGN);
      if (parts.length > 0)
        return new DICE_CALCULATIONS[i](parts[0], parts[1]);
    }
    return new ConstDiceCalc(calc);
  }

  static removeEnclosingBrackets(calc) {
    if (!calc.startsWith('(') || !calc.endsWith(')'))
      return calc;

    calc = calc.substring(1, calc.length - 1);
    if (!DiceCalc.checkBraces(calc))
      return '(' + calc + ')';
    return DiceCalc.removeEnclosingBrackets(calc);
  }

  static getParts(calc, sign) {
    var indent = 0;
    for (var i = 0; i < calc.length; i++) {
      if (calc[i] == '(')
        indent++;
      else if (calc[i] == ')')
        indent--;
      else if (indent == 0 && calc[i] == sign)
        return [calc.substring(0, i), calc.substring(i + 1)];
    }
    return [];
  }

}

class AddDiceCalc extends DiceCalc {

  static SIGN = '+';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() + this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() + this.b.calcAverage();
  }

}

class SubDiceCalc extends DiceCalc {

  static SIGN = '-';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() - this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() - this.b.calcAverage();
  }

}

class MulDiceCalc extends DiceCalc {

  static SIGN = '*';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() * this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() * this.b.calcAverage();
  }

}

class DivDiceCalc extends DiceCalc {

  static SIGN = '/';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() / this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() / this.b.calcAverage();
  }

}

class PowDiceCalc extends DiceCalc {

  static SIGN = '^';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return Math.pow(this.a.calc(), this.b.calc());
  }

  calcAverage() {
    return Math.pow(this.a.calcAverage(), this.b.calcAverage());
  }

}

class DieDiceCalc extends DiceCalc {

  static SIGN = 'd';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    var value = 0;
    var a = this.a.calc();
    var b = this.b.calc();
    for (var i = 0; i < a; i++) {
      value += Math.floor(Math.random(b) + 1);
    }
    return value;
  }

  calcAverage() {
    return this.a.calcAverage() * (this.b.calcAverage() + 1) / 2;
  }

}

class ConstDiceCalc extends DiceCalc {

  constructor(a) {
    super();

    this.a = Number.parseInt(a);
    if (isNaN(a))
      throw new Error('Number could not be converted.');
  }

  calc() {
    return this.a;
  }

  calcAverage() {
    return this.a;
  }

}

const DICE_CALCULATIONS = [
  AddDiceCalc,
  SubDiceCalc,
  MulDiceCalc,
  DivDiceCalc,
  PowDiceCalc,
  DieDiceCalc
];