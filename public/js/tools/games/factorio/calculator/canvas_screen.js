const GRAPH_CANVAS_SCREEN_HTML_IDS = {
  canvas: 'canvas'
};

class CanvasGraph {

  constructor(graph) {
    this.nodes = [];
    var dict = {};
    graph.nodes.forEach((graphNode) => {
      var node = new CanvasGraphNode(graphNode.recipe.name);
      dict[graph.nodes.indexOf(graphNode)] = node;
      this.nodes.push(node);
    });
    graph.nodes.forEach((graphNode, index) => {
      graphNode.outputs.forEach((output) => {
        dict[index].connections.push(dict[graph.nodes.indexOf(output)]);
      });
    });
    var overview = graph.getOverview();
    Object.entries(overview.inputs).forEach(([itemName, count]) => {
      var node = new CanvasGraphNode(count + ' × ' + itemName);
      graph.nodes.forEach((graphNode, index) => {
        if (graphNode.recipe.inputs.map((input) => { return input.item.name; }).includes(itemName))
          node.connections.push(dict[index]);
      });
      this.nodes.push(node);
    });
    Object.entries(overview.outputs).forEach(([itemName, count]) => {
      var node = new CanvasGraphNode(count + ' × ' + itemName);
      graph.nodes.forEach((graphNode, index) => {
        if (graphNode.recipe.outputs.map((output) => { return output.item.name; }).includes(itemName))
          dict[index].connections.push(node);
      });
      this.nodes.push(node);
    });

    this.selected = null;
  }

  paint(canvasScreen) {
    this.nodes.forEach((node) => {
      node.paint(canvasScreen);
    })
  }

  onSelectNode(pos) {
    this.selected = this.nodes.filter((node) => {
      return pos.sub(node.pos).length() <= node.width / 2;
    })[0];
  }

  onDeselectNode(pos) {
    this.selected = null;
  }

  onMoveNode(start, end) {
    if (this.selected == null)
      return;

    this.selected.pos = this.selected.pos.add(end.sub(start));
  }

}

class CanvasGraphNode {

  constructor(label) {
    this.pos = new Vector(0, 0);
    this.width = 50;
    this.label = label;
    this.connections = [];
  }

  paint(canvasScreen) {
    var pos = canvasScreen.canvasToScreen(this.pos);
    var width = canvasScreen.canvasSizeToScreen(this.width);
    canvasScreen.ctx.beginPath();
    canvasScreen.ctx.arc(pos.x, pos.y, width / 2, 0, Math.PI * 2.0);
    canvasScreen.ctx.stroke();

    canvasScreen.ctx.textAlign = 'center';
    canvasScreen.ctx.textBaseline = 'middle'
    canvasScreen.ctx.font = '' + width / 5 + 'px Calibri';
    canvasScreen.ctx.fillText(this.label, pos.x, pos.y, width);

    this.connections.forEach((connection) => {
      var otherPos = canvasScreen.canvasToScreen(connection.pos);

      if (otherPos.equal(pos))
        return;

      var edgePos = pos.add(otherPos.sub(pos).normalize().scale(width / 2));
      otherPos = otherPos.add(pos.sub(otherPos).normalize().scale(width / 2));

      canvasScreen.paintArrow(edgePos, otherPos, 60.0 / 180.0 * Math.PI, canvasScreen.canvasSizeToScreen(15));
    });
  }

}

class GraphCanvasScreen extends CanvasScreen {

  constructor() {
    super(document.getElementById(GRAPH_CANVAS_SCREEN_HTML_IDS.canvas));

    this.canvasGraph = null;

    this.addMouseScrollListener([], this.onScroll.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreen.bind(this));
    this.addMouseDownListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onSelectNode.bind(this));
    this.addMouseUpListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onSelectNode.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.left, [],
                              this.onMoveNode.bind(this));
  }

  paintArrow(start, end, spread, length) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    var edge = start.sub(end);
    var angle = Math.atan2(edge.y, edge.x);
    var line = new Vector(length, 0);

    var line1 = line.rotate(angle + spread / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(end.x + line1.x, end.y + line1.y);
    this.ctx.stroke();

    var line2 = line.rotate(angle - spread / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(end.x + line2.x, end.y + line2.y);
    this.ctx.stroke();
  }

  onScroll(mouse, x, y, modifier) {
    this.changeZoom(mouse, y);
  }

  onMoveScreen(start, end, button, modifier) {
    this.changePosition(start, end);
  }

  onSelectNode(pos, button, modifier) {
    if (this.canvasGraph == null)
      return;

    this.canvasGraph.onSelectNode(this.screenToCanvas(pos));
  }

  onDeselectNode(pos, button, modifier) {
    if (this.canvasGraph == null)
      return;

    this.canvasGraph.onDeselectNode(this.screenToCanvas(pos));
  }

  onMoveNode(start, end, button, modifier) {
    if (this.canvasGraph == null)
      return;

    this.canvasGraph.onMoveNode(this.screenToCanvas(start), this.screenToCanvas(end));
  }

  repaint() {
    super.repaint();

    if (graphChanged) {
      if (graph == null)
        this.canvasGraph = null;
      else
        this.canvasGraph = new CanvasGraph(graph);
      graphChanged = false;
    }

    if (this.canvasGraph == null)
      return;

    this.canvasGraph.paint(this);
  }

}

var graphCanvasScreen = null;

window.addEventListener('load', () => {
  graphCanvasScreen = new GraphCanvasScreen();
});