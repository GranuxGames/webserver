const MOUSE_BUTTON_MODIFIER = {
  shift: 'shift',
  ctrl: 'ctrl',
  alt: 'alt'
};

class CanvasScreen {

  static MOUSE_BUTTON = {
    left: 0,
    middle: 1,
    right: 2
  };

  static MOUSE_MODIFIER = {
    shift: 'shift',
    ctrl: 'ctrl',
    alt: 'alt'
  };

  static ANCHOR = {
    nw: new Vector(0, 0),
    n: new Vector(0.5, 0),
    ne: new Vector(1, 0),
    w: new Vector(0, 0.5),
    m: new Vector(0.5, 0.5),
    e: new Vector(1, 0.5),
    sw: new Vector(0, 1),
    s: new Vector(0.5, 1),
    se: new Vector(1, 1)
  };

  constructor(canvas, zoomSpeed = 1.25, maxZoom = 10, minZoom = -20) {
    this.zoomSpeed = zoomSpeed;
    this.zoom = 0;
    this.position = Vector.ZERO.clone();
    this.maxZoom = maxZoom;
    this.minZoom = minZoom;

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.onResize();

    this.mouseButtons = [false, false, false];
    this.mouseModifier = [[], [], []];

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('wheel', this.onScrollRaw.bind(this));
    this.mouseScrollListeners = [];
    window.addEventListener('mousedown', this.onMouseDownRaw.bind(this));
    this.mouseDownListeners = [];
    window.addEventListener('mousemove', this.onMouseMoveRaw.bind(this));
    this.mouseMoveListeners = [];
    this.mouseDragListeners = [];
    window.addEventListener('mouseup', this.onMouseUpRaw.bind(this));
    this.mouseUpListeners = [];

    this.updateInterval = setInterval(this.onUpdate.bind(this), 1000 / 60);
  }

  onUpdate() {
    this.repaint();
  }

  onResize(e) {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  getMousePos(e) {
    var mouse = new Vector(e.clientX, e.clientY);
    var bounds = this.canvas.getBoundingClientRect();
    bounds = new Vector(bounds.left, bounds.top);
    return mouse.sub(bounds);
  }

  addMouseScrollListener(listener) {
    this.mouseScrollListeners.push({ callback: listener });
  }

  onScrollRaw(e) {
    var mouse = this.getMousePos(e);
    var mouseBefore = this.screenToCanvas(mouse);
    this.zoom = Math.max(Math.min(this.zoom - Math.round(e.deltaY / 100),
                                  this.maxZoom),
                         this.minZoom);
    var mouseAfter = this.screenToCanvas(mouse);
    this.position = this.position.sub(mouseAfter.sub(mouseBefore));

    this.onScroll(e.deltaX, e.deltaY);
    this.mouseScrollListeners.forEach((listener) => {
      listener.callback(x, y);
    });
  }

  onScroll(x, y) {}

  addMouseDownListener(button, modifier, listener) {
    this.mouseDownListeners.push({ button: button,
                                   modifier: modifier,
                                   callback: listener });
  }

  onMouseDownRaw(e) {
    e.preventDefault();
    this.mouseButtons[e.button] = true;
    var modifier = [];
    if (e.shiftKey)
      modifier.push(CanvasScreen.MOUSE_MODIFIER.shift);
    if (e.ctrlKey)
      modifier.push(CanvasScreen.MOUSE_MODIFIER.ctrl);
    if (e.altKey)
      modifier.push(CanvasScreen.MOUSE_MODIFIER.alt);
    this.mouseButtons[e.button] = modifier;

    var mouse = this.getMousePos(e);
    this.onMouseDown(mouse, e.button, this.mouseModifier[e.button]);
    this.mouseDownListeners.forEach((listener) => {
      if (listener.button != e.button)
        return;

      if (!compareLists(listener.modifier, modifier))
        return;

      listener.callback(mouse, e.button, modifier);
    });
  }

  onMouseDown(mouse, button, modifier) {}

  addMouseMoveListener(listener) {
    this.mouseMoveListeners.push({ callback: listener });
  }

  addMouseDragListener(button, modifier, listener) {
    this.mouseDragListeners.push({ button: button,
                                   modifier: modifier,
                                   callback: listener });
  }

  onMouseMoveRaw(e) {
    var end = this.getMousePos(e);
    var move = new Vector(e.movementX, e.movementY);
    var start = end.sub(move);
    
    this.onMouseMove(start, end);
    this.mouseMoveListeners.forEach((listener) => {
      listener.callback(start, end);
    });

    for (var i = 0; i < this.mouseButtons.length; i++) {
      if (this.mouseButtons[i]) {
        this.onMouseDrag(start, end, i, this.mouseModifier[i]);
        this.mouseDragListeners.forEach((listener) => {
          if (listener.button != i)
            return;

          if (!compareLists(listener.modifier, this.mouseModifier[i]))
            return;

          listener.callback(start, end, i, this.mouseModifier[i]);
        });
      }
    }
  }

  onMouseMove(start, end) {}

  onMouseDrag(start, end, button, modifier) {}

  addMouseUpListener(button, modifier, listener) {
    this.mouseUpListeners.push({ button: button,
                                modifier: modifier,
                                callback: listener });
  }

  onMouseUpRaw(e) {
    e.preventDefault();
    this.mouseButtons[e.button] = false;
    var modifier = this.mouseModifier[e.button];
    this.mouseModifier[e.button] = [];

    var mouse = this.getMousePos(e);
    this.onMouseUp(mouse, e.button, modifier);
    this.mouseUpListeners.forEach((listener) => {
      if (listener.button != e.button)
        return;

      if (!compareLists(listener.modifier, modifier))
        return;

      listener.callback(mouse, e.button, modifier);
    });
  }

  onMouseUp(button, mouse, modifier) {}

  screenToCanvas(vec) {
    vec = vec.sub(new Vector(this.canvas.width, this.canvas.height)
                            .scale(0.5));
    vec = vec.scale(this.zoomSpeed ** (-this.zoom));
    vec = vec.add(this.position);
    return vec;
  }

  screenSizeToCanvas(size) {
    return size * (this.zoomSpeed ** (-this.zoom));
  }

  canvasToScreen(vec) {
    vec = vec.sub(this.position);
    vec = vec.scale(this.zoomSpeed ** this.zoom);
    vec = vec.add(new Vector(this.canvas.width, this.canvas.height)
                            .scale(0.5));
    return vec;
  }

  canvasSizeToScreen(size) {
    return size * (this.zoomSpeed ** this.zoom);
  }

  repaint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}