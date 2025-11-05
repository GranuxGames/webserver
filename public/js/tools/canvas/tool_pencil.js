const TOOL_PENCIL_HTML_IDS = {
  pencil: 'pencil'
};

class ToolPencil extends Tool {

  constructor(toolManager) {
    super('Pencil', document.getElementById(TOOL_PENCIL_HTML_IDS.pencil),
          toolManager);
    
    this.start = Vector.ZERO;
    this.end = Vector.ZERO;
    this.points = [];

    this.mouse = Vector.ZERO;

    this.shape = Shape.getShape('circle', 3, 0, 0, 0, 255);
    this.layerID = null;
  }



  onScrollTool(y) {
    this.shape = Shape.getShape(Shape.getShapeType(this.shape),
        Math.max(this.shape.size + y, 1), this.shape.r, this.shape.g,
        this.shape.b, this.shape.a);
  }

  onStartUseTool(mouse) {
    if (!(layers[selectedLayer] instanceof TileLayer))
      return false;

    if (!layers[selectedLayer].editable)
      return false;

    if (layers[selectedLayer].owner != null
        && !layers[selectedLayer].owner.includes(canvasSocket.socket.id))
      return false;

    this.start = this.mouseToPixel(mouse);
    this.end = this.start;
    this.points = [this.start];

    this.layerID = canvasSocket.socket.id + '-'
    if (crypto.randomUUID != null)
      this.layerID += crypto.randomUUID();
    else
      this.layerID += uuidv4_weak();
    var baseID = layers[selectedLayer].generateSubLayer(this.layerID);
    canvasSocket.emit('add-sublayer', {
      id: layers[selectedLayer].id,
      subid: this.layerID,
      baseid: baseID
    });

    return true;
  }

  onUseTool(start, end) {
    this.end = this.mouseToPixel(end);
  }

  onToolUpdate() {
    if (this.points.length > 1 && this.points[this.points.length - 1].equal(this.end))
      return;

    this.points.push(this.end);
    this.start = this.end;

    if (!(layers[selectedLayer] instanceof TileLayer))
      return;

    var points = this.points;
    var line = new Line(points[points.length - 2].x, points[points.length - 2].y,
                        points[points.length - 1].x, points[points.length - 1].y);
    line.callbackOnPoint((point) => {
      layers[selectedLayer].drawShape(this.shape, point, this.layerID);
    });
  }

  onToolTick() {
    var points = this.points;
    this.points = [this.end];
    this.start = this.end;

    if (!(layers[selectedLayer] instanceof TileLayer))
      return;

    var msg = {};
    msg.layer_id = layers[selectedLayer].id;
    msg.sub_id = this.layerID;
    msg.type = 'pencil';
    msg.shape = this.shape.toJSON();
    msg.points = points.map((point) => {
      return point.toJSON();
    });

    canvasSocket.emit('tool-use', msg);
  }

  onEndUseTool() {

  }

  onCancelUseTool(mouse) {
    var msg = {};
    msg.id = layers[selectedLayer].id;
    msg.sub_id = this.layerID;
    canvasSocket.emit('remove-sublayer', msg);
  }



  onMoveTool(start, end) {
    this.mouse = this.mouseToPixel(end);
  }



  repaint(canvasScreen) {
    this.shape.drawOnCanvas(canvasScreen, this.mouse);
  }

}