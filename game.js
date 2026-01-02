const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// Images
const runImg = new Image();
runImg.src = "run.png";

const jumpImg = new Image();
jumpImg.src = "jump.png";

// Game variables
let player, obstacle;
const gravity = 0.8;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

// Initialize / Reset game state
function resetGame() {
    player = {
        x: 50,
        y: 200,
        width: 60,
        height: 60,
        vy: 0,
        jumping: false
    };

    obstacle = {
        x: canvas.width,
        y: 210,
        width: 40,
        height: 60
    };

    score = 0;
    gameOver = false;
}

// Controls
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !player.jumping && !gameOver) {
        player.vy = -15;
        player.jumping = true;
    }
});

// Restart button
restartBtn.addEventListener("click", resetGame);

// Draw cactus obstacle
function drawCactus(x, y, w, h) {
    ctx.fillStyle = "#228B22";

    ctx.fillRect(x, y, w, h);               // Main stem
    ctx.fillRect(x - 15, y + 20, 15, 10);   // Left arm
    ctx.fillRect(x - 15, y + 20, 10, 25);

    ctx.fillRect(x + w, y + 30, 15, 10);    // Right arm
    ctx.fillRect(x + w + 5, y + 30, 10, 25);
}

// Main game loop (ONLY ONE)
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player physics
    player.y += player.vy;
    player.vy += gravity;

    if (player.y >= 200) {
        player.y = 200;
        player.vy = 0;
        player.jumping = false;
    }

    // Draw player
    const img = player.jumping ? jumpImg : runImg;
    ctx.drawImage(img, player.x, player.y, player.width, player.height);

    // Obstacle movement
    if (!gameOver) {
        obstacle.x -= 6;
    }

    if (obstacle.x < -60) {
        obstacle.x = canvas.width;
        score++;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }

    drawCactus(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Collision detection
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        gameOver = true;
    }

    // Score UI
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("High Score: " + highScore, 10, 40);

    if (gameOver) {
        ctx.font = "32px Arial";
        ctx.fillText("GAME OVER", 290, 150);
    }

    requestAnimationFrame(gameLoop);
}

// Start game
resetGame();
gameLoop();
