const TRACKER_CANVAS_SCREEN_HTML_IDS = {
  canvas: 'canvas',
  scale_input: 'scale-input'
};

class TrackerCanvasScreen extends CanvasScreen {

  constructor() {
    super(document.getElementById(TRACKER_CANVAS_SCREEN_HTML_IDS.canvas));

    this.scaleInput = document.getElementById(TRACKER_CANVAS_SCREEN_HTML_IDS
                                              .scale_input);

    this.interactDistance = 3;

    this.p1 = null;
    this.p2 = null;

    this.topLeftBorder = new Vector(-20, -20);
    this.bottomRightBorder = new Vector(20, 20);
    this.movingBorders = [false, false, false, false];

    this.bgImgs = defaultList(2, null);

    this.addMouseScrollListener([], this.onScroll.bind(this));
    this.addMouseMoveListener(this.onMove.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onLeft.bind(this));
    this.addMouseUpListener(CanvasScreen.MOUSE_BUTTON.left, [],
                            this.onLeftUp.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left,
                              [CanvasScreen.MOUSE_MODIFIER.alt],
                              this.onAltLeft.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onLeftDrag.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.right, [],
                              this.onRight.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.right,
                              [CanvasScreen.MOUSE_MODIFIER.alt],
                              this.onAltRight.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreen.bind(this));
    this.scaleInput.addEventListener('input', this.onScaleInput.bind(this));
    
    if (window.localStorage
              .getItem('tools.insect_tracker.border.top_left') == null) {
      window.localStorage.setItem('tools.insect_tracker.border.top_left',
                                  JSON.stringify(this.topLeftBorder.toJSON()));
    }
    if (window.localStorage
              .getItem('tools.insect_tracker.border.bottom_right') == null) {
      window.localStorage.setItem('tools.insect_tracker.border.bottom_right',
                                  JSON.stringify(this.bottomRightBorder
                                                     .toJSON()));
    }
    if (window.localStorage.getItem('tools.insect_tracker.scale') == null) {
      window.localStorage.setItem('tools.insect_tracker.scale', '' + 20);
    }

    this.topLeftBorder = Vector.fromJSON(JSON.parse(window.localStorage
                         .getItem('tools.insect_tracker.border.top_left')));
    this.bottomRightBorder = Vector.fromJSON(JSON.parse(window.localStorage
                             .getItem('tools.insect_tracker.border.bottom_right')));
    this.scaleInput.value = parseFloat(window.localStorage
                            .getItem('tools.insect_tracker.scale'));
  }

  onScroll(mouse, x, y, modifier) {
    this.changeZoom(mouse, y);
  }

  onScaleInput() {
    var value = parseFloat(this.scaleInput.value);
    window.localStorage.setItem('tools.insect_tracker.scale', '' + value);
  }

  addImage(img) {
    this.position = Vector.ZERO.clone();
    this.bgImgs.shift();
    this.bgImgs.push(img);

    var currentSize = Vector.ZERO.clone();
    this.bgImgs.filter((img) => {
      return img != null;
    }).map((img) => {
      return new Vector(img.width, img.height);
    }).forEach((size) => {
      if (size.x > currentSize.x)
        currentSize.x = size.x;
      if (size.y > currentSize.y)
        currentSize.y = size.y;
    });
    var targetSize = new Vector(this.canvas.width, this.canvas.width
                                / currentSize.x * currentSize.y);
    if (targetSize.y > this.canvas.height)
      targetSize = new Vector(this.canvas.height / currentSize.y
                              * currentSize.x, this.canvas.height);
    var scale = targetSize.x / currentSize.x;
    var targetZoom = Math.log(scale) / Math.log(this.zoomSpeed);
    this.zoom = Math.floor(targetZoom);
    this.zoom = Math.max(Math.min(this.zoom, this.maxZoom), this.minZoom);
    this.p1 = null;
    this.p2 = null;
  }

