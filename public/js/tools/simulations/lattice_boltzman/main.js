var PHYSICS_SPEED = 100; // the speed at which the physics engine should update (and render)
var PHYSICS_TICKS = 5;
const PALETTE_SIZE = 256;

var lbm;

var renderModeInput

class ColorGradient {

  constructor(container, number, range, colorInput, removeButton) {
    this.canvas = container.querySelector('canvas');
    this.numberInput = new NumberInput(number, range, 0.5, 0, 1, 0.01, 0, 1, (value) => {
      if (this.activePoint == -1)
        return;

      this.points[this.activePoint].style.setProperty('--pos', clamp(value, 0, 1));
      this.onChange();
    }, true);
    this.colorInput = colorInput;
    this.colorInput.addEventListener('input', (e) => {
      if (this.activePoint == -1)
        return;

      this.points[this.activePoint].style.setProperty('--color', this.colorInput.value);
      this.onChange();
    });
    this.removeButton = removeButton;
    this.removeButton.addEventListener('click', (e) => {
      if (this.activePoint == -1)
        return;

      this.points[this.activePoint].parentElement.removeChild(this.points[this.activePoint]);
      this.points.splice(this.activePoint, 1);
      this.activePoint = -1;
      this.onChange();
    });

    this.activePoint = -1;
    this.points = [];
    this.palette = generatePalette([], PALETTE_SIZE);
    this.canvas.width = PALETTE_SIZE;
    this.canvas.height = 1;
    this.ctx = this.canvas.getContext('2d');

    this.container = container;
    this.canvas.addEventListener('click', (e) => {
      var pos = e.clientX;
      var bounds = this.canvas.getBoundingClientRect();
      
      pos = (pos - bounds.left - (bounds.bottom - bounds.top) / 2) / (bounds.right - bounds.left - (bounds.bottom - bounds.top));
      
      this.addPoint(pos, { r: 255, g: 0, b: 0 });
    });

    this.addPoint(0, { r: 98, g: 255, b: 255 });
    this.addPoint(0.5, { r: 253, g: 254, b: 255 });
    this.addPoint(1, { r: 255, g: 140, b: 217 });

    this.onChange();
  }
  
  addPoint(pos, color) {
    // add new point
    var point = document.createElement('div');
    point.classList.add('gradient-point');
    point.appendChild(document.createElement('div'));
    this.container.appendChild(point);

    point.style.setProperty('--pos', clamp(pos, 0, 1));
    point.style.setProperty('--color', this.rgbToHex(color.r, color.g, color.b));
    this.points.push(point);
    this.setActivePoint(point);

    var moving = false;
    point.addEventListener('mousedown', (e) => {
      moving = true;
      e.preventDefault();
      point.style.zIndex = 1;
      this.setActivePoint(point);
    });
    document.addEventListener('mousemove', (e) => {
      if (!moving)
        return;
      
      var pos = e.clientX;
      var bounds = this.canvas.getBoundingClientRect();
      pos = (pos - bounds.left - (bounds.bottom - bounds.top) / 2) / (bounds.right - bounds.left - (bounds.bottom - bounds.top));
      point.style.setProperty('--pos', clamp(pos, 0, 1));
      this.numberInput.numberInput.value = clamp(pos, 0, 1);
      this.numberInput.rangeInput.value = clamp(pos, 0, 1);

      this.onChange();
    });
    document.addEventListener('mouseup', () => {
      moving = false;
      point.style.zIndex = 0;
    });

    return point;
  }

  onChange() {
    this.palette = generatePalette(this.points.map((point) => {
      var rgb = this.hexToRGB(point.style.getPropertyValue('--color'));
      var hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
      return {
        h: hsv[0],
        s: hsv[1],
        v: hsv[2],
        value: Number.parseFloat(point.style.getPropertyValue('--pos'))
      };
    }), 256);
    for (var i = 0; i < PALETTE_SIZE; i++) {
      this.ctx.fillStyle = 'rgb(' + this.palette[i * 4 + 0] + ' ' + this.palette[i * 4 + 1] + ' ' + this.palette[i * 4 + 2] + ')';
      this.ctx.fillRect(i, 0, 1, 1);
    }
    lbm.palette = this.palette;
  }

