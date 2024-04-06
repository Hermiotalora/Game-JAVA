const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const platformWidth = 100;
const platformHeight = 10;
let platformX = (canvas.width - platformWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - platformHeight - ballRadius;
let ballSpeedX = 5;
let ballSpeedY = -5;

const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = Array.from({ length: brickColumnCount }, (_, col) =>
  Array.from({ length: brickRowCount }, (_, row) => ({
    x: col * (brickWidth + brickPadding) + brickOffsetLeft,
    y: row * (brickHeight + brickPadding) + brickOffsetTop,
    status: 1,
  }))
);

document.addEventListener("mousemove", (event) => {
  platformX = event.clientX - canvas.offsetLeft - platformWidth / 2;
});

function drawBricks() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.status === 1) {
        ctx.fillStyle = "#0095DD";
        ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    });
  });
}

function collisionDetection() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.status === 1) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
        }
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();

  if (
    ballX + ballSpeedX > canvas.width - ballRadius ||
    ballX + ballSpeedX < ballRadius
  ) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  } else if (
    ballY + ballSpeedY >
    canvas.height - ballRadius - platformHeight
  ) {
    if (ballX > platformX && ballX < platformX + platformWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      document.location.reload();
    }
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  collisionDetection();

  platformX += 5;
  if (platformX + platformWidth > canvas.width) {
    platformX = canvas.width - platformWidth;
  }

  ctx.fillStyle = "#0095DD";
  ctx.fillRect(
    platformX,
    canvas.height - platformHeight,
    platformWidth,
    platformHeight
  );

  requestAnimationFrame(draw);
}

draw();
