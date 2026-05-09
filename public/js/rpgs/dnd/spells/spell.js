const VERBAL_NAMES = {
  level: [
    'C',
    'S',
    'H',
    'L',
    'V',
    'T',
    'R',
    'M',
    'N',
    'Xy'
  ],
  school: [
    'A',
    'E',
    'I',
    'O',
    'U',
    'Ai',
    'Ou',
    'Ie'
  ],
  damage_types: {
    acid: 'Cid',
    bludgeoning: 'Deg',
    cold: 'Lod',
    fire: 'Ire',
    force: 'Ton',
    lightning: 'Nin',
    necrotic: 'Rho',
    piercing: 'Ix',
    poison: 'Nis',
    psychic: 'Char',
    radiant: 'Nat',
    slashing: 'Sih',
    thunder: 'Der'
  },
  aoe: {
    shape: {
      cone: 'N',
      cube: 'B',
      cylinder: 'X',
      line: 'L',
      sphere: 'S',
      misc: 'M'
    },
    size: {
      5: 'u',
      10: 'e',
      15: 'é',
      20: 'o',
      25: 'uo',
      30: 'or',
      35: 'eo',
      40: 'oe',
      45: 'ou',
      50: 'i',
      55: 'oi',
      60: 'a',
      65: 'ui',
      70: 'au',
      75: 'ié',
      80: 'iu',
      85: 'oa',
      90: 'eé',
      95: 'ir',
      100: 'ei',
      110: 'ur',
      120: 'ao',
      130: 'io',
      140: 'eu',
      150: 'ua',
      160: 'ro',
      170: 'aé',
      180: 'avo',
      190: 'uvi',
      200: 'ai',
      220: 'ia',
      240: 'eré',
      260: 'osa',
      280: 'ea',
      300: 'osi',
      350: 'evé',
      400: 'ar',
      500: 'ovia',
      600: 'tro',
      700: 'oté',
      800: 'er',
      900: 'aso',
      1000: 'isé',
      2000: 'ési',
      3000: 'oé',
      4000: 'asé',
      5000: 'ri',
      6000: 'ae',
      7000: 'ivao',
      8000: 'ise',
      9000: 'uvao',
      10000: 'ue',
      15000: 'tro',
      20000: 're',
      25000: 'ré',
      30000: 'ti',
      35000: 'te',
      40000: 'ie',
      45000: 'tu',
      50000: 'ra',
      60000: 'ta',
      70000: 'ué',
      80000: 'ru',
      90000: 'tra',
      100000: 'teé',
      Infinity: 'exeé'
    }
  },
  range: {
    misc: {
      self: 'Por',
      touch: 'Lix',
      sight: 'Tor',
      special: 'Intix',
      unlimited: 'Ash'
    },
    distance: {
      5: 'Wosin',
      10: 'Spul',
      30: 'Usin',
      60: 'Wyn',
      90: 'Ylar',
      100: 'Spon',
      120: 'Mul',
      150: 'Nosin',
      300: 'Sphin',
      500: 'Sin',
      5280: 'Yp',
      Infinity: 'Qul'
    }
  },
  duration: {
    misc: {
      instantaneous: '',
      special: 'Yi',
      until: 'Is'
    },
    concentration: {
      1: 'Es',
      10: 'Se',
      100: 'Ly',
      600: 'Si',
      1200: 'Ay',
      3600: 'So',
      4800: 'Os',
      14400: 'Yi',
      Infinity: 'Yeé'
    },
    duration: {
      1: 'I',
      10: 'E',
      100: 'S',
      600: 'A',
      3600: 'Ao',
      4800: 'Iy',
      14400: 'L',
      100800: 'Ei',
      144000: 'Y',
      432000: 'Ai',
      Infinity: 'Yie'
    }
  }
};