  setActivePoint(point) {
    this.activePoint = this.points.indexOf(point);
    this.numberInput.numberInput.value = point.style.getPropertyValue('--pos');
    this.numberInput.rangeInput.value = point.style.getPropertyValue('--pos');
    this.colorInput.value = point.style.getPropertyValue('--color');

    this.onChange();
  }

  rgbToHex(r, g, b) {
    r = r.toString(16);
    r = r.length == 1? '0'+r:r;
    g = g.toString(16);
    g = g.length == 1? '0'+g:g;
    b = b.toString(16);
    b = b.length == 1? '0'+b:b;
    return '#' + r + g + b;
  }

  hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHsv(r, g, b) {
    // Normalize RGB values to [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Value is the maximum component
    const v = max;

    // Saturation is 0 for achromatic colors, otherwise delta / max
    const s = max === 0 ? 0 : delta / max;

    // Hue calculation
    let h = 0;
    if (delta !== 0) {
      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h /= 6;
    }

    // Return H in [0, 1], S in [0, 1], V in [0, 1]
    return [h, s, v];
  }

}

class NumberInput {

  constructor(numberInput, rangeInput, value, softMin, softMax, step, min, max, changeCallback, float = false) {
    this.numberInput = numberInput;
    this.rangeInput = rangeInput;

    this.min = min;
    this.max = max;
    this.float = float;
    this.changeCallback = changeCallback;
    this.value = value;

    this.numberInput.value = value;
    this.numberInput.addEventListener('keydown', (e) => {
      if ((e.key == '.' && !this.float) || e.key == 'e')
        e.preventDefault();
    });
    this.numberInput.addEventListener('change', (e) => {
      var value = this.numberInput.value;
      if (value.length <= 0)
        value = 0;
      else if (!float)
        value = Number.parseInt(value);
      else
        value = Number.parseFloat(value);
      if (min != null && value <= min)
        value = min;
      if (max != null && value >= max)
        value = max;
      this.numberInput.value = value;
      this.rangeInput.value = value;

      this.value = value;
      this.changeCallback(value);
    });

    this.rangeInput.value = value;
    this.rangeInput.min = softMin;
    this.rangeInput.max = softMax;
    this.rangeInput.step = step;
    this.rangeInput.addEventListener('input', (e) => {
      var value = this.rangeInput.value;
      if (value.length <= 0)
        value = 0;
      else if (!float)
        value = Number.parseInt(value);
      else
        value = Number.parseFloat(value);
      if (min != null && value <= min)
        value = min;
      if (max != null && value >= max)
        value = max;
      this.numberInput.value = value;
      this.rangeInput.value = value;

      this.value = value;
      this.changeCallback(value);
    });
  }

}

function tick() {
  var start = Date.now();
  for (var i = 0; i < PHYSICS_TICKS; i++) {
    lbm.step();
  }
  lbm.render(Number.parseInt(renderModeInput.value));

  setTimeout(tick, 1000 / PHYSICS_SPEED - (Date.now() - start));
}

