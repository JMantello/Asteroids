var ship;
var asteroids = [];
var lasers = [];

var isPlaying = true;

function setup() {
  createCanvas(windowWidth - 4, windowHeight - 4);
  ship = new Ship();
  for (var i = 0; i < 10; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(20);

  // Create asteroids
  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
      console.log("Ship hit asteroid");
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  // Create lasers
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].render();
    lasers[i].update();

    // Remove if off screen
    if (lasers[i].offscreen()) lasers.splice(i, 1);
    else {
      // Check for laser hit asteroid
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[i].hits(asteroids[j])) {
          if (asteroids[j].r > 15) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  // Create ship
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}

function keyReleased() {
  if (isPlaying) {
    switch (keyCode) {
      case RIGHT_ARROW:
      case LEFT_ARROW:
        ship.setRotation(0);
        break;
      case UP_ARROW:
        ship.boosting(false);
        break;
    }
  }
}

function keyPressed() {
  if (isPlaying) {
    switch (keyCode) {
      case RIGHT_ARROW:
        ship.setRotation(0.1);
        break;
      case LEFT_ARROW:
        ship.setRotation(-0.1);
        break;
      case UP_ARROW:
        ship.boosting(true);
        break;
      case 32:
        lasers.push(new Laser(ship.pos, ship.heading));
        break;
    }
  }
}

// function keyReleased() {
//   ship.setRotation(0);
//   ship.boosting(false);
// }

// function keyPressed() {
//   //Space bar
//   if (keyCode == 32) {
//     lasers.push(new Laser(ship.pos, ship.heading));
//   }

//   if (keyCode == RIGHT_ARROW) {
//     ship.setRotation(0.1);
//   } else if (keyCode == LEFT_ARROW) {
//     ship.setRotation(-0.1);
//   } else if (keyCode == UP_ARROW) {
//     ship.boosting(true);
//   }
// }