// const SYMBOL = {
//   aoe: {
//     shape: [
//       'cone',
//       'cube',
//       'cylinder',
//       'line',
//       'sphere'
//     ],
//     size: [
//          0,    5,   10,    15,    20,    30,    40,       50,
//         60,   70,   80,    90,   100,   120,   140,      160,
//        180,  200,  300,   400,   500,  1000,  1500,     2000,
//       3000, 4000, 5000, 10000, 15000, 20000, 50000, Infinity
//     ]
//   },
//   range: {
//     special: [
//       'touch',
//       'sight',
//       'special',
//       'unlimited'
//     ],
//     values: [
//           0,     5,    10,       15,   20,   30,   40,    50,
//          60,    70,    80,       90,  100,  150,  200,   300,
//         400,   500,  1000,     2000, 3000, 4000, 5000, 10000,
//       15000, 20000, 50000, Infinity
//     ]
//   },
//   duration: {
//     special: [
//       'special'
//     ],
//     values: [
//           0,     1,     10,    100,    600,   1200,     3600, 4800,
//       14400, 36000, 100800, 144000, 230400, 432000, Infinity
//     ]
//   },
//   effect: [
//     'banishment',
//     'buff',
//     'charmed',
//     'cleanse',
//     'communication',
//     'control',
//     'creation',
//     'damage',
//     'debuff',
//     'deception',
//     'detection',
//     'foreknowledge',
//     'healing',
//     'movement',
//     'negation',
//     'shapechanging',
//     'social',
//     'summoning',
//     'teleportation',
//     'utility',
//     'warding'
//   ]
// }

const SYMBOL = {
  effect: [
    'banishment',
    'buff',
    'charmed',
    'cleanse',
    'communication',
    'control',
    'creation',
    'damage',
    'debuff',
    'deception',
    'detection',
    'foreknowledge',
    'healing',
    'movement',
    'negation',
    'shapechanging',
    'social',
    'summoning',
    'teleportation',
    'utility',
    'warding'
  ],
  range: {
    special: [
      'touch',
      'sight',
      'special',
      'unlimited'
    ],
    values: [
          0,     5,    10,       15,   20,   25,    30,    35,
         40,    45,    50,       55,   60,   70,    80,    90,
        100,   110,   120,      130,  140,  150,   160,   170,
        180,   190,   200,      225,  250,  275,   300,   325,
        350,   375,   400,      425,  450,  475,   500,   550,
        600,   650,   700,      750,  800,  850,   900,   950,
       1000,  1320,  2640,     3960, 5280, 7920, 10560, 15840,
      21120, 26400, 52800, Infinity
    ]
  },
  duration: {
    special: [
      'special'
    ],
    values: [
          0,      1,      5,     10,     50,    100,      150,   300,
        600,    900,   1200,   1800,   2400,   3600,     4800,  6000,
       7200,   8400,   9600,  12000,  14400,  28800,    43200, 57600,
      72000, 100800, 144000, 201600, 288000, 432000, Infinity
    ]
  },
  aoe: {
    shape: [
      'cone',
      'cube',
      'cylinder',
      'line',
      'sphere'
    ],
    size: [
        5,  10,  15,  20,   30,   40,   50,       60,
      100, 150, 200, 500, 1000, 2640, 5280, Infinity
    ]
  }
}



class DNDSpell {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell');
    this.html.classList.add('dnd-object');
    if (isMobile())
      this.html.classList.add('mobile');

    this.image = new DNDSpellImage();
    this.html.appendChild(this.image.getHTML());

    this.header = new DNDSpellHeader();
    this.html.appendChild(this.header.getHTML());

    this.stats = new DNDSpellStats();
    this.html.appendChild(this.stats.getHTML());

