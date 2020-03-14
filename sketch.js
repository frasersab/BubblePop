let bubbles = [];
function setup() {
    createCanvas(600, 400);
    frameRate(60);

}

function mousePressed() {
    let b = new Bubble(mouseX, mouseY, 30);
    bubbles.push(b);
}

function draw() {
    background(30);
    for (i = 0; i < bubbles.length; i++) {
        bubbles[i].draw();
    }

}

class Bubble {
    constructor(x, y, size, colour = 'white', velocityMax = 50) {
        // Bubble physical properties
        this.velocityMax = velocityMax;
        this.accelRatio = 3;
        this.accelerationMax = this.velocityMax * this.accelRatio;

        this.size = size;
        this.colour = colour;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-this.velocityMax, this.velocityMax), random(-this.velocityMax, this.velocityMax));                         // units of pixels / s
        this.acceleration = createVector(random(-this.accelerationMax, this.accelerationMax), random(-this.accelerationMax, this.accelerationMax));     // units of pixels / s

        this.alive = true;
        this.deathVector = createVector(mouseX - this.position.x, mouseY - this.position.y);
        this.timeImmunity = millis() + 3000;

        // Housekeeping variable
        this.timeOld = millis();

        // Debug variables
        this.arrowLength = 0.5;
        this.arrows = true;
    }

    draw() {
        this.death();
        if (this.alive) {
            this.think();
            this.physics();

            // Draw bubble
            fill(this.colour);
            ellipse(this.position.x, this.position.y, this.size);

            if (this.arrows) {
                // Draw velocity arrow
                drawArrow(this.position, this.velocity.copy().mult(this.arrowLength), 'blue');

                // Draw accceleration arrow
                drawArrow(this.position, this.acceleration.copy().mult(this.arrowLength), 'red');

                // Draw death arrow
                // drawArrow(this.position, this.deathVector, 'yellow');
            }
        }
    }

    think() {
        //this.wander();
    }

    physics() {
        // Δv = a * Δt
        this.velocity.add(this.acceleration.copy().mult(deltaTime / 1000));

        // Δd = v * Δt
        this.position.add(this.velocity.copy().mult(deltaTime / 1000));

        // Limit acceleration, velocity and position
        this.acceleration.limit(this.accelerationMax);
        this.velocity.limit(this.velocityMax);
        this.position.set(constrain(this.position.x, this.size / 2, width - (this.size / 2)), constrain(this.position.y, this.size / 2, height - (this.size / 2)))
    }

    wander() {
        // Delay the number of times acceleration changes
        if (millis() - this.timeOld >= random(1500, 2500)) {
            this.acceleration.rotate(random(0, PI));
            this.acceleration.setMag(random(this.velocityMax, this.accelerationMax));
            this.timeOld = millis();
        }
    }

    attract() {
        // Create vector between mouse and bubble
        let attractVector = createVector(this.position.x - mouseX, this.position.y - mouseY);

        // Change amount of attraction
        //attractVector.setMag(100 / attractVector.magSq())

        // Add attration force to acceleration
        this.acceleration.sub(attractVector);
    }

    avoid() {

    }

    death() {
        if (millis() > this.timeImmunity) {
            this.deathVector.set(mouseX - this.position.x, mouseY - this.position.y);
            if (this.deathVector.mag() < (this.size / 2)) {
                this.alive = false;
            }
        }
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