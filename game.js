
// Define the start button element
const startButton = document.getElementById('startButton');

// Function to start the game
function startGame() {// Get the canvas element and its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set up the initial player position
let playerX = canvas.width / 2;
let playerY = canvas.height + 500 / 2;

// Define the player size and color
const playerSize = 40;
const playerColor = 'blue';

// Define the enemy properties
let enemySpeed = 2;
let enemySize = 30;
const enemyColor = 'red';
let enemies = [];

// Define the boss properties
let boss = null;
const bossInitialSize = 80;
const bossColor = 'purple';
let bossSpawned = false;

// Define the bullet properties
let bulletSpeed = 5;
const bulletSize = 10;
const bulletColor = 'yellow';
let bullets = [];
let maxAmmo = 80; // Maximum ammo count
let currentAmmo = maxAmmo; // Current ammo count

// Define the player health
const playerMaxHealth = 100;
let playerHealth = playerMaxHealth;

// Define the score
let score = 0;

// Define the game intervals
let enemyInterval;
let bossInterval;
let gameInterval;

// Define the boss spawn rate
const bossSpawnRate = 10000; // milliseconds

const backgroundMusic = new Audio('bg.mp3');
const winningSound = new Audio('win.mp3');
backgroundMusic.loop = true;
backgroundMusic.play()
// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = playerColor;
  ctx.fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);
}

// Function to draw the enemies
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    ctx.fillStyle = enemyColor;
    ctx.fillRect(enemy.x - enemySize / 2, enemy.y - enemySize / 2, enemySize, enemySize);
  }
}

// Function to draw the boss
function drawBoss() {
  if (boss) {
    ctx.fillStyle = bossColor;
    ctx.fillRect(boss.x - boss.size / 2, boss.y - boss.size / 2, boss.size, boss.size);
    
  }
}

// Function to draw the bullets
function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    ctx.fillStyle = bulletColor;
    ctx.fillRect(bullet.x - bulletSize / 2, bullet.y - bulletSize / 2, bulletSize, bulletSize);
  }
}

// Function to draw the health bar
function drawHealthBar() {
  const healthBarWidth = 100;
  const healthBarHeight = 20;
  const healthBarX = 10;
  const healthBarY = 10;

  ctx.fillStyle = 'gray';
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

  const healthPercentage = playerHealth / playerMaxHealth;
  const currentHealthBarWidth = healthPercentage * healthBarWidth;

  ctx.fillStyle = 'green';
  ctx.fillRect(healthBarX, healthBarY, currentHealthBarWidth, healthBarHeight);

  ctx.strokeStyle = 'white';
  ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
}

// Function to draw the score
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 10, canvas.height - 20);
}

// Function to draw the ammo count
function drawAmmoCount() {
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('Ammo: ' + currentAmmo + '/' + maxAmmo, canvas.width - 10, canvas.height - 20);
}