    this.body = new DNDSpellBody();
    this.html.appendChild(this.body.getHTML());
  }

  getHTML() {
    return this.html;
  }

  static generateSpellName(json) {
    var name = '';
    name += VERBAL_NAMES.level[json.level];
    name += VERBAL_NAMES.school[json.school_id - 1].toLowerCase();
    if (json.area.length > 0 || json.damage.length > 0) {
      if (json.damage.length <= 0) {
        name += '\'';
      } else {
        name += json.damage.map((dmg) => {
          return VERBAL_NAMES.damage_types[dmg.toLowerCase()].toLowerCase();
        }).join('');
      }

      name += '-';

      if (json.area.length <= 0) {
        name += '\'';
      } else {
        name += VERBAL_NAMES.aoe.shape[json.area.split(' ').at(-1).toLowerCase()];
        
        var size = json.area.split(' ')[0].split('-').slice(0, 2).join(' ');
        size = convertRPGLength(size);
        for (var v of Object.keys(VERBAL_NAMES.aoe.size)) {
          if (size <= v) {
            name += VERBAL_NAMES.aoe.size[v].toLowerCase();
            break;
          }
        }
      }
    }
    if (Object.keys(VERBAL_NAMES.range.misc).includes(json.range.toLowerCase())) {
      name += VERBAL_NAMES.range.misc[json.range.toLowerCase()].toLowerCase();
    } else {
      var range = json.range;
      range = convertRPGLength(range);
      for (var v of Object.keys(VERBAL_NAMES.range.distance)) {
        if (range <= v) {
          name += VERBAL_NAMES.range.distance[v].toLowerCase();
          break;
        }
      }
    }
    if (Object.keys(VERBAL_NAMES.duration.misc).includes(json.duration.toLowerCase())) {
      name += VERBAL_NAMES.duration.misc[json.duration.toLowerCase()].toLowerCase();
    } else {
      var duration = json.duration;
      duration = convertRPGTime(duration);
      var source = VERBAL_NAMES.duration.duration;
      if (json.concentration)
        source = VERBAL_NAMES.duration.concentration;
      for (var v of Object.keys(source)) {
        if (duration <= v) {
          name += source[v].toLowerCase();
          break;
        }
      }
    }

    return name;
  }

  static fromJSON(json) {
    json.word = DNDSpell.generateSpellName(json);

    var spell = new DNDSpell();
    spell.loadJSON(json);
    return spell;
  }

  loadJSON(json) {
    this.image.loadJSON(json);
    this.header.loadJSON(json);
    this.stats.loadJSON(json);
    this.body.loadJSON(json);
  }

}

class DNDSpellImage {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-image-container');
    
    this.hideSettings = document.createElement('div');
    this.hideSettings.classList.add('dnd-spell-image-setting-hider');
    this.hideSettings.classList.add('dnd-spell-image-setting-hider-hidden');
    this.html.appendChild(this.hideSettings);
    this.hideSettings.addEventListener('click', (e) => {
      this.hideSettings.classList.toggle('dnd-spell-image-setting-hider-hidden');

      this.hideSettings.classList.contains('dnd-spell-image-setting-hider-hidden');
    })

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('dnd-spell-image');
    this.html.appendChild(this.canvas);

    this.settings = document.createElement('div');
    this.settings.classList.add('dnd-spell-image-settings');
    this.html.appendChild(this.settings);

    this.pointCount = 13;
    this.pointInput = this.createNumberSetting('Point Count', 13, true, 25, false, 1, this.pointCount, false, (value) => {
      value = Number.parseInt(value);
      this.pointCount = value;
      if (this.shape == 'Freestyle') {
        this.selectShape('Spiral');
      }
      this.repaint();
    });

    this.curvature = 0.5;
    this.curvatureInput = this.createNumberSetting('Curvature', 0, true, 1, true, 0.01, this.curvature, true, (value) => {
      value = Number.parseFloat(value);
      this.curvature = value;
      this.repaint();
    });

    this.offset = 0;
    this.offsetChange = 0;
    this.offsetInput = this.createNumberSetting('Offset', 0, true, 20, false, 1, 0, false, (value) => {
      value = Number.parseInt(value);
      this.offsetChange = value - this.offset;
      this.offset = value;
      this.repaint();
    });

    this.angle = 0;
    this.angleChange = 0;
    this.angleInput = this.createNumberSetting('Angle', -180, false, 180, false, 0.25, 0, true, (value) => {
      value = Number.parseFloat(value) / 180 * Math.PI;
      this.angleChange = value - this.angle;
      this.angle = value;
      this.repaint();
    });

    this.flipped = false;
    this.flippedChange = false;
    this.flippedInput = this.createBoolSetting('Flipped', false, (value) => {
      this.flipped = value;
      this.flippedChange = true;
      this.repaint();
    });

    this.shape = 'Spiral'
    this.shapeSelector = document.createElement('select');
    this.settings.appendChild(this.shapeSelector);
    [this.shape, 'Line', 'Freestyle'].forEach((option) => {
      var shape = document.createElement('option');
      shape.value = option;
      shape.appendChild(document.createTextNode(option));
      this.shapeSelector.appendChild(shape);
    });
    this.shapeSelector.addEventListener('change', () => {
      this.selectShape(this.shapeSelector.value);
    });

