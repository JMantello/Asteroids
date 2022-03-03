// Game components
var ship;
var asteroids;
var lasers;
var score;
var lives;
const ASTEROID_BREAKAGE_SCORE = 10;
var rotationSpeed = 0.1;
var isPlaying;

var startScreen;
var scoreHUD;
var livesHUD;

function setup() {
  createCanvas(windowWidth - 4, windowHeight - 4);
  ship = new Ship();
  getElements();
  initNewGame();
  showStartScreen();
}

function getElements() {
  startScreen = document.getElementById("startScreen");
  scoreHUD = document.getElementById("score");
  livesHUD = document.getElementById("lives");
}

function initNewGame() {
  asteroids = [];
  createAsteroids(10);
  score = 0;
  lives = 3;
  initRound();
}

function initRound() {
  isPlaying = false;
  ship.reset();
  lasers = [];
  setLives();
  setPoints();
  showStartScreen();
}

function startRound() {
  isPlaying = true;
  hideStartScreen();
}

function endTurn() {
  if (!isPlaying) {
    return;
  }

  lives--;

  if (lives > 0) {
    initRound();
  } else {
    initNewGame();
  }

  setLives();
}

function createAsteroids(num) {
  for (var i = 0; i < num; i++) {
    asteroids.push(new Asteroid());
  }
}

function showStartScreen() {
  startScreen.classList.remove("hidden");
}

function hideStartScreen() {
  startScreen.classList.add("hidden");
}

function draw() {
  background(20);

  if (asteroids.length == 0) {
    alert("You Win!");
    initNewGame();
  }

  // Asteroids behavior - Mostly from tutorial, some modifications
  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i]) && isPlaying) {
      endTurn();
      return;
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  // Lasers behavior
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].render();
    lasers[i].update();

    // Remove if off screen
    if (lasers[i].offscreen()) lasers.splice(i, 1);
    else {
      // Check all lasers for hit asteroid
      for (var j = asteroids.length - 1; j >= 0; j--) {
        // If hit...
        if (lasers[i].hits(asteroids[j])) {
          addAsteroidBreakagePoints();

          // Depending on asteroid size, break up asteroid
          if (asteroids[j].r > 15) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }

          // Remove asteroid and laser
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  // "run" ship
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}

function addAsteroidBreakagePoints() {
  score += ASTEROID_BREAKAGE_SCORE;
  setPoints();
}

function setPoints() {
  scoreHUD.innerHTML = "Score: " + score;
}

function setLives() {
  livesHUD.innerHTML = lives;
}

function keyReleased() {
  if (!isPlaying) return;

  switch (keyCode) {
    case RIGHT_ARROW:
    case LEFT_ARROW:
      ship.setRotation(0);
      break;
    case UP_ARROW:
      ship.boosting(false);
      break;
    case CONTROL:
      rotationSpeed = rotationSpeed * 2;
  }
}

function keyPressed() {
  // Press 's' to start
  if (keyCode == 83 && !isPlaying) {
    startRound();
  }

  if (!isPlaying) return;

  switch (keyCode) {
    case RIGHT_ARROW:
      ship.setRotation(rotationSpeed);
      break;
    case LEFT_ARROW:
      ship.setRotation(-rotationSpeed);
      break;
    case UP_ARROW:
      ship.boosting(true);
      break;
    case 32:
      lasers.push(new Laser(ship.pos, ship.heading));
      break;
    case CONTROL:
      rotationSpeed = rotationSpeed / 2;
      break;
  }
}
