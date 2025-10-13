class Circle {

  constructor(x, y, diameter) {
    this.pos = new Vector(x, y);
    this.diameter = diameter;
  }

  toCanvas(screen) {
    var pos = screen.screenToCanvas(this.pos);
    var diameter = screen.screenSizeToCanvas(this.diameter);
    return new Circle(pos.x, pos.y, diameter);
  }

  toScreen(screen) {
    var pos = screen.canvasToScreen(this.pos);
    var diameter = screen.canvasSizeToScreen(this.diameter);
    return new Circle(pos.x, pos.y, diameter);
  }

  fillAbsolute(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = this.pos.sub(Vector.DIAG(this.diameter).scaleIndividual(anchor));
    Circle.fill(screen, new Circle(pos.x, pos.y, this.diameter));
  }

  strokeAbsolute(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = this.pos.sub(Vector.DIAG(this.diameter).scaleIndividual(anchor));
    Circle.stroke(screen, new Circle(pos.x, pos.y, this.diameter));
  }

  fillAbsoluteSize(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = screen.canvasToScreen(this.pos)
                    .sub(Vector.DIAG(this.diameter).scaleIndividual(anchor));
    Circle.fill(screen, new Circle(pos.x, pos.y, this.diameter));
  }

  strokeAbsoluteSize(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var pos = screen.canvasToScreen(this.pos)
                    .sub(Vector.DIAG(this.diameter).scaleIndividual(anchor));
    Circle.stroke(screen, new Circle(pos.x, pos.y, this.diameter));
  }

  fillRelative(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var circle = this.toScreen(screen);
    circle.pos = circle.pos.sub(Vector.DIAG(circle.diameter)
                                      .scaleIndividual(anchor));
    Circle.fill(screen, new Circle(circle.pos.x, circle.pos.y,
                                   circle.diameter));
  }

  strokeRelative(screen, anchor = CanvasScreen.ANCHOR.nw) {
    var circle = this.toScreen(screen);
    circle.pos = circle.pos.sub(Vector.DIAG(circle.diameter)
                                      .scaleIndividual(anchor));
    Circle.stroke(screen, new Circle(circle.pos.x, circle.pos.y,
                                     circle.diameter));
  }

  static fill(screen, circle) {
    screen.ctx.beginPath();
    circle.pos = circle.pos.add(Vector.DIAG(circle.diameter / 2));
    screen.ctx.arc(circle.pos.x, circle.pos.y,
                   circle.diameter / 2, 0, 2 * Math.PI);
    screen.ctx.fill();
  }

  static stroke(screen, circle) {
    screen.ctx.beginPath();
    circle.pos = circle.pos.add(Vector.DIAG(circle.diameter / 2));
    screen.ctx.arc(circle.pos.x, circle.pos.y,
                   circle.diameter / 2, 0, 2 * Math.PI);
    screen.ctx.stroke();
  }

}