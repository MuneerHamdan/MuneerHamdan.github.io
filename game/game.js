const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  dx: 3,
  dy: 3,
  color: 'blue'
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Move the ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Bounce off walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  requestAnimationFrame(update);
}

// Start the game
update();

