class CanvasCanvasScreen extends CanvasScreen {

  constructor() {
    super(document.getElementById('graph'), undefined, 15, -10);

    this.addMouseScrollListener([], this.onZoomInput.bind(this));
    this.addMouseDragListener(CanvasScreen.MOUSE_BUTTON.middle, [],
                              this.onMoveScreenInput.bind(this));
  }

  onZoomInput(mouse, x, y, modifier) {
    this.changeZoom(mouse, y);
  }

  onMoveScreenInput(start, end, button, modifier) {
    this.changePosition(start, end);
  }

  drawCustomGrid(size, color) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    var topLeft = this.screenToCanvas(Vector.ZERO);
    var botRight = this.screenToCanvas(new Vector(this.canvas.width,
                                                  this.canvas.height));
    var topLeftIndex = topLeft.scale(1.0 / size);
    topLeftIndex.x = parseInt(topLeftIndex.x);
    topLeftIndex.y = parseInt(topLeftIndex.y);
    topLeft = topLeftIndex.scale(size);
    var botRightIndex = botRight.scale(1.0 / size);
    botRightIndex.x = parseInt(Math.ceil(botRightIndex.x));
    botRightIndex.y = parseInt(Math.ceil(botRightIndex.y));
    botRight = botRightIndex.scale(size);
    
    for (var x = 0; x <= botRightIndex.x - topLeftIndex.x; x++) {
      var vec = topLeft.add(new Vector(x, 0).scale(size));
      vec = this.canvasToScreen(vec);
      this.ctx.beginPath();
      this.ctx.moveTo(vec.x, 0);
      this.ctx.lineTo(vec.x, this.canvas.height);
      this.ctx.stroke();
    }

    for (var y = 0; y <= botRightIndex.y - topLeftIndex.y; y++) {
      var vec = topLeft.add(new Vector(0, y).scale(size));
      vec = this.canvasToScreen(vec);
      this.ctx.beginPath();
      this.ctx.moveTo(0, vec.y);
      this.ctx.lineTo(this.canvas.width, vec.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawGrid() {
    var alpha = (1 - this.zoom / this.minZoom) * 5;
    this.drawCustomGrid(GRID_SIZE / 4, 'rgb(0 0 0 / ' + alpha + '%)');
    this.drawCustomGrid(GRID_SIZE, 'rgb(0 0 0 / 5%)');
  }

  repaint() {
    super.repaint();

    this.drawGrid();

    Object.entries(graph.nodes).forEach(([id, node]) => {
      var middle = new Vector(node.pos.x, node.pos.y);
      middle = this.canvasToScreen(middle);
      var size = new Vector(this.canvasSizeToScreen(node.size.w),
                            this.canvasSizeToScreen(node.size.h));
      var topLeft = middle.sub(size.scale(0.5));



      if (htmlElements.nodes[id] == null)
        htmlElements.nodes[id] = {};
      var textBox = htmlElements.nodes[id].text_box;
      if (htmlElements.nodes[id].text_box == null) {
        textBox = document.createElement('div');
        textBox.classList.add('node-textbox');
        textBox.contentEditable = true;
        textBox.appendChild(document.createTextNode(node.text));
        document.body.appendChild(textBox);
      }
      htmlElements.nodes[id].text_box = textBox;
      textBox.style.left = topLeft.x + 'px';
      textBox.style.top = topLeft.y + 'px';
      textBox.style.width = size.x + 'px';
      textBox.style.height = size.y + 'px';


      
      this.ctx.save();

      this.ctx.fillStyle = 'rgb(' + node.bg.r + ' ' + node.bg.g + ' ' + node.bg.b + ')';
      this.ctx.strokeStyle = 'rgb(' + node.bg_outline.r + ' ' + node.bg_outline.g + ' ' + node.bg_outline.b + ')';
      this.ctx.lineWidth = this.canvasSizeToScreen(node.bg_thickness);
      this.ctx.fillRect(topLeft.x, topLeft.y, size.x, size.y);
      this.ctx.strokeRect(topLeft.x, topLeft.y, size.x, size.y);

      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'rgb(' + node.fg.r + ' ' + node.fg.g + ' ' + node.fg.b + ')';
      this.ctx.strokeStyle = 'rgb(' + node.fg_outline.r + ' ' + node.fg_outline.g + ' ' + node.fg_outline.b + ')';
      this.ctx.lineWidth = this.canvasSizeToScreen(node.fg_thickness);
      var fontSize = this.canvasSizeToScreen(node.font_size);
      this.ctx.font = fontSize + 'px Calibri';
      
      textBox.style.font = fontSize + 'px Calibri';
      textBox.style.lineHeight = fontSize + 'px';
      
      var selection = window.getSelection();
      var cursor = -1;
      if (textBox.contains(selection.anchorNode) && selection.anchorOffset == selection.focusOffset) {
        cursor = selection.focusOffset;
      }
      var textSpace = size.x - this.canvasSizeToScreen(node.bg_thickness)
                             - this.canvasSizeToScreen(node.fg_thickness);
      var lines = [];
      var words = node.text.split(/(?=[\ \-\/])/);
      var seps = [];
      words = words.map((word, index) => {
        if (index == 0)
          return word;
        seps.push(word[0]);
        return word.substring(1);
      });
      for (var i = 0; i < words.length - 1; i++) {
        if (seps[i] != ' ') {
          words[i] += seps[i];
          seps[i] = '';
        }
      }
      lines.push(words.shift());
      while (words.length > 0) {
        var word = words.shift();
        var sep = seps.shift();
        
        var width = this.ctx.measureText(lines[lines.length - 1] + sep + word).width;
        if (width > textSpace)
          lines.push(word);
        else
          lines[lines.length - 1] += sep + word;
      }

      for (var i = 0; i < lines.length; i++) {
        var y = i * fontSize - (lines.length - 1) * fontSize * 0.5 + 0.093 * fontSize;
        this.ctx.fillText(lines[i], middle.x, middle.y + y);
        this.ctx.strokeText(lines[i], middle.x, middle.y + y);
      }

      this.ctx.restore();
    });
  }

}

const GRID_SIZE = 60;
var canvasCanvasScreen;

var htmlElements = {
  nodes: {
  }
};

var graph = {
  nodes: {
    0: {
      pos: { x: 0, y: 0 },
      size: { w: 240, h: 60 },
      bg_thickness: 1,
      bg: { r: 255, g: 255, b: 255 },
      bg_outline: { r: 0, g: 0, b: 0 },
      text: 'Flower Boss Arena (Rykard Phase 2, 0-0)',
      fg_thickness: 0.5,
      fg: { r: 255, g: 0, b: 0 },
      fg_outline: { r: 0, g: 255, b: 0 },
      font_size: 20
    }
  },
  edges: [

  ]
}

window.addEventListener('load', () => {
  canvasCanvasScreen = new CanvasCanvasScreen();

  fetch('/tools/games/eldenring/randomizer-graph/api/save', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }).then((object) => { return object.json(); })
  .then((object) => { console.log(object); });
});