window.addEventListener('load', async () => {
  var expandButton = document.getElementById('expand-button');
  expandButton.addEventListener('click', (e) => {
    expandButton.classList.toggle('collapsed');
  });
  renderModeInput = document.querySelector('#render-mode');
  lbm = new LBM();
  tick();
  
  var nxInput = new NumberInput(document.querySelector('#nx input[type="number"]'),
                                document.querySelector('#nx input[type="range"]'),
                                400, 50, 1000, 1, 10, null, (value) => {});
  var nyInput = new NumberInput(document.querySelector('#ny input[type="number"]'),
                                document.querySelector('#ny input[type="range"]'),
                                100, 50, 1000, 1, 10, null, (value) => {});
  var rho0Input = new NumberInput(document.querySelector('#rho0 input[type="number"]'),
                                  document.querySelector('#rho0 input[type="range"]'),
                                  1, 0.5, 2, 0.01, 0.5, 5, (value) => {
    lbm.rho0 = value;
  }, true);
  var tauInput = new NumberInput(document.querySelector('#tau input[type="number"]'),
                                 document.querySelector('#tau input[type="range"]'),
                                 0.57, 0.55, 0.9, 0.01, 0.55, 5, (value) => {
    lbm.tau = value;
  }, true);
  var vinInput = new NumberInput(document.querySelector('#vin input[type="number"]'),
                                 document.querySelector('#vin input[type="range"]'),
                                 0.055, 0.01, 0.1, 0.001, 0, null, (value) => {
    lbm.uIn = value;
  }, true);
  var rtpsInput = new NumberInput(document.querySelector('#rtps input[type="number"]'),
                                  document.querySelector('#rtps input[type="range"]'),
                                  100, 1, 100, 1, 1, null, (value) => {
    PHYSICS_SPEED = value;
  });
  var ptprtInput = new NumberInput(document.querySelector('#ptprt input[type="number"]'),
                                   document.querySelector('#ptprt input[type="range"]'),
                                   5, 1, 20, 1, 1, null, (value) => {
    PHYSICS_TICKS = value;
  });
  var rcsInput = new NumberInput(document.querySelector('#render-color-scale input[type="number"]'),
                                 document.querySelector('#render-color-scale input[type="range"]'),
                                 20, 5, 35, 0.25, null, null, (value) => {
    lbm.renderColorScale = value;
  }, true);
  document.querySelector('#restart-button').addEventListener('click', (e) => {
    var solid = [];
    for (var x = 1; x < lbm.nx - 1; x++) {
      for (var y = 1; y < lbm.ny - 1; y++) {
        if (lbm.solid[lbm.index(x, y)])
          solid.push([x - Math.round(lbm.nx / 2), y - Math.round(lbm.ny / 2)]);
      }
    }

    lbm = new LBM(nxInput.value, nyInput.value, rho0Input.value, tauInput.value, vinInput.value, rcsInput.value);
    solid.forEach(([x, y]) => {
      x += Math.round(lbm.nx / 2);
      y += Math.round(lbm.ny / 2);
      if (x <= 0 || x >= lbm.nx - 1 || y <= 0 || y >= lbm.ny)
        return;
      lbm.toggleSolid(x, y);
    });
  });
  var gradient = new ColorGradient(document.querySelector('#gradient'), document.querySelector('#gradient-point input[type="number"]'), document.querySelector('#gradient-point input[type="range"]'), document.querySelector('#gradient-point input[type="color"]'), document.querySelector('#gradient-point-remove'));
  document.getElementById('reset-button').addEventListener('click', () => {
    for (var x = 1; x < lbm.nx - 1; x++) {
      for (var y = 1; y < lbm.ny - 1; y++) {
        if (lbm.solid[lbm.index(x, y)] == 1)
          lbm.toggleSolid(x, y);
      }
    }
  });



  // var benchmark = [];
  // for (t = 0; t < 100; t++) {
  //   var start = Date.now();
  //   lbm.step();
  //   lbm.render(RENDER_MODE.speed);
  //   var end = Date.now();
  //   benchmark.push(end - start + 0.0);
    
    // await new Promise(r => setTimeout(r, /*1000 / 60 - (end - start)*/ 5));
  // }

  // var t = 0;
  // benchmark.forEach((time) => {
  //   t += time;
  // });
  // console.log(benchmark);
  // console.log(t * 1.0 / benchmark.length);
});

