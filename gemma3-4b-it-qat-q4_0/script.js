const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let playerX = canvas.width / 2;
let playerY = canvas.height - 50;
let playerSpeed = 3;

let invaders = [];
let bullets = [];
let score = 0;
let gameOver = false;

// Invader Class
class Invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 50;
    this.speed = 2;
    this.direction = 1; // 1 for right, -1 for left
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speed * this.direction;

    if (this.x < 0 || this.x > canvas.width - this.width) {
      this.direction *= -1; // Reverse direction
    }
  }
}


// Function to create invaders
function createInvaders() {
  for (let i = 0; i < 5; i++) {
    invaders.push(new Invader(i * 80, i * 30)); // Spacing between invaders
  }
}

// Bullet Class
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 10;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y -= this.speed; // Move upwards
  }
}


// Game Loop
function gameLoop() {
  if (gameOver) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game state
  update();

  // Draw everything
  draw();

  // Request next frame
  requestAnimationFrame(gameLoop);
}


function update() {
  // Player Movement
  if (keys['ArrowLeft'] && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (keys['ArrowRight'] && playerX < canvas.width - 50) {
    playerX += playerSpeed;
  }

  // Bullet Shooting
  if (keys['Space']) {
    bullets.push(new Bullet(playerX, playerY));
  }

  // Update Invaders
  for (let i = invaders.length - 1; i >= 0; i--) {
    invaders[i].update();
    invaders[i].draw();
  }

  // Update Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].draw();

    // Check for collisions with invaders
    for (let j = invaders.length - 1; j >= 0; j--) {
      if (checkCollision(bullets[i], invaders[j])) {
        invaders.splice(j, 1); // Remove invader
        bullets.splice(i, 1);   // Remove bullet
        score++;
        break; // Only remove one invader per bullet
      }
    }

    // Remove bullets that go off-screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }


  // Check for game over
  if (invaders.some(invader => invader.x + invader.width > playerX && invader.y < playerY + 50)) {
    gameOver = true;
  }

  // Display score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}


function draw() {
  // Draw Player
  ctx.fillStyle = 'green';
  ctx.fillRect(playerX, playerY, 50, 50);

  // Draw Invaders
  for (let i = 0; i < invaders.length; i++) {
    invaders[i].draw();
  }

  // Draw Bullets
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].draw();
  }
}


function checkCollision(bullet, invader) {
  const distanceX = Math.abs(bullet.x - invader.x);
  const distanceY = Math.abs(bullet.y - invader.y);

  return distanceX < bullet.radius + invader.width / 2 && distanceY < bullet.radius + invader.height / 2;
}


// Key Handling
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    keys.ArrowLeft = true;
  } else if (e.key === 'ArrowRight') {
    keys.ArrowRight = true;
  } else if (e.key === ' ') {
    keys.Space = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    keys.ArrowLeft = false;
  } else if (e.key === 'ArrowRight') {
    keys.ArrowRight = false;
  } else if (e.key === ' ') {
    keys.Space = false;
  }
});


// Start the game loop
createInvaders();
gameLoop();