// Function to update the game state
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  drawPlayer();

  // Draw the enemies
  drawEnemies();

  // Draw the boss
  drawBoss();

  // Draw the bullets
  drawBullets();

  // Draw the health bar
  drawHealthBar();

  // Draw the score
  drawScore();

  // Draw the ammo count
  drawAmmoCount();

  // Update the boss position if it exists
  if (boss) {
    boss.y += 1;
  }
  if(boss){
  if(score >= 1000){
    boss.y += 1;
  }
}
  if(boss){
  if(score >= 2500){
    boss.y += 1;
  }
  }
  if(boss){
  if(score >= 6000){
    boss.y += 1;
  }
  }
  // Update the enemy positions
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.y += enemySpeed;

    // Check collision with the player
    if (
      enemy.x - enemySize / 2 < playerX + playerSize / 2 &&
      enemy.x + enemySize / 2 > playerX - playerSize / 2 &&
      enemy.y - enemySize / 2 < playerY + playerSize / 2 &&
      enemy.y + enemySize / 2 > playerY - playerSize / 2
    ) {
      // Reduce player health on collision
      playerHealth -= 11;

      // Remove the enemy
      enemies.splice(i, 1);
      i--;
    }

    // Remove enemies that are off the screen
    if (enemy.y - enemySize / 2 > canvas.height) {
      enemies.splice(i, 1);
      i--;
      score -= 40;
    }
  }

  // Update the bullet positions
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    bullet.y -= bulletSpeed;

    // Check collision with enemies
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];

      if (
        bullet.x - bulletSize / 2 < enemy.x + enemySize / 2 &&
        bullet.x + bulletSize / 2 > enemy.x - enemySize / 2 &&
        bullet.y - bulletSize / 2 < enemy.y + enemySize / 2 &&
        bullet.y + bulletSize / 2 > enemy.y - enemySize / 2
      ) {
        // Remove the enemy and bullet on collision
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        i--;
        score += 10; // Increase the score
        currentAmmo++; // Increase ammo count
        if (currentAmmo > maxAmmo) {
          currentAmmo = maxAmmo; // Cap the ammo count to maxAmmo
        }
        break;
      }
    }

    // Check collision with the boss
    if (boss) {
      if (
        bullet.x - bulletSize / 2 < boss.x + boss.size / 2 &&
        bullet.x + bulletSize / 2 > boss.x - boss.size / 2 &&
        bullet.y - bulletSize / 2 < boss.y + boss.size / 2 &&
        bullet.y + bulletSize / 2 > boss.y - boss.size / 2
      ) {
        // Remove the bullet and reduce boss health on collision
        bullets.splice(i, 1);
        i--;
        boss.size -= 5;
        if (boss.size <= enemySize) {
          // Boss defeated
          boss = null;
          score += 200;
          currentAmmo = maxAmmo;
          // Increase the score
        }
      }
    }

    // Remove bullets that are off the screen
    if (bullet.y + bulletSize / 2 < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Check if boss needs to be spawned
  if (!bossSpawned && Math.floor(Date.now() / bossSpawnRate) % 10 === 0) {
    createBoss();
    bossSpawned = true;
  }

//HHAMMER
  if(score >= 1000){
    enemySpeed = 4;
    bulletSpeed = 7;
    enemySize = 23;
  }
  if(score >= 5000){
    enemySpeed = 7;
    bulletSpeed = 10;
    enemySize = 21;
  }
  if(score >= 6000){
    enemySpeed = 10;
    bulletSpeed = 12;
    enemySize = 19;
  }
  if(score >= 6100){
    congr();
    backgroundMusic.pause();
    winningSound.play();
    setInterval(mine, 5000);
  }
  // Check game over condition
  if (playerHealth <= 0) {
    gameOver();
    return;
  }

  // Request the next animation frame
  gameInterval = requestAnimationFrame(update);
}

// Function to create a new enemy
function createEnemy() {
  const x = Math.random() * (canvas.width - enemySize) + enemySize / 2;
  const y = -enemySize / 2;

  const enemy = { x, y };
  enemies.push(enemy);
}

// Function to create the boss
function createBoss() {
  const x = canvas.width / 2;
  const y = -bossInitialSize / 2;
  const size = bossInitialSize;

  boss = { x, y, size };
}

// Function to create a new bullet
function createBullet() {
  const x = playerX;
  const y = playerY - playerSize / 2;

  const bullet = { x, y };
  bullets.push(bullet);

  // Decrease the ammo count
  currentAmmo--;
}

// Function to handle touch move event
function handleTouchMove(event) {
  event.preventDefault();

  // Get the touch position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  let touchX = event.touches[0].clientX - rect.left;
  let touchY = event.touches[0].clientY - rect.top;

  // Check if the touch position is outside the canvas boundaries
  if (touchX < playerSize / 2) {
    touchX = playerSize / 2;
  } else if (touchX > canvas.width - playerSize / 2) {
    touchX = canvas.width - playerSize / 2;
  }

  if (touchY < playerSize / 2) {
    touchY = playerSize / 2;
  } else if (touchY > canvas.height - playerSize / 2) {
    touchY = canvas.height - playerSize / 2;
  }

  // Update the player position
  playerX = touchX;
  playerY = touchY;
}

// Function to handle touch start event
function handleTouchStart(event) {
  event.preventDefault();

  // Check if there is ammo available
  if (currentAmmo > 0) {
    // Create a new bullet
    createBullet();
  }
}

// Function to handle window resize
function handleResize() {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
}
function congr(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '48px VT323, monospace'
  ctx.textAlign = 'center';
  ctx.fillText('BANKAI!', canvas.width / 2, canvas.height / 2);
}
  function mine(){
   window.open('https://instagram.com/byteninja_studios')
  }
// Function to handle game over
function gameOver() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Display the game over message
  ctx.fillStyle = 'red';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

  // Stop the game by clearing the intervals
  clearInterval(enemyInterval);
  clearInterval(bossInterval);
  cancelAnimationFrame(gameInterval);
}

// Add event listeners
window.addEventListener('resize', handleResize);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchstart', handleTouchStart, false);

// Initialize the game
handleResize();
enemyInterval = setInterval(createEnemy, 1000); // Create a new enemy every 3000 milliseconds (3 seconds)
bossInterval = setInterval(createBoss, bossSpawnRate); // Create a new boss every bossSpawnRate milliseconds
update();
}
startButton.addEventListener('click', startGame);