    this.arc = 360;
    this.arcInput = this.createNumberSetting('Arc', 0, true, 360, false, 0.25, this.arc, true, (value) => {
      value = Number.parseFloat(value) / 180 * Math.PI;
      this.arc = value;
      this.repaint();
    });
    this.arc = 2 * Math.PI;

    this.spiral = 0;
    this.spiralInput = this.createNumberSetting('Spiral', -2, false, 1, true, 0.01, this.spiral, true, (value) => {
      value = Number.parseFloat(value);
      this.spiral = value;
      this.repaint();
    });

    this.fillArc = false;
    this.fillArcInput = this.createBoolSetting('Fill Arc', false, (value) => {
      this.fillArc = value;
      this.repaint();
    });

    this.separation = 0.5;
    this.outwardness = 1;

    this.lines = [];
    this.points = [];
    this.lineModes = {};
    this.hovering = false;

    this.pointRadius = 25;
    this.lineInteractionRadius = 50;

    this.draggingIndex = -1;
    this.canvas.addEventListener('mousedown', (e) => {
      var rect = this.canvas.getBoundingClientRect();
      var mouse = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      mouse = mouse.scaleIndividualInverted(new Vector(this.canvas.clientWidth, this.canvas.clientHeight)).scale(this.dimensions);

      for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].sub(mouse).length() <= this.pointRadius) {
          this.draggingIndex = i;
          break;
        }
      }
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.draggingIndex == -1)
        return;
      
      var movement = new Vector(e.movementX, e.movementY);
      movement = movement.scaleIndividualInverted(new Vector(this.canvas.clientWidth, this.canvas.clientHeight)).scale(this.dimensions);
      if (this.shape != 'Freestyle')
        this.selectShape('Freestyle');
      this.points[this.draggingIndex] = this.points[this.draggingIndex].add(movement);
      this.repaint();
    });
    this.canvas.addEventListener('mouseup', (e) => {
      if (this.draggingIndex != -1) {
        this.draggingIndex = -1;
        return;
      }

      var rect = this.canvas.getBoundingClientRect();
      var mouse = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      mouse = mouse.scaleIndividualInverted(new Vector(this.canvas.clientWidth, this.canvas.clientHeight)).scale(this.dimensions);

      var lineCenters = this.lines.map((line) => {
        return line[0].scale(0.125).add(line[1].scale(0.375)).add(line[2].scale(0.375)).add(line[3].scale(0.125));
      });

      for (var i = 0; i < lineCenters.length; i++) {
        if (mouse.sub(lineCenters[i]).length() <= this.lineInteractionRadius) {
          if (Object.keys(this.lineModes).includes('' + i)) {
            if (this.lineModes[i] == 1) {
              this.lineModes[i] = 2;
            } else {
              delete this.lineModes[i];
            }
          } else {
            this.lineModes[i] = 1;
          }
          break;
        }
      }

      this.repaint();
    });

    this.symbol = [];

    this.dimensions = 1000;
    this.canvas.width = this.dimensions;
    this.canvas.height = this.dimensions;
  }

  selectShape(value) {
    this.shape = value;
    if (this.shape == 'Spiral') {
      this.settings.appendChild(this.arcInput);
      this.settings.appendChild(this.spiralInput);
      this.settings.appendChild(this.fillArcInput);
    } else {
      if (this.arcInput.parentElement == this.settings) {
        this.settings.removeChild(this.arcInput);
        this.settings.removeChild(this.spiralInput);
        this.settings.removeChild(this.fillArcInput);
      }
    }
    this.shapeSelector.value = value;
    this.repaint();
  }

  createBoolSetting(name, value, changeCallback) {
    var container = document.createElement('div');
    container.classList.add('dnd-spell-image-setting');
    container.classList.add('dnd-spell-image-setting-bool');
    this.settings.appendChild(container);

    var label = document.createElement('span');
    label.appendChild(document.createTextNode(name));
    container.appendChild(label);

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = value;
    container.appendChild(input);
    input.addEventListener('change', (e) => {
      changeCallback(input.checked);
    });

    return container;
  }

  createNumberSetting(name, min, forceMin, max, forceMax, step, value, float, changeCallback) {
    var container = document.createElement('div');
    container.classList.add('dnd-spell-image-setting');
    container.classList.add('dnd-spell-image-setting-number');
    this.settings.appendChild(container);

    var label = document.createElement('span');
    label.appendChild(document.createTextNode(name));
    container.appendChild(label);

    var input = document.createElement('input');
    input.type = 'number';
    input.value = value;
    container.appendChild(input);
    input.addEventListener('keydown', (e) => {
      if ((e.key == '.' && !float) || e.key == 'e')
        e.preventDefault();
    });
    input.addEventListener('change', (e) => {
      var value = input.value;
      if (value.length <= 0)
        value = 0;
      else if (!float)
        value = Number.parseInt(value);
      else
        value = Number.parseFloat(value);
      if (value <= min && forceMin)
        value = min;
      if (value >= max && forceMax)
        value = max;
      input.value = value;
      slider.value = input.value;

      changeCallback(input.value);
    });

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    container.appendChild(slider);
    slider.addEventListener('input', (e) => {
      input.value = slider.value;
      
      changeCallback(input.value);
    });

    return container;
  }

  generateSpellCircle(json) {
    var symbol = [];
    
    symbol.push([[(Number.parseInt(json.level)) * 2 + 1, 5]]);
    
    symbol.push([[(Number.parseInt(json.school_id) - 1) * 2 + 1, 4]])

    var effect = json.effect;
    if (json.effect.length <= 0)
      effect = 'Damage';
    effect = effect.toLowerCase();
    symbol.push([[SYMBOL.effect.indexOf(effect) * 2 + 1, 6]]);

    var range = json.range;
    if (SYMBOL.range.special.includes(range)) {
      range = SYMBOL.range.special.indexOf(range);
    } else {
      range = convertRPGLength(range);
      for (var i = 0; i < SYMBOL.range.values.length; i++) {
        if (range <= SYMBOL.range.values[i]) {
          range = i + SYMBOL.range.special.length;
          break;
        }
      }
    }
    symbol.push([[range * 2 + 1, 7]]);

    var duration = json.duration;
    if (SYMBOL.duration.special.includes(duration)) {
      duration = SYMBOL.duration.special.indexOf(duration);
    } else {
      duration = convertRPGTime(duration);
      for (var i = 0; i < SYMBOL.duration.values.length; i++) {
        if (duration <= SYMBOL.duration.values[i]) {
          duration = i + SYMBOL.duration.special.length;
          break;
        }
      }
    }
    duration *= 2;
    if (json.concentration)
      duration += 1;
    symbol.push([[duration * 2 + 1, 7]]);

    var aoe = 0;
    var size = 0;
    if (json.area.length > 0) {
      aoe = SYMBOL.aoe.shape.indexOf(json.area.split(' ').at(-1).toLowerCase()) + 1;
      size = json.area.split(' ')[0].split('-').slice(0, 2).join(' ');
      size = convertRPGLength(size);
      for (var i = 0; i < SYMBOL.aoe.size.length; i++) {
        if (size <= SYMBOL.aoe.size[i]) {
          size = i;
          break;
        }
      }
    }
    symbol.push([[aoe * 2 + 1, 4], [size, 4]]);

    symbol = symbol.map((k) => {
      return k.map((part) => {
        return part[0].toString(2).padStart(part[1], '0').split('').reverse().join('');
      });
    });
    console.log(symbol);
    return symbol;
    // var symbol = [[lvl.toString(2).padStart(4, '0').split('').reverse().join(''),
    //                duration.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [school.toString(2).padStart(3, '0').split('').reverse().join(''),
    //                effect.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [aoe.toString(2).padStart(3, '0').split('').reverse().join(''),
    //                size.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [range.toString(2).padStart(5, '0').split('').reverse().join('')]];




    
  // aoe: {
  //   shape: [
  //     'cone',
  //     'cube',
  //     'cylinder',
  //     'line',
  //     'sphere'
  //   ],
  //   size: [
  //       5,  10,  15,  20,   30,   40,   50,       60,
  //     100, 150, 200, 500, 1000, 2640, 5280, Infinity
  //   ]
  // }





    // var lvl = json.level + 1;
    // var duration = json.duration;
    // if (SYMBOL.duration.special.includes(duration)) {
    //   duration = SYMBOL.duration.special.indexOf(duration);
    // } else {
    //   duration = convertRPGTime(duration);
    //   for (var i = 0; i < SYMBOL.duration.values.length; i++) {
    //     if (duration <= SYMBOL.duration.values[i]) {
    //       duration = i + SYMBOL.duration.special.length;
    //       break;
    //     }
    //   }
    // }
    // duration *= 2;
    // if (json.concentration)
    //   duration += 1;
    // var school = json.school_id - 1;
    // var effect = json.effect;
    // if (effect.length <= 0)
    //   effect = 'Damage';
    // effect = effect.toLowerCase();
    // effect = SYMBOL.effect.indexOf(effect) + 1;
    // var aoe = 0;
    // var size = 0;
    // if (json.area.length > 0) {
    //   aoe = SYMBOL.aoe.shape.indexOf(json.area.split(' ').at(-1).toLowerCase()) + 1;
    //   size = json.area.split(' ')[0].split('-').slice(0, 2).join(' ');
    //   size = convertRPGLength(size);
    //   for (var i = 0; i < SYMBOL.aoe.size.length; i++) {
    //     if (size <= SYMBOL.aoe.size[i]) {
    //       size = i;
    //       break;
    //     }
    //   }
    // }
    // var range = json.range;
    // if (SYMBOL.range.special.includes(range)) {
    //   range = SYMBOL.range.special.indexOf(range);
    // } else {
    //   range = convertRPGLength(range);
    //   for (var i = 0; i < SYMBOL.range.values.length; i++) {
    //     if (range <= SYMBOL.range.values[i]) {
    //       range = i + SYMBOL.range.special.length;
    //       break;
    //     }
    //   }
    // }

    // var symbol = [[lvl.toString(2).padStart(4, '0').split('').reverse().join(''),
    //                duration.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [school.toString(2).padStart(3, '0').split('').reverse().join(''),
    //                effect.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [aoe.toString(2).padStart(3, '0').split('').reverse().join(''),
    //                size.toString(2).padStart(5, '0').split('').reverse().join('')],
    //               [range.toString(2).padStart(5, '0').split('').reverse().join('')]];

    return symbol;
  }

  paintPoint(ctx, point, radius, start = false) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (start) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 0.65, 0, 2 * Math.PI);
      ctx.clip();
      ctx.clearRect(0, 0, this.dimensions, this.dimensions);
      ctx.restore();
    }
  }

  paintPoints(ctx, points, radius) {
    points.forEach((point, index) => {
      this.paintPoint(ctx, point, radius, index == 0);
    })
  }

  paintLine(ctx, index, start, end, radius, curvature = 1, curvatureSeparation = 0, outwardness = 1) {
    var center = new Vector(this.dimensions / 2, this.dimensions / 2);
    var curveDirection = (end.x - start.x) * (center.y - start.y) - (end.y - start.y) * (center.x - start.x);
    var cp = end.sub(start).normalize();
    
    var cp1 = end.sub(start).scale(0.5).add(start);
    var cp2 = cp1.clone();
    
    if (this.lineModes['' + index] != 1) {
      var angle = Math.PI / 2;
      if (curveDirection < 0)
        angle = -angle;
      if (this.lineModes['' + index] == 2)
        angle = -angle;
      cp = cp.rotate(angle);

      var curveScale = end.sub(start).length() / (this.dimensions / 2 - radius * 2);
      cp = cp.scale(this.dimensions / 2 - radius / 2).scale(curveScale).scale(curvature);
      cp = cp.scale(outwardness);
      cp = end.sub(start).scale(0.5).add(start).add(cp);
      
      cp1 = cp.sub(start).scale(1 / outwardness).scale(1 - curvatureSeparation).add(start);
      cp2 = cp.sub(end).scale(1 / outwardness).scale(1 - curvatureSeparation).add(end);
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();

    return [start, cp1, cp2, end];
  }

  paintLines(ctx, points, radius, curvature, curvatureSeparation, outwardness) {
    var lines = [];

    var index = 0;
    this.symbol.forEach((circle, circleIndex) => {
      var pointIndex = points.length - circleIndex;
      circle.forEach((segment, segmentIndex) => {
        [...segment].forEach((bool, lineIndex) => {
          if (bool == 0)
            return;

          var start = points[(pointIndex + lineIndex) % points.length];
          var end = points[(pointIndex + lineIndex + circleIndex + 1) % points.length];

          lines.push(this.paintLine(ctx, index, start, end, radius, curvature, curvatureSeparation, outwardness));
          index++;
        });

        pointIndex += segment.length;
      });
    });

    this.lines = lines;
  }

  repositionPointLocations(points, radius) {
    var min = points[0];
    var max = points[0];
    points.forEach((point) => {
      min = min.min(point);
      max = max.max(point);
    });
    var scale = Math.max(max.x - min.x, max.y - min.y);
    var size = this.dimensions - 2 * radius;
    var offset = new Vector(this.dimensions, this.dimensions).sub(max.sub(min).scale(size / scale)).scale(0.5);
    return points.map((point) => {
      return point.sub(min).scale(size / scale).add(offset);
    });
  }

  getCirclePointLocations(count, pointRadius, flipped = false) {
    return this.getSpiralPointLocations(count, pointRadius, 2 * Math.PI, 0, false, flipped);
  }

  getSpiralPointLocations(count, pointRadius, arc, spiralStrength = 0, fillArc = false, flipped = false) {
    var points = [];
    for (var i = 0; i < count; i++) {
      var point = new Vector(0, - this.dimensions / 2 + pointRadius);
      point = point.rotate((flipped?1:-1) * arc / (count - (fillArc?1:0)) * i);
      point = point.scale(i / (count - 1) * (1 - spiralStrength - 1) + 1);
      point = point.add(new Vector(this.dimensions / 2, this.dimensions / 2));
      points.push(point);
    }
    return this.repositionPointLocations(points, pointRadius);
  }

  getLinePointLocations(count, pointRadius, flipped = false) {
    var points = [];
    for (var i = 0; i < count; i++) {
      var point = new Vector((this.dimensions - pointRadius * 2) / (count - 1) * i + pointRadius, this.dimensions / 2 + 0.01);
      points.push(point);
    }
    if (flipped)
      points = points.toReversed();
    return points;
  }

  offsetPoints(points, offset) {
    while (offset < 0)
      offset += points.length;
    offset %= points.length;
    var start = points.splice(offset);
    points = start.concat(points);
    return points;
  }

  rotatePoints(points, angle) {
    var center = new Vector(this.dimensions / 2, this.dimensions / 2);
    return points.map((point) => {
      return point.sub(center).rotate(angle).add(center);
    });
  }

  repaint() {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.dimensions, this.dimensions);

    var points = this.points;
    if (this.shape == 'Spiral')
      points = this.getSpiralPointLocations(this.pointCount, this.pointRadius, this.arc, this.spiral, this.fillArc, this.flipped);
    else if (this.shape == 'Line')
      points = this.getLinePointLocations(this.pointCount, this.pointRadius, this.flipped);

    if (this.shape == 'Freestyle')
      points = this.offsetPoints(points, this.offsetChange);
    else
      points = this.offsetPoints(points, this.offset);
    this.offsetChange = 0;

    if (this.shape == 'Freestyle')
      points = this.rotatePoints(points, this.angleChange);
    else
      points = this.rotatePoints(points, this.angle);
    this.angleChange = 0;

    if (this.shape == 'Freestyle' && this.flippedChange) {
      points = points.map((point) => {
        point = point.sub(new Vector(this.dimensions / 2, this.dimensions / 2));
        point.x = -point.x;
        return point.add(new Vector(this.dimensions / 2, this.dimensions / 2));
      });
    }
    this.flippedChange = false;

    this.points = points;

    ctx.lineWidth = this.pointRadius / 3;
    this.paintLines(ctx, points, this.pointRadius, this.curvature, this.separation, this.outwardness);
    this.paintPoints(ctx, points, this.pointRadius);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.symbol = this.generateSpellCircle(json);
    this.repaint();
  }

}

