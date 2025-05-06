const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 40,
  height: 10,
  speed: 5,
};

let aliens = [];
let bullets = [];
let score = 0;
let gameRunning = true;

// Create aliens
function createAliens() {
  const alienWidth = 30;
  const alienHeight = 20;
  const rows = 4;
  const cols = 12;
  const spacing = 15;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      aliens.push({
        x: col * (alienWidth + spacing) + 100,
        y: row * (alienHeight + spacing) + 50,
        width: alienWidth,
        height: alienHeight,
        speed: 1,
      });
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw aliens
function drawAliens() {
  ctx.fillStyle = "green";
  aliens.forEach((alien) => {
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  });
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, 4, 10);
  });
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// Move player
function movePlayer(key) {
  switch (key) {
    case "ArrowLeft":
      player.x -= player.speed;
      break;
    case "ArrowRight":
      player.x += player.speed;
      break;
  }
  // Keep player within canvas bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Fire bullet
function fireBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    speed: 7,
  });
}

// Update game objects
function update() {
  // Move bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }

  // Move aliens
  let alienSpeed = 1;
  let moveLeft = true;

  //// Check for collision with edges
  //for (let alien of aliens) {
  //  if (
  //    alien.x < 0 ||
  //    alien.x + alien.width > canvas.width
  //  ) {
  //    alienSpeed = -alienSpeed;
  //    moveLeft = !moveLeft;
  //  }
  //}

  // Move aliens horizontally
  aliens.forEach((alien) => {
    alien.x += alienSpeed;
  });
  
  // Check if any alien has reached the edge (left or right)
  let edgeHit = false;
  for (let alien of aliens) {
    if (
      alien.x < 0 || // Left edge
      alien.x + alien.width > canvas.width // Right edge
    ) {
      edgeHit = true;
      break;
    }
  }
  
  if (edgeHit) {
    // Move all aliens down by a certain amount (e.g., 10 pixels)
    const dropAmount = 10; // Adjust as needed
    for (let alien of aliens) {
      alien.y += dropAmount;
    }
  
    // Reverse direction to continue movement in the opposite direction
    alienSpeed = -alienSpeed;
  }

  // Drop aliens down if they hit the bottom
  for (let i = aliens.length - 1; i >= 0; i--) {
    if (aliens[i].y + aliens[i].height > canvas.height) {
      gameRunning = false;
    }
  }

  // Check collisions between bullets and aliens
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    for (let j = aliens.length - 1; j >= 0; j--) {
      let alien = aliens[j];
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        // Collision detected
        bullets.splice(i, 1);
        aliens.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  // Check collision with player
  for (let alien of aliens) {
    if (
      player.x < alien.x + alien.width &&
      player.x + player.width > alien.x &&
      player.y < alien.y + alien.height &&
      player.y + player.height > alien.y
    ) {
      gameRunning = false;
    }
  }
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  drawPlayer();

  // Draw aliens
  drawAliens();

  // Draw bullets
  drawBullets();

  // Draw score
  drawScore();
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    update();
    draw();
  } else {
    alert("Game Over! Your score: " + score);
    resetGame();
  }
  requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
  player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 10,
    speed: 5,
  };
  bullets = [];
  score = 0;
  createAliens();
  gameRunning = true;
}

// Initialize game
createAliens();
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    movePlayer(e.code);
  } else if (e.code === "Space") {
    fireBullet();
  }
});

// Start the game
gameLoop();
