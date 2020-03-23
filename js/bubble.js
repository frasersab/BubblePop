class Bubble {
    constructor(x, y, sizeCell, sizeMouse, colour = 'grey', velocityMax = 50) {
        // Bubble physical properties
        this.velocityMax = velocityMax;
        this.accelRatio = 3;
        this.accelerationMax = this.velocityMax * this.accelRatio;

        this.size = sizeCell;
        this.colour = colour;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-this.velocityMax, this.velocityMax), random(-this.velocityMax, this.velocityMax));                         // units of pixels / s
        this.acceleration = createVector(random(-this.accelerationMax, this.accelerationMax), random(-this.accelerationMax, this.accelerationMax));     // units of pixels / s

        this.sizeMouse = sizeMouse;
        this.alive = true;
        this.deathVector = createVector(mouseX - this.position.x, mouseY - this.position.y);
        this.timeImmunity = 1000;

        // Housekeeping variable
        this.timeOld = millis();

        // Debug variables
        this.arrowLength = 0.5;
        this.debug = false;
    }

    // Figures out where the bubble should be and draws the bubble
    draw() {
        if (this.alive) {
            // Check to see if bubble should die
            this.death();

            // Place the bubble behaviour here
            this.bounce();
            this.physics();

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
        // Δv = a * Δt
        //this.velocity.add(this.acceleration.copy().mult(deltaTime / 1000));

        // Δd = v * Δt
        this.position.add(this.velocity.copy().mult(deltaTime / 1000));

        // Limit acceleration, velocity and position
        this.acceleration.limit(this.accelerationMax);
        this.velocity.limit(this.velocityMax);
        this.position.set(constrain(this.position.x, this.size / 2, width - (this.size / 2)), constrain(this.position.y, this.size / 2, height - (this.size / 2)))
    }

    // Randomly move around and change direction
    wander() {
        // Delay the number of times acceleration changes
        if (millis() - this.timeOld >= random(1500, 2500)) {
            this.acceleration.rotate(random(0, PI));
            this.acceleration.setMag(random(this.velocityMax, this.accelerationMax));
            this.timeOld = millis();
        }
    }

    // Bounce of the sides of the canvas
    bounce() {
        if (this.position.x <= this.size / 2 || this.position.x >= width - (this.size / 2)) {
            this.velocity.set(-this.velocity.x, this.velocity.y);
        }
        if (this.position.y <= this.size / 2 || this.position.y >= height - (this.size / 2)) {
            this.velocity.set(this.velocity.x, -this.velocity.y);
        }
    }

    // Bounce off of other 
    collide() {

    }

    mouseAttract() {
    }

    mouseAvoid() {
    }

    // this desides whether the buble should die or not
    death(type = 'mouseOver') {
        // check if immunity time is over
        if (millis() >= this.timeImmunity) {
            this.deathVector.set(mouseX - this.position.x, mouseY - this.position.y);
            if (this.deathVector.mag() < (this.size / 2) + (this.sizeMouse / 2)) {
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