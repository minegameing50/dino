const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// Logical canvas size (DO NOT use CSS size here)
canvas.width = 800;
canvas.height = 300;

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

// Reset game
function resetGame() {
    player = {
        x: 60,
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

// Jump logic
function jump() {
    if (!player.jumping && !gameOver) {
        player.vy = -15;
        player.jumping = true;
    }
}

/* ===== INPUT HANDLING ===== */

// Keyboard (PC)
document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        e.preventDefault();
        jump();
    }
});

// Mouse (PC)
canvas.addEventListener("mousedown", jump);

// Touch (MOBILE) — FIXED
canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    jump();
}, { passive: false });

// Restart
restartBtn.addEventListener("click", resetGame);

// Draw cactus
function drawCactus(x, y, w, h) {
    ctx.fillStyle = "#228B22";

    ctx.fillRect(x, y, w, h);               // Main
    ctx.fillRect(x - 15, y + 20, 15, 10);   // Left arm
    ctx.fillRect(x - 15, y + 20, 10, 25);

    ctx.fillRect(x + w, y + 30, 15, 10);    // Right arm
    ctx.fillRect(x + w + 5, y + 30, 10, 25);
}

// Main loop
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

    // Obstacle
    if (!gameOver) obstacle.x -= 6;

    if (obstacle.x < -60) {
        obstacle.x = canvas.width;
        score++;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }

    drawCactus(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Collision
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        gameOver = true;
    }

    // UI
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 10, 22);
    ctx.fillText("High Score: " + highScore, 10, 44);

    if (gameOver) {
        ctx.font = "32px Arial";
        ctx.fillText("GAME OVER", 290, 150);
    }

    requestAnimationFrame(gameLoop);
}

// Start
resetGame();
gameLoop();
