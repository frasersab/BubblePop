class Bubble {
    constructor(x, y, sizeCell, sizeMouse, colour = 'grey', type = 'cell', velocityMax = 50) {
        this.type = type;
        this.panic = false;
        // Bubble physical properties
        this.velocityMax = velocityMax;
        this.accelRatio = 2.8;
        this.accelerationMax = this.velocityMax * this.accelRatio;

        this.size = sizeCell;
        this.colour = colour;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-this.velocityMax, this.velocityMax), random(-this.velocityMax, this.velocityMax));                         // units of pixels / s
        this.acceleration = createVector(random(-this.accelerationMax, this.accelerationMax), random(-this.accelerationMax, this.accelerationMax));     // units of pixels / s

        this.sizeMouse = sizeMouse;
        this.alive = true;
        this.deathMouse = false;
        this.deathVector = createVector(posMouseX - this.position.x, posMouseY - this.position.y);
        this.timeImmunity = 1000;

        // World variables
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        // Housekeeping variable
        this.timeOld = millis();
        this.randomWander = 2000;

        // Debug variables
        this.arrowLength = 0.5;
        this.debug = false;
    }

    // Figures out where the bubble should be and draws the bubble
    draw() {
        if (this.alive) {
            // Check to see if bubble should die
            if (this.type != 'virus3') {
                this.death();
            } else {
                this.death('shrink');
            }


            // Place the bubble behaviour here
            if (this.type == 'virus2') {
                if (this.deathVector.mag() > 100) {
                    this.panic = false;
                    this.wander();
                } else {
                    this.panic = true;
                    this.mouseAvoid();
                }
                this.bounce();
                this.physics();
            } else {
                this.wander();
                this.bounce();
                this.physics();
            }
            // Draw bubble
            fill(this.colour);
            ellipse(this.position.x, this.position.y, this.size);

            // Draw the velocity/acceleration arrows if debug mode is active
            if (this.debug) {
                // Draw velocity arrow
                drawArrow(this.position, this.velocity.copy().mult(this.arrowLength), 'blue');

                // Draw accceleration arrow
                drawArrow(this.position, this.acceleration.copy().mult(this.arrowLength), 'red');

                // Draw death arrow
                // drawArrow(this.position, this.deathVector, 'yellow');
            }
        }
    }

    physics() {
        if (this.type == 'cell' && spacePause) {
            if (millis() - timePauseStart >= spacePauseTime) {
                spacePause = false;
            } else {
                return;
            }

        }
        // Δv = a * Δt
        this.velocity.add(this.acceleration.copy().mult(deltaTime / 1000));

        // Δd = v * Δt
        this.position.add(this.velocity.copy().mult(deltaTime / 1000));

        // Limit acceleration, velocity and position
        if (this.panic) {
            this.acceleration.limit(this.accelerationMax * 3);
            this.velocity.limit(this.velocityMax * 2.5);
        } else {
            this.acceleration.limit(this.accelerationMax);
            this.velocity.limit(this.velocityMax);
        }
        this.position.set(constrain(this.position.x, this.size / 2, this.gameWidth - (this.size / 2)), constrain(this.position.y, this.size / 2, this.gameHeight - (this.size / 2)))
    }

    // Randomly move around and change direction
    wander() {
        // Delay the number of times acceleration changes
        if (millis() - this.timeOld >= this.randomWander) {
            this.acceleration.rotate(random(0, PI));
            this.acceleration.setMag(random(this.velocityMax, this.accelerationMax));
            this.timeOld = millis();
            this.randomWander = random(1500, 4000)
        }
    }

    // Bounce off the sides of the canvas
    bounce() {
        if (this.position.x <= this.size / 2 || this.position.x >= this.gameWidth - (this.size / 2)) {
            this.velocity.set(-this.velocity.x, this.velocity.y);
            this.acceleration.set(-this.acceleration.x, this.acceleration.y);
        }
        if (this.position.y <= this.size / 2 || this.position.y >= this.gameHeight - (this.size / 2)) {
            this.velocity.set(this.velocity.x, -this.velocity.y);
            this.acceleration.set(this.acceleration.x, -this.acceleration.y);
        }
    }

    // check for intersection
    intersects(other) {
        if (dist(this.position.x, this.position.y, other.position.x, other.position.y) <= (this.size + other.size) / 2) {
            return true;
        } else {
            return false;
        }
    }

    mouseAttract() {
    }

    mouseAvoid() {
        //this.deathVector.set(posMouseX - this.position.x, posMouseY - this.position.y);
        this.acceleration.rotate(this.acceleration.angleBetween(this.deathVector) + PI);
        this.acceleration.setMag(this.accelerationMax * 4);
    }

    // this desides whether the buble should die or not
    death(type = 'pop') {
        if (type == 'pop') {
            this.deathVector.set(posMouseX - this.position.x, posMouseY - this.position.y);
            if (this.deathVector.mag() < (this.size / 2) + (this.sizeMouse / 2)) {
                this.alive = false;
                this.deathMouse = true;
                audioLibrary[Math.trunc(random(0, audioLibrary.length))].play();
            }

        }
        else if (type == 'shrink') {
            this.deathVector.set(posMouseX - this.position.x, posMouseY - this.position.y);
            if (this.deathVector.mag() < (this.size / 2) + (this.sizeMouse / 2)) {
                this.size -= 1;
            }
            if (this.size < 20) {
                this.alive = false;
                audioLibrary[Math.trunc(random(0, audioLibrary.length))].play();
            }

        }

    }

    log() {
        console.log('--- start log group ---');
        //console.log('velocity size: ' + this.velocity.mag());
        console.log('velocity direction: ' + this.velocity.heading());
        //console.log('acceleration size: ' + this.acceleration.mag());
        console.log('acceleration direction: ' + this.acceleration.heading());
    }
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}