class DNDSpellHeader {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-header');

    this.header = document.createElement('div');
    this.header.classList.add('dnd-spell-name');
    this.html.appendChild(this.header);

    this.level = document.createElement('div');
    this.level.classList.add('dnd-spell-level');
    this.html.appendChild(this.level);
  }

  getHTML() {
    return this.html;
  }

  getNumberSuffix(number) {
    if (number % 10 == 1)
      return 'st';
    if (number % 10 == 2)
      return 'nd';
    if (number % 10 == 3)
      return 'rd';
    return 'th';
  }

  loadJSON(json) {
    this.header.innerHTML = '';
    this.header.appendChild(document.createTextNode(json.name + ' (' + json.word + ')'));

    this.level.innerHTML = '';
    var levelText = json.school;
    if (json.level <= 0)
      levelText += ' cantrip';
    else
      levelText = json.level + this.getNumberSuffix(json.level) +'-level ' + levelText + ' Spell';
    if (json.ritual)
      levelText += ' (ritual)';
    this.level.appendChild(document.createTextNode(levelText));
  }

}

class DNDSpellStats {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-stats');

    var statLine = document.createElement('div');
    statLine.classList.add('dnd-spell-stat');

    var statLineHeader = document.createElement('a');
    statLineHeader.classList.add('dnd-spell-stat-header');
    statLine.appendChild(statLineHeader);