function generatePalette(points, size) {
  if (points.length <= 0)
    points.push({ h: 0, s: 1, v: 1, value: 0 });
  points = points.sort((a, b) => {
    return a.value - b.value;
  });
  if (points[0].value != 0)
    points.unshift({ h: points[0].h, s: points[0].s, v: points[0].v, value: 0 });
  if (points[points.length - 1].value != 1)
    points.push({ h: points[points.length - 1].h, s: points[points.length - 1].s, v: points[points.length - 1].v, value: 1 });


  var palette = new Uint8ClampedArray(size * 4);
  for (let i = 0; i < size; i++) {
    const index = (i + 0.0) / size;
    let start;
    for (start = 0; start < points.length; start++) {
      if (points[start].value > index)
        break;
    }
    start--;
    const t = (index - points[start].value) / (points[start + 1].value - points[start].value);

    var h = lerp(points[start].h, points[start + 1].h, t);
    var s = lerp(points[start].s, points[start + 1].s, t);
    var v = lerp(points[start].v, points[start + 1].v, t);
    var rgb = HSVtoRGB(h, s, v);
    palette[i * 4 + 0] = clamp(rgb.r, 0, 255);
    palette[i * 4 + 1] = clamp(rgb.g, 0, 255);
    palette[i * 4 + 2] = clamp(rgb.b, 0, 255);
    palette[i * 4 + 3] = 255;
  }
  return palette;
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function lerp(start, end, i) {
  return (end - start) * i + start;
}

function clamp(x, min, max) {
  if (x < min)
    return min;
  if (x > max)
    return max;
  return x;
}

class LBM {

  constructor(nx = 402, ny = 102, rho0 = 1.0, tau = 0.57, uIn = 0.055, rcs = 20.0) {
    this.nx = nx;
    this.ny = ny;
    this.rho0 = rho0;
    this.tau = tau;
    this.omega = 1.0 / this.tau;
    this.uIn = uIn;

    this.canvas = document.getElementById('simulation');
    this.ctx = this.canvas.getContext('2d');
    this.image = this.ctx.createImageData(this.nx, this.ny);
    this.palette = generatePalette([{ h: 180 / 360, s: 0.62, v: 1, value: 0.0 }, { h: 250 / 360, s: 0, v: 1, value: 0.5 }, { h: 320 / 360, s: 0.45, v: 1, value: 1.0 }], PALETTE_SIZE);
    this.renderColorScale = rcs;

    this.n = this.nx * this.ny;

    this.cx = new Int8Array([0, 1, 0, -1, 0, 1, -1, -1, 1]);
    this.cy = new Int8Array([0, 0, -1, 0, 1, -1, -1, 1, 1]);
    this.w = new Float32Array([4/9, 1/9, 1/9, 1/9, 1/9, 1/36, 1/36, 1/36, 1/36]);
    this.opp = new Uint8Array([0, 3, 4, 1, 2, 7, 8, 5, 6]);

    this.f = new Float32Array(9 * this.n);
    this.fNext = new Float32Array(9 * this.n);
    this.solid = new Uint8Array(this.n);

    this.rho = new Float32Array(this.n);
    this.ux = new Float32Array(this.n);
    this.uy = new Float32Array(this.n);

    this.t = 0;

    this.calculateGeometry();
    this.initialize();

    // for (let i = 0; i < 100; i++)
    //   this.step();
  }

  index(x, y) {
    return x + y * this.nx;
  }

  reverseIndex(p) {
    var x = p % this.nx;
    return [x, (p - x) / this.nx];
  }

  calculateGeometry() {
    const nx = this.nx;
    const ny = this.ny;
    const solid = this.solid;

    solid.fill(0);
    for (let x = 0; x < nx; x++) {
      solid[this.index(x, 0)] = 1;
      solid[this.index(x, ny - 1)] = 1;
    }

    // for (let x = 0; x < 30; x++) {
    //   for (let y = 0; y < 30; y++) {
    //     solid[this.index(this.nx / 2 - 15 + x, this.ny / 2 - 15 + y)] = 1;
    //   }
    // }
  }

  equilibrium(i, rho, ux, uy) {
    const cu = 3 * (this.cx[i] * ux + this.cy[i] * uy);
    const u2 = ux * ux + uy * uy;

    return this.w[i] * rho * (1 + cu + 0.5 * cu * cu - 1.5 * u2);
  }

  toggleSolid(x, y) {
    const n = this.n;
    const rho0 = this.rho0;
    const uIn = this.uIn;
    const p = this.index(x, y);
    this.solid[p] = 1 - this.solid[p];
    const ux = this.solid[p]? 0:uIn;
    const uy = 0;

    this.rho[p] = rho0;
    this.ux[p] = ux;
    this.uy[p] = uy;
    for (let i = 0; i < 9; i++) {
      this.f[i * n + p] = this.equilibrium(i, rho0, ux, uy);
    }
  }

  initialize() {
    const nx = this.nx;
    const ny = this.ny;
    const n = this.n;
    const rho0 = this.rho0;
    const uIn = this.uIn;

    for (let y= 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const p = this.index(x, y);
        const ux = this.solid[p]? 0:uIn;
        const uy = 0;

        this.rho[p] = rho0;
        this.ux[p] = ux;
        this.uy[p] = uy;

        for (let i = 0; i < 9; i++) {
          this.f[i * n + p] = this.equilibrium(i, rho0, ux, uy);
        }
      }
    }
  }

  collide() {
    const n = this.n;
    const omega = this.omega;
    const solid = this.solid;
    const f = this.f;
    const fNext = this.fNext;

    fNext.fill(0);

    for (let p = 0; p < n; p++) {
      if (solid[p])
        continue;

      const f0 = f[0 * n + p];
      const f1 = f[1 * n + p];
      const f2 = f[2 * n + p];
      const f3 = f[3 * n + p];
      const f4 = f[4 * n + p];
      const f5 = f[5 * n + p];
      const f6 = f[6 * n + p];
      const f7 = f[7 * n + p];
      const f8 = f[8 * n + p];

      const rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;

      const ux = (f1 + f5 + f8 - f3 - f6 - f7) / rho;
      const uy = (f4 + f7 + f8 - f2 - f5 - f6) / rho;

      this.rho[p] = rho;
      this.ux[p] = ux;
      this.uy[p] = uy;

      const u2 = ux * ux + uy * uy;

      for (let i = 0; i < 9; i++) {
        const cu = 3 * (this.cx[i] * ux + this.cy[i] * uy);
        const feq = this.w[i] * rho * (1 + cu + 0.5 * cu * cu - 1.5 * u2);

        fNext[i * n + p] = f[i * n + p] - omega * (f[i * n + p] - feq);
      }
    }
  }

  streamAndBounce() {
    const nx = this.nx;
    const ny = this.ny;
    const n = this.n;

    const cx = this.cx;
    const cy = this.cy;
    const opp = this.opp;
    const solid = this.solid;

    const fNext = this.fNext;
    const f = this.f;

    f.fill(0);

    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const p = x + y * nx;

        if (solid[p])
          continue;

        for (let i = 0; i < 9; i++) {
          const value = fNext[i * n + p];
          const x2 = x + cx[i];
          const y2 = y + cy[i];

          if (x2 < 0 || x2 >= nx || y2 < 0 || y2 >= ny)
            continue;

          const q = x2 + y2 * nx;

          if (solid[q])
            f[opp[i] * n + p] = value
          else
            f[i * n + q] = value;
        }
      }
    }
  }

  applyInletOuutlet() {
    const nx = this.nx;
    const ny = this.ny;
    const n = this.n;
    const f = this.f;

    const uIn = this.uIn;
    const rho0 = this.rho0;

    for (let y = 1; y < ny - 1; y++) {
      const p = y * nx;
      if (this.solid[p])
        continue;

      const f0 = f[0 * n + p];
      const f2 = f[2 * n + p];
      const f3 = f[3 * n + p];
      const f4 = f[4 * n + p];
      const f6 = f[6 * n + p];
      const f7 = f[7 * n + p];

      const rho = (f0 + f2 + f4 + 2 * (f3 + f6 + f7)) / (1.0 - uIn);

      f[1 * n + p] = f3 + 2.0 / 3.0 * rho * uIn;
      f[5 * n + p] = f7 + 0.5 * (f4 - f2) + 1.0 / 6.0 * rho * uIn;
      f[8 * n + p] = f6 + 0.5 * (f2 - f4) + 1.0 / 6.0 * rho * uIn;

      this.rho[p] = rho;
      this.ux[p] = uIn;
      this.uy[p] = 0.0;
    }

    for (let y = 1; y < ny - 1; y++) {
      const p = nx - 1 + y * nx;
      if (this.solid[p])
        continue;

      const f0 = f[0 * n + p];
      const f1 = f[1 * n + p];
      const f2 = f[2 * n + p];
      const f4 = f[4 * n + p];
      const f5 = f[5 * n + p];
      const f8 = f[8 * n + p];

      const rho = rho0;

      const ux = -1 + (f0 + f2 + f4 + 2 * (f1 + f5 + f8)) / rho;

      f[3 * n + p] = f1 - 2.0 / 3.0 * rho * ux;
      f[6 * n + p] = f8 + 0.5 * (f4 - f2) - 1.0 / 6.0 * rho * ux;
      f[7 * n + p] = f5 + 0.5 * (f2 - f4) - 1.0 / 6.0 * rho * ux;

      this.rho[p] = rho;
      this.ux[p] = ux;
      this.uy[p] = 0.0;
    }
  }

  sanitize() {
    const n = this.n;
    const f = this.f;
    const solid = this.solid;
    const rhoMin = this.rho0 * 0.1;
    const rhoMax = this.rho0 * 10.0;
    const uMax = 0.2;
    const uMax2 = uMax * uMax;
    const rho0 = this.rho0;
    const uIn = this.uIn;

    for (let p = 0; p < n; p++) {
      if (solid[p])
        continue;

      let bad = false;

      let f0 = f[0 * n + p];
      let f1 = f[1 * n + p];
      let f2 = f[2 * n + p];
      let f3 = f[3 * n + p];
      let f4 = f[4 * n + p];
      let f5 = f[5 * n + p];
      let f6 = f[6 * n + p];
      let f7 = f[7 * n + p];
      let f8 = f[8 * n + p];

      if (!Number.isFinite(f0) || !Number.isFinite(f1) || !Number.isFinite(f2) ||
          !Number.isFinite(f3) || !Number.isFinite(f4) || !Number.isFinite(f5) ||
          !Number.isFinite(f6) || !Number.isFinite(f7) || !Number.isFinite(f8))
        bad = true;

      if (f0 < -1e-5 || f1 < -1e-5 || f2 < -1e-5 || f3 < -1e-5 || f4 < -1e-5 ||
          f5 < -1e-5 || f6 < -1e-5 || f7 < -1e-5 || f8 < -1e-5)
        bad = true;
      
      const rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;

      if (!Number.isFinite(rho) || rho < rhoMin || rho > rhoMax)
        bad = true;

      const ux = (f1 + f5 + f8 - f3 - f6 - f7) / rho;
      const uy = (f4 + f7 + f8 - f2 - f5 - f6) / rho;
      const u2 = ux * ux + uy * uy;

      if (!Number.isFinite(ux) || !Number.isFinite(uy) || !Number.isFinite(u2))
        bad = true;

      if (bad) {
        const ux = this.solid[p]? 0:uIn;
        const uy = 0;
        this.rho[p] = rho0;
        this.ux[p] = ux;
        this.uy[p] = uy;
        for (let i = 0; i < 9; i++) {
          this.f[i * n + p] = this.equilibrium(i, rho0, ux, uy);
        }
        continue;
      }

      if (u2 > uMax2) {
        const scale = uMax / Math.sqrt(u2);
        const uxClamped = ux * scale;
        const uyClamped = uy * scale;

        const rhoClamped = clamp(rho, rhoMin, rhoMax);


        this.rho[p] = rhoClamped;
        this.ux[p] = uxClamped;
        this.uy[p] = uyClamped;
        for (let i = 0; i < 9; i++) {
          this.f[i * n + p] = this.equilibrium(i, rhoClamped, uxClamped, uyClamped);
        }
      }
    }
  }

  step() {
    this.collide();
    this.streamAndBounce();
    this.applyInletOuutlet();
    this.sanitize();
    this.t++;
  }

  recomputeMacroscopicFields() {
    const n = this.n;
    const f = this.f;

    for (let p = 0; p < n; p++) {
      if (this.solid[p]) {
        this.rho[p] = this.rho0;
        this.ux[p] = 0.0;
        this.uy[p] = 0.0;
        continue;
      }

      const f0 = f[0 * n + p];
      const f1 = f[1 * n + p];
      const f2 = f[2 * n + p];
      const f3 = f[3 * n + p];
      const f4 = f[4 * n + p];
      const f5 = f[5 * n + p];
      const f6 = f[6 * n + p];
      const f7 = f[7 * n + p];
      const f8 = f[8 * n + p];

      const rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;

      this.rho[p] = rho;
      this.ux[p] = (f1 + f5 + f8 - f3 - f6 - f7) / rho;
      this.uy[p] = (f4 + f7 + f8 - f2 - f5 - f6) / rho;
    }
  }

  render(mode) {
    this.recomputeMacroscopicFields();

    const nx = this.nx;
    const ny = this.ny;
    const imageData = this.image.data;
    const solid = this.solid;
    const ux = this.ux;
    const uy = this.uy;
    const rho = this.rho;

    const palette = this.palette;

    var calcFunction = this.calculateRenderValueDensity;
    if (mode == RENDER_MODE.vorticity)
      calcFunction = this.calculateRenderValueVorticity;
    if (mode == RENDER_MODE.speed)
      calcFunction = this.calculateRenderValueSpeed;

    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const p = x + y * nx;
        const k = 4 * p;

        if (solid[p]) {
          imageData[k + 0] = 0;
          imageData[k + 1] = 0;
          imageData[k + 2] = 0;
          imageData[k + 3] = 255;
          continue;
        }

        let value;

        value = calcFunction(x, y, nx, ny, p, rho, this.rho0, ux, uy, this.uIn, this.renderColorScale);
        value = clamp(Math.round(value * PALETTE_SIZE), 0, PALETTE_SIZE - 1);

        imageData[k + 0] = palette[value * 4 + 0];
        imageData[k + 1] = palette[value * 4 + 1];
        imageData[k + 2] = palette[value * 4 + 2];
        imageData[k + 3] = palette[value * 4 + 3];
      }
    }
  }

  calculateRenderValueDensity(x, y, nx, ny, p, rho, rho0, ux, uy, uIn, renderColorScale) {
    return Math.abs(rho[p] - rho0) * renderColorScale;
  }

  calculateRenderValueVorticity(x, y, nx, ny, p, rho, rho0, ux, uy, uIn, renderColorScale) {
    const xm = Math.max(x - 1, 0);
    const xp = Math.min(x + 1, nx - 1);
    const ym = Math.max(y - 1, 0);
    const yp = Math.min(y + 1, ny - 1);

    const pL = xm + y * nx;
    const pR = xp + y * nx;
    const pU = x + ym * nx;
    const pD = x + yp * nx;

    const dUyDx = uy[pR] - uy[pL];
    const dUxDy = ux[pD] - ux[pU];

    return 0.5 + 12.0 / 20.0 * renderColorScale * (dUyDx - dUxDy);
  }

  calculateRenderValueSpeed(x, y, nx, ny, p, rho, rho0, ux, uy, uIn, renderColorScale) {
    const speed = Math.sqrt(ux[p] * ux[p] + uy[p] * uy[p]);
    return speed / uIn * 0.625 / 20.0 * renderColorScale;
  }

}

function isFinitePositive(x) {
  return Number.isFinite(x) && x > 0;
}

const RENDER_MODE = {
  density: 0,
  vorticity: 1,
  speed: 2
};