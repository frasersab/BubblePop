console.log('Why hello there you snooping my code');

let bubbles = [];
let audioPop = [];

function setup() {
    createCanvas(600, 400);
    frameRate(60);
    audioPop[0] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Fraser pop1.mp3');
    audioPop[1] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Georgia voice pop.mp3');
    audioPop[2] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Georgia voice popop.mp3');
    audioPop[3] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop1.mp3');
    audioPop[4] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop2.mp3');
    audioPop[5] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop3.mp3');
    audioPop[6] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop4.mp3');
    audioPop[7] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop5.mp3');
    audioPop[8] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop6.mp3');
    audioPop[9] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop7.mp3');
    audioPop[10] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Simmy pop1.mp3');
    audioPop[11] = createAudio('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Simmy pop2.mp3');

}

function mousePressed() {
    let b = new Bubble(mouseX, mouseY, 30);
    bubbles.push(b);
}

function draw() {
    // Draw the background
    background(30);

    // Draw the bubbles, and remove the dead ones
    for (i = 0; i < bubbles.length; i++) {
        if (bubbles[i].alive) {
            // Draw bubble if alive
            bubbles[i].draw();
        } else {
            // Remove bubble from array if dead and re-check id
            bubbles.splice(i, 1);
            i--;
        }
    }

    // Bubble counter
    textSize(32);
    fill('grey');
    text(bubbles.length, 10, 35);
}

class Bubble {
    constructor(x, y, size, colour = 'grey', velocityMax = 50) {
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
        this.wander();
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
        if (millis() > this.timeImmunity && this.alive) {
            this.colour = 'white';
            this.deathVector.set(mouseX - this.position.x, mouseY - this.position.y);
            if (this.deathVector.mag() < (this.size / 2)) {
                this.alive = false;
                audioPop[random(0, audioPop.length)].play();
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