    var statLineValue = document.createElement('a');
    statLineValue.classList.add('dnd-spell-stat-value');
    statLine.appendChild(statLineValue);

    this.castingTime = statLine.cloneNode(true);
    this.castingTime.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Casting Time: '));
    this.html.appendChild(this.castingTime);

    this.range = statLine.cloneNode(true);
    this.range.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Range: '));
    this.html.appendChild(this.range);

    this.components = statLine.cloneNode(true);
    this.components.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Components: '));
    this.html.appendChild(this.components);

    this.duration = statLine.cloneNode(true);
    this.duration.querySelector('.dnd-spell-stat-header').appendChild(document.createTextNode('Duration: '));
    this.html.appendChild(this.duration);
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    this.castingTime.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.castingTime.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(json.casting_time.type + json.casting_time.info));

    var rangeValue = json.range;
    if (json.area.length > 0)
      rangeValue += ' (' + json.area + ')';
    this.range.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.range.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(rangeValue));

    var componentsValue = json.components.map((component) => {
      if (component.type == 'verbal')
        return 'V';
      if (component.type == 'somatic')
        return 'S';
      if (component.type == 'material')
        return 'M (' + component.values.join(', ') + ')';
      return '';
    }).join(', ');
    this.components.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.components.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(componentsValue));

    var durationValue = json.duration;
    if (json.concentration)
      durationValue = 'Concentration, up to ' + durationValue.toLowerCase();
    this.duration.querySelector('.dnd-spell-stat-value').innerHTML = '';
    this.duration.querySelector('.dnd-spell-stat-value').appendChild(document.createTextNode(durationValue));
  }

}

