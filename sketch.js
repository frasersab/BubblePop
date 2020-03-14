let bubbles = [];
function setup() {
    createCanvas(600, 400);
    frameRate(25);

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
    constructor(x, y, size) {
        // Bubble physical properties
        this.size = size;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-10, 10), random(-10, 10));
        this.acceleration = createVector(random(-50, 50), random(-50, 50));

        this.velocityMax = 100;
        this.accelerationMax = 300;

        // Housekeeping variable
        this.timeOld = 0;

        // Debug variables
        this.arrowLength = 0.5;
        this.arrows = true;
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

    wander() {
        // Delay the number of times acceleration changes
        if (millis() - this.timeOld >= random(1500, 2500)) {
            this.acceleration.rotate(random(0, PI));
            this.acceleration.setMag(random(100, this.accelerationMax));
            this.timeOld = millis();
        }
    }

    think() {
        this.wander();
    }

    physics() {
        // Δv = a * Δt
        this.velocity.add(this.acceleration.copy().div(deltaTime));


        // Δd = v * Δt
        this.position.add(this.velocity.copy().div(deltaTime));

        // Limit acceleration, velocity and position
        this.acceleration.limit(this.accelerationMax);
        this.velocity.limit(this.velocityMax);
        this.position.set(constrain(this.position.x, this.size / 2, width - (this.size / 2)), constrain(this.position.y, this.size / 2, height - (this.size / 2)))
    }

    draw() {
        this.think();
        this.physics();
        // Draw bubble
        ellipse(this.position.x, this.position.y, this.size);

        if (this.arrows) {
            // Draw velocity
            drawArrow(this.position, this.velocity.copy().mult(this.arrowLength), 'blue');

            // Draw Acceleration
            drawArrow(this.position, this.acceleration.copy().mult(this.arrowLength), 'red');
        }
    }
}

function cart2polar(x, y) {
    return [Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), Math.atan2(y, x)];
}

function polar2cart(size, dir) {
    return [size * Math.cos(dir), size * Math.sin(dir)]
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