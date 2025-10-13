const TRACKER_CANVAS_SCREEN_HTML_IDS = {
  canvas: 'canvas'
};

class TrackerCanvasScreen extends CanvasScreen {

  constructor() {
    super(document.getElementById(TRACKER_CANVAS_SCREEN_HTML_IDS.canvas));

    this.p1 = null;
    this.p2 = null;

    this.bgImgs = defaultList(2, null);

    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left,
                              [],
                              this.onSetPoint1.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left,
                              [CanvasScreen.MOUSE_MODIFIER.alt],
                              this.onRemovePoint1.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.right,
                              [],
                              this.onSetPoint2.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.right,
                              [CanvasScreen.MOUSE_MODIFIER.alt],
                              this.onRemovePoint2.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreen.bind(this));
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
    var targetSize = new Vector(this.canvas.width, this.canvas.width / currentSize.x * currentSize.y);
    if (targetSize.y > this.canvas.height)
      targetSize = new Vector(this.canvas.height / currentSize.y * currentSize.x, this.canvas.height);
    var scale = targetSize.x / currentSize.x;
    var targetZoom = Math.log(scale) / Math.log(this.zoomSpeed);
    this.zoom = Math.floor(targetZoom);
    this.zoom = Math.max(Math.min(this.zoom, this.maxZoom), this.minZoom);
    this.p1 = null;
    this.p2 = null;
  }

  onSetPoint1(mouse, button, modifier) {
    this.p1 = this.screenToCanvas(mouse);
  }

  onRemovePoint1(mouse, button, modifier) {
    this.p1 = null;
  }

  onSetPoint2(mouse, button, modifier) {
    this.p2 = this.screenToCanvas(mouse);
  }

  onRemovePoint2(mouse, button, modifier) {
    this.p2 = null;
  }

  onMoveScreen(start, end, button, modifier) {
    this.position = this.position.sub(end
                    .sub(start).scale(this.zoomSpeed ** (-this.zoom)));
  }

  repaint() {
    super.repaint();

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
      this.ctx.fillText(Math.round(this.p1.distance(this.p2) * 100) / 100, 0, -20 * (this.zoomSpeed ** this.zoom));
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
  }

}

var trackerCanvasScreen = null;

window.addEventListener('load', () => {
  trackerCanvasScreen = new TrackerCanvasScreen();
});