class DNDSpellBody {

  constructor() {
    this.html = document.createElement('div');
    this.html.classList.add('dnd-spell-body');

    this.description = new JSONText();
    this.description.getHTML().classList.add('dnd-spell-description');
    this.html.appendChild(this.description.getHTML());

    this.higher = new JSONText();
    this.higher.getHTML().classList.add('dnd-spell-higher');
    this.html.appendChild(this.higher.getHTML());

    this.notes = new JSONText();
    this.notes.getHTML().classList.add('dnd-spell-notes');
    this.html.appendChild(this.notes.getHTML());
  }

  getHTML() {
    return this.html;
  }

  loadJSON(json) {
    if (json.description.length <= 0 && this.description.getHTML().parentElement != null)
      this.description.getHTML().parentElement.removeChild(this.description.getHTML());
    else
      this.description.loadJSON(json.description);

    if (json.higher.length <= 0 && this.higher.getHTML().parentElement != null) {
      this.higher.getHTML().parentElement.removeChild(this.higher.getHTML());
    } else {
      var higherValue = json.higher;
      if (typeof higherValue[0] == 'string')
        higherValue[0] = '*_At Higher Levels. _*' + higherValue[0];
      else
        higherValue.unshift('*_At Higher Levels. _*');
      this.higher.loadJSON(json.higher);
    }
    
    if (json.notes.length <= 0 && this.notes.getHTML().parentElement != null)
      this.notes.getHTML().parentElement.removeChild(this.notes.getHTML());
    else
      this.notes.loadJSON(json.notes);
  }

}