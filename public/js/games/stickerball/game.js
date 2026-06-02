class Sticker {

  constructor(width) {
    this.width = width;
  }
  
  redraw(ctx) {

  }

}

class Ball {

  constructor(width, x) {
    this.width = width;
    this.pos = new Vector(x, (1 - BOARD_SIZE) * 0.5);
  }

  redraw(ctx, size, dimensions) {
    ctx.save();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(size.x * 0.5 - dimensions * 0.5 + this.pos.x * dimensions, dimensions * (1 + this.pos.y), this.width * dimensions / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

}

const BOARD_SIZE = 0.95;
var ball;

function redraw(ctx, size) {
  ctx.clearRect(0, 0, size.x, size.y);
  var dimensions = Math.min(size.x, size.y) * BOARD_SIZE;

  ctx.fillRect(size.x * 0.5 - dimensions * 0.5, 0, dimensions, dimensions);
  ball.redraw(ctx, size, dimensions);
}

function updateCanvas() {
  var canvas = document.getElementById('game-canvas');  
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var ctx = canvas.getContext('2d');
  redraw(ctx, new Vector(canvas.width, canvas.height));

  requestAnimationFrame(updateCanvas);
}

window.addEventListener('load', () => {
  ball = new Ball(0.025, 0.5)
  updateCanvas();
});