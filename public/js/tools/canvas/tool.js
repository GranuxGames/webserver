const TOOL_HTML_CLASSES = {
  selected: 'selected'
};

const TOOL_UPDATE_FREQUENCY = 1.0 / 100.0;
const TOOL_TICK_FREQUENCY = 1.0 / 10.0;

class Tool {

  constructor(name, element, toolManager) {
    this.name = name;
    this.element = element;

    this.element.addEventListener('click', () => {
      toolManager.switchTool(this);
    });

    this.element.title = this.name;

    canvasCanvasScreen.addMouseScrollListener(
        [CanvasScreen.MOUSE_MODIFIER.ctrl],
        this.onToolScroll.bind(this));
    canvasCanvasScreen.addMouseDownListener(
        CanvasScreen.MOUSE_BUTTON.left, [],
        this.onToolUseMouseDown.bind(this));
    canvasCanvasScreen.addMouseDownListener(
        CanvasScreen.MOUSE_BUTTON.right, [],
        this.onToolCancelMouseDown.bind(this));
    canvasCanvasScreen.addMouseDragListener(
        CanvasCanvasScreen.MOUSE_BUTTON.left, [],
        this.onToolUseMouseDrag.bind(this));
    canvasCanvasScreen.addMouseUpListener(
        CanvasCanvasScreen.MOUSE_BUTTON.left, [],
        this.onToolUseMouseUp.bind(this));
    canvasCanvasScreen.addMouseMoveListener(this.onMoveToolMove.bind(this));
    
    this.updateInterval = null;
    this.tickInterval = null;
  }

  mouseToPixel(mouse) {
    return canvasCanvasScreen.screenToCanvas(mouse).sub(Vector.DIAG(0.5)).round();
  }

  deselect() {
    this.element.classList.remove(TOOL_HTML_CLASSES.selected);

    this.onEndUseTool();
  }

  select() {
    this.element.classList.add(TOOL_HTML_CLASSES.selected);
  }

  isSelected() {
    return this.element.classList.contains(TOOL_HTML_CLASSES.selected);
  }

  isBeingUsed() {
    return this.tickInterval != null;
  }



  onToolScroll(_, x, y) {
    if (!this.isSelected())
      return;

    this.onScrollTool(-Math.sign(y));
  }

  onScrollTool(y) {}

  onToolUseMouseDown(mouse) {
    if (!this.isSelected())
      return;

    if (!this.onStartUseTool(mouse))
      return;

    this.tickInterval = setInterval(this.onToolTick.bind(this),
                                    1000 * TOOL_TICK_FREQUENCY);
    this.updateInterval = setInterval(this.onToolUpdate.bind(this),
                                      1000 * TOOL_UPDATE_FREQUENCY);
  }

  onStartUseTool(mouse) {}

  onToolCancelMouseDown(mouse) {
    if (!this.isSelected())
      return;

    if (!this.isBeingUsed())
      return;

    this.onToolUseMouseUp();
    this.onCancelUseTool(mouse);
  }

  onCancelUseTool(mouse) {}



  onMoveToolMove(start, end) {
    if (!this.isSelected())
      return;

    this.onMoveTool(start, end);
  }

  onMoveTool(start, end) {}



  onToolUseMouseDrag(start, end) {
    if (!this.isSelected())
      return;

    if (!this.isBeingUsed())
      return;
    
    this.onUseTool(start, end);
  }

  onUseTool(start, end) {}



  onToolUpdate() {}

  onToolTick() {}



  onToolUseMouseUp() {
    if (!this.isSelected())
      return;

    if (!this.isBeingUsed())
      return;

    clearInterval(this.tickInterval);
    clearInterval(this.updateInterval);

    this.onToolUpdate();
    this.onToolTick();

    this.onEndUseTool();
    
    this.tickInterval = null;
    this.updateInterval = null;
  }

  onEndUseTool() {}



  repaint(canvasScreen) {}

}