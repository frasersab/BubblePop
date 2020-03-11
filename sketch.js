let bubbles = [];

function setup() {
    createCanvas(600, 400);

}

function mousePressed() {
    let b = new Bubble(mouseX, mouseY, 30);
    bubbles.push(b);
}

function draw() {
    background(30);
    for (i = 0; i < bubbles.length; i++) {
        bubbles[i].avoid();
        bubbles[i].show();
    }

}

class Bubble {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    move() {
        //this.x += random(-5, 5);
        //this.y += random(-5, 5);
        this.x = mouseX;
        this.y = mouseY;
    }

    avoid() {
        let length = Math.sqrt(Math.pow((this.x - mouseX), 2) + Math.pow((this.y - mouseY), 2));
        let direction = Math.atan2(this.y - mouseY, this.x - mouseX);

        let lengthAway = 100 / length;
        let directionAway = direction + Math.PI;

        this.x -= constrain((lengthAway * Math.cos(directionAway)) + (Math.random() * 2 - 1), -10, 10);
        this.y -= constrain((lengthAway * Math.sin(directionAway)) + (Math.random() * 2 - 1), -10, 10);

        this.x = constrain(this.x, 30, width - 30);
        this.y = constrain(this.y, 30, height - 30);
    }

    show() {
        ellipse(this.x, this.y, this.r, this.r);
    }
}