  onMove(start, end) {
    var mouse = end;
    var topLeft = this.canvasToScreen(this.topLeftBorder);
    var bottomRight = this.canvasToScreen(this.bottomRightBorder);

    window.localStorage.setItem('tools.insect_tracker.border.top_left',
                                JSON.stringify(this.topLeftBorder.toJSON()));
    window.localStorage.setItem('tools.insect_tracker.border.bottom_right',
                                JSON.stringify(this.bottomRightBorder
                                                   .toJSON()));
    if (Math.abs(mouse.x - topLeft.x) < this.interactDistance) {
      this.canvas.style.cursor = 'w-resize';
    } else if (Math.abs(mouse.x - bottomRight.x) < this.interactDistance) {
      this.canvas.style.cursor = 'e-resize';
    // } else if (Math.abs(mouse.y - topLeft.y) < this.interactDistance) {
    //   this.canvas.style.cursor = 'n-resize';
    // } else if (Math.abs(mouse.y - bottomRight.y) < this.interactDistance) {
    //   this.canvas.style.cursor = 's-resize';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  onLeft(mouse, button, modifier) {
    var mouseCanvas = this.screenToCanvas(mouse);
    var topLeft = this.canvasToScreen(this.topLeftBorder);
    var bottomRight = this.canvasToScreen(this.bottomRightBorder);

    if (Math.abs(mouse.x - topLeft.x) < this.interactDistance) {
      this.movingBorders[0] = true;
    } else if (Math.abs(mouse.x - bottomRight.x) < this.interactDistance) {
      this.movingBorders[2] = true;
    // } else if (Math.abs(mouse.y - topLeft.y) < this.interactDistance) {
    //   this.movingBorders[1] = true;
    // } else if (Math.abs(mouse.y - bottomRight.y) < this.interactDistance) {
    //   this.movingBorders[3] = true;
    } else {
     this.p1 = mouseCanvas;
    }
  }

  onLeftUp(mouse, button, modifier) {
    this.movingBorders = this.movingBorders.map((element) => {
      return false;
    });
  }

  onAltLeft(mouse, button, modifier) {
    this.p1 = null;
  }

  onLeftDrag(start, end, button, modifier) {
    var d = end.sub(start).scale(this.zoomSpeed ** (-this.zoom));
    if (this.movingBorders[0]) {
      this.topLeftBorder.x += d.x;
    } else if (this.movingBorders[2]) {
      this.bottomRightBorder.x += d.x;
    } else if (this.movingBorders[1]) {
      this.topLeftBorder.y += d.y;
    } else if (this.movingBorders[3]) {
      this.bottomRightBorder.y += d.y;
    }
  }

  onRight(mouse, button, modifier) {
    var mouseCanvas = this.screenToCanvas(mouse);
    this.p2 = mouseCanvas;
  }

  onAltRight(mouse, button, modifier) {
    this.p2 = null;
  }

  onMoveScreen(start, end, button, modifier) {
    this.changePosition(start, end);
  }

  pixToLengthString(len, scale, digits) {
    var text = '' + Math.round(len * scale * 10 ** digits) / 10 ** digits;
    return text + ' mm';
  }

  repaint() {
    super.repaint();

    var scale = Math.abs(parseFloat(this.scaleInput.value)
                / (this.topLeftBorder.x - this.bottomRightBorder.x));

    var middle = this.canvasToScreen(Vector.ZERO.clone());
    this.ctx.strokeStyle = 'rgb(0 0 0 / 25%)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.moveTo(0, middle.y);
    this.ctx.lineTo(this.canvas.width, middle.y);
    this.ctx.moveTo(middle.x, 0);
    this.ctx.lineTo(middle.x, this.canvas.height);
    this.ctx.stroke();

    this.bgImgs.filter((img) => {
      return img != null;
    }).forEach((img, index) => {
      this.ctx.save();
      if (index > 0)
        this.ctx.globalAlpha = 0.5;
      var rect = new Rect(-img.width / 2, -img.height / 2,
                          img.width, img.height);
      rect = rect.toScreen(this);
      this.ctx.drawImage(img, rect.pos.x, rect.pos.y,
                         rect.size.x, rect.size.y);
      this.ctx.restore();
    });

    if (this.p1 != null && this.p2 != null) {
      this.ctx.strokeStyle = 'rgb(0 0 0 / 100%)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.setLineDash([5, 15]);
      var p1 = this.canvasToScreen(this.p1);
      var p2 = this.canvasToScreen(this.p2);
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();

      var mid = p1.add(p2).scale(0.5);
      var angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));

      this.ctx.save();
      this.ctx.translate(mid.x, mid.y);
      this.ctx.rotate(angle);
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.font = 'bold ' + (200 * (this.zoomSpeed ** this.zoom))
                              + 'px calibri';
      this.ctx.fillText(this.pixToLengthString(this.p1.distance(this.p2),
                                               scale, 2),
                        0, -20 * (this.zoomSpeed ** this.zoom));
      this.ctx.restore();
    }

    if (this.p1 != null) {
      var circle = new Circle(this.p1.x, this.p1.y, 10);
      this.ctx.fillStyle = '#FFCAA4';
      circle.fillAbsoluteSize(this, CanvasScreen.ANCHOR.m);
    }

    if (this.p2 != null) {
      var circle = new Circle(this.p2.x, this.p2.y, 10);
      this.ctx.fillStyle = '#C2E5DF';
      circle.fillAbsoluteSize(this, CanvasScreen.ANCHOR.m);
    }

    var topLeft = this.canvasToScreen(this.topLeftBorder);
    var bottomRight = this.canvasToScreen(this.bottomRightBorder);
    this.ctx.strokeStyle = 'rgb(150 0 0 / 50%)';
    this.ctx.setLineDash([5, 15]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    // this.ctx.moveTo(0, topLeft.y);
    // this.ctx.lineTo(this.canvas.width, topLeft.y);
    // this.ctx.moveTo(0, bottomRight.y);
    // this.ctx.lineTo(this.canvas.width, bottomRight.y);
    this.ctx.moveTo(topLeft.x, 0);
    this.ctx.lineTo(topLeft.x, this.canvas.height);
    this.ctx.moveTo(bottomRight.x, 0);
    this.ctx.lineTo(bottomRight.x, this.canvas.height);
    this.ctx.stroke();
  }

}

var trackerCanvasScreen = null;

window.addEventListener('load', () => {
  trackerCanvasScreen = new TrackerCanvasScreen();
});