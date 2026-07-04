class SimulationCanvas extends CanvasScreen {

  constructor() {
    super(document.getElementById('simulation'), undefined, 15, -10);

    this.solid = 0;
    this.mouse = Vector.ZERO;
    this.cursorSize = 3;

    this.addMouseScrollListener([], this.onZoomInput.bind(this));
    this.addMouseScrollListener([CanvasScreen.MOUSE_MODIFIER.ctrl], this.onZoomInput.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.left, [CanvasScreen.MOUSE_MODIFIER.shift],
                              this.onMoveScreenInput.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreenInput.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onSetObstacleDown.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.right, [],
                              this.onRemoveObstacleDown.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onToggleObstacleDrag.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.right, [],
                              this.onToggleObstacleDrag.bind(this));
    this.addTouchMoveListener(1, this.onToggleObstacleTouchDrag.bind(this));
    this.addMouseMoveListener(this.onMouseVisualMove.bind(this));
    this.addTouchMoveListener(2, this.onTranslateScreenTouch.bind(this));
  }

  onTranslateScreenTouch(touches) {
    var start = Vector.ZERO;
    var end = Vector.ZERO;
    Object.values(touches).forEach((touch) => {
      start = start.add(touch.start);
      end = end.add(touch.end);
    });
    start = start.scale(1 / Object.values(touches).length);
    end = end.scale(1 / Object.values(touches).length);

    var ssStart = Object.values(touches)[0].start.sub(Object.values(touches)[1].start).length();
    var ssEnd = Object.values(touches)[0].end.sub(Object.values(touches)[1].end).length();
    var cs = this.screenSizeToCanvas(ssStart);
    var zoom = -Math.log(cs / ssEnd) / Math.log(this.zoomSpeed);

    this.changePosition(start, end);
    this.changeZoom(end, (this.zoom - zoom) * 8);
  }

  onMouseVisualMove(mouse) {
    this.mouse = this.screenToCanvas(mouse);
  }

  onSetObstacleDown(mouse, button, modifier) {
    mouse = this.screenToCanvas(mouse).sub(new Vector(-lbm.nx / 2 + 1, -lbm.ny / 2 + 1)).floor();
    this.solid = 0;
    this.onToggleObstacle(mouse);
  }

  onRemoveObstacleDown(mouse, button, modifier) {
    mouse = this.screenToCanvas(mouse).sub(new Vector(-lbm.nx / 2 + 1, -lbm.ny / 2 + 1)).floor();
    this.solid = 1;
    this.onToggleObstacle(mouse);
  }

  // onToggleObstacleDown(mouse, button, modifier) {
  //   mouse = this.screenToCanvas(mouse).sub(new Vector(-lbm.nx / 2 + 1, -lbm.ny / 2 + 1)).floor();
  //   this.solid = lbm.solid[lbm.index(mouse.x, mouse.y)];
  //   this.onToggleObstacle(mouse);
  // }

  onToggleObstacleTouchDrag(touches) {
    this.onToggleObstacleDrag(Object.values(touches)[0].start, Object.values(touches)[0].end);
  }

  onToggleObstacleDrag(start, end, button, modifier) {
    start = this.screenToCanvas(start).sub(new Vector(-lbm.nx / 2 + 1, -lbm.ny / 2 + 1)).floor();
    end = this.screenToCanvas(end).sub(new Vector(-lbm.nx / 2 + 1, -lbm.ny / 2 + 1)).floor();
    if (end.x == start.x && end.y == start.y)
      return;

    this.onToggleObstacle(end);
  }

  onToggleObstacle(mouse) {
    var poss = [];
    var topLeft = mouse.sub(new Vector(this.cursorSize - 1, this.cursorSize - 1).scale(0.5)).floor();
    for (var x = 0; x < this.cursorSize; x++) {
      for (var y = 0; y < this.cursorSize; y++) {
        var pos = topLeft.add(new Vector(x, y));

        if (lbm.solid[lbm.index(pos.x, pos.y)] != this.solid)
          continue;

        poss.push(pos);
      }
    }

    poss.forEach((pos) => {
      if (pos.x <= 0 || pos.x >= lbm.nx - 2 || pos.y <= 0 || pos.y >= lbm.ny - 2)
        return;

      lbm.toggleSolid(pos.x, pos.y);
    });
  }

  onZoomInput(mouse, x, y, modifier) {
    this.changeZoom(mouse, y);
  }

  onMoveScreenInput(start, end, button, modifier) {
    this.changePosition(start, end);
  }

  repaint() {
    super.repaint();

    // paint simulation
    var posSim = this.canvasToScreen(new Vector(lbm.nx - 2, lbm.ny - 2).scale(-0.5).floor());
    var sizeSim = new Vector(this.canvasSizeToScreen(lbm.nx - 2), this.canvasSizeToScreen(lbm.ny - 2));
    var img = document.createElement('canvas');
    img.width = lbm.nx - 2;
    img.height = lbm.ny - 2;
    img.getContext('2d').putImageData(lbm.image, 0, 0, 1, 1, lbm.nx - 2, lbm.ny - 2);
    this.ctx.drawImage(img, posSim.x, posSim.y, sizeSim.x, sizeSim.y);

    var mouseSize = this.canvasSizeToScreen(this.cursorSize);
    var mouseTopLeft = this.mouse.sub(new Vector(this.cursorSize - 1, this.cursorSize - 1).scale(0.5)).floor();
    mouseTopLeft = this.canvasToScreen(mouseTopLeft);
    this.ctx.strokeStyle = 'rgb(200, 200, 200)';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(mouseTopLeft.x, mouseTopLeft.y, mouseSize, mouseSize);
  }

}

var canvas;

window.addEventListener('load', () => {
  canvas = new SimulationCanvas();
});