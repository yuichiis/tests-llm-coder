const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game variables and constants
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 10,
    speed: 5
};

let invaders = [];
let invaderSpeed = 2;
let gameRunning = true;

// Function to draw the player on the canvas
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to update the player's position
function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// Function to draw invaders on the canvas
function drawInvaders() {
    invaders.forEach(invader => {
        ctx.fillStyle = 'red';
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
    });
}

// Function to update the positions of the invaders
function updateInvaders() {
    invaders.forEach(invader => {
        if (invader.y + invader.height >= canvas.height) {
            gameRunning = false;
        }
        invader.y += invaderSpeed;

        // Check for collisions with the player
        if (
            invader.x <= player.x + player.width &&
            invader.x + invader.width >= player.x &&
            invader.y <= player.y + player.height &&
            invader.y + invader.height >= player.y
        ) {
            gameRunning = false;
        }
    });
}

// Function to draw the game over message
function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 150, canvas.height / 2);
}

// Key handling
const keys = {};
document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});
document.addEventListener('keyup', function(e) {
    delete keys[e.key];
});

// Main game loop
function gameLoop() {
    if (!gameRunning) {
        drawGameOver();
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    updatePlayer();

    // Draw player
    drawPlayer();

    // Update invaders positions
    updateInvaders();

    // Draw invaders
    drawInvaders();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
