class Rect {

  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.size = new Vector(width, height);
  }

  toCanvas(screen) {
    var pos = screen.screenToCanvas(this.pos);
    var width = screen.screenSizeToCanvas(this.size.x);
    var height = screen.screenSizeToCanvas(this.size.y);
    return new Rect(pos.x, pos.y, width, height);
  }

  toScreen(screen) {
    var pos = screen.canvasToScreen(this.pos);
    var width = screen.canvasSizeToScreen(this.size.x);
    var height = screen.canvasSizeToScreen(this.size.y);
    return new Rect(pos.x, pos.y, width, height);
  }

  fillAbsolute(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = this.pos.sub(this.size.scaleIndividual(anchor));
    Rect.fill(screen,
              new Rect(pos.x, pos.y, this.size.x, this.size.y));
  }

  strokeAbsolute(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = this.pos.sub(this.size.scaleIndividual(anchor));
    Rect.stroke(screen,
                new Rect(pos.x, pos.y, this.size.x, this.size.y));
  }

  fillAbsoluteSize(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = screen.canvasToScreen(this.pos)
                    .sub(this.size.scaleIndividual(anchor));
    Rect.fill(screen,
              new Rect(pos.x, pos.y, this.size.x, this.size.y));
  }

  strokeAbsoluteSize(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = screen.canvasToScreen(this.pos)
                    .sub(this.size.scaleIndividual(anchor));
    Rect.stroke(screen,
                new Rect(pos.x, pos.y, this.size.x, this.size.y));
  }

  fillRelative(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var rect = this.toScreen(screen);
    rect.pos = rect.pos.sub(rect.size.scaleIndividual(anchor));
    Rect.fill(screen,
              new Rect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y));
  }

  strokeRelative(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var rect = this.toScreen(screen);
    rect.pos = rect.pos.sub(rect.size.scaleIndividual(anchor));
    Rect.stroke(screen,
                new Rect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y));
  }

  static fill(screen, rect) {
    screen.ctx.fillRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
  }

  static stroke(screen, rect) {
    screen.ctx.strokeRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
  }

}