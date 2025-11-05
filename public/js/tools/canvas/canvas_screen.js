const CANVAS_CANVAS_SCREEN_HTML_IDS = {
  canvas: 'canvas'
};

class CanvasCanvasScreen extends CanvasScreen {

  constructor() {
    super(document.getElementById(CANVAS_CANVAS_SCREEN_HTML_IDS.canvas), undefined, 15, -10);

    this.addMouseScrollListener([], this.onZoomInput.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreenInput.bind(this));
  }



  onResize(e) {
    super.onResize(e);
  }

  changeZoom(mouse, deltaY) {
    super.changeZoom(mouse, deltaY);
  }

  changePosition(mouseStart, mouseEnd) {
    super.changePosition(mouseStart, mouseEnd);
  }



  onZoomInput(mouse, x, y, modifier) {
    this.changeZoom(mouse, y);
  }

  onMoveScreenInput(start, end, button, modifier) {
    this.changePosition(start, end);
  }

  drawTileGrid() {
    this.ctx.save();
    this.ctx.setLineDash([5, 15]);
    this.ctx.strokeStyle = 'rgb(255 0 0 / 35%)';
    var topLeft = this.screenToCanvas(Vector.ZERO);
    var botRight = this.screenToCanvas(new Vector(this.canvas.width,
                                                  this.canvas.height));
    var topLeftIndex = topLeft.scale(1.0 / TILE_SIZE);
    topLeftIndex.x = parseInt(topLeftIndex.x);
    topLeftIndex.y = parseInt(topLeftIndex.y);
    topLeft = topLeftIndex.scale(TILE_SIZE);
    var botRightIndex = botRight.scale(1.0 / TILE_SIZE);
    botRightIndex.x = parseInt(Math.ceil(botRightIndex.x));
    botRightIndex.y = parseInt(Math.ceil(botRightIndex.y));
    botRight = botRightIndex.scale(TILE_SIZE);
    
    for (var x = 0; x <= botRightIndex.x - topLeftIndex.x; x++) {
      var vec = topLeft.add(new Vector(x, 0).scale(TILE_SIZE));
      vec = this.canvasToScreen(vec);
      this.ctx.beginPath();
      this.ctx.moveTo(vec.x, 0);
      this.ctx.lineTo(vec.x, this.canvas.height);
      this.ctx.stroke();
    }

    for (var y = 0; y <= botRightIndex.y - topLeftIndex.y; y++) {
      var vec = topLeft.add(new Vector(0, y).scale(TILE_SIZE));
      vec = this.canvasToScreen(vec);
      this.ctx.beginPath();
      this.ctx.moveTo(0, vec.y);
      this.ctx.lineTo(this.canvas.width, vec.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  repaint() {
    super.repaint();

    this.drawTileGrid();

    layers.forEach((layer) => {
      layer.repaint(this);
    });

    toolManager.repaint(this);
  }

}