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
        bubbles[i].draw();
    }

}

class Bubble {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    move() {
        this.x = mouseX;
        this.y = mouseY;
    }

    avoid() {
        // Calculate polar coordinates of circle to mouse
        let coordPolar = cart2polar(this.x - mouseX, this.y - mouseY);

        // Calculate polar change
        let coordPolarChange = [100 / coordPolar[0], coordPolar[1] + Math.PI];

        // Convert polar change to cartesian
        let coordCartChange = polar2cart(coordPolarChange[0], coordPolarChange[1]);

        // Update position change
        this.x -= constrain(coordCartChange[0], -10, 10);
        this.y -= constrain(coordCartChange[1], -10, 10);

        // Keep from leaving bounds
        this.x = constrain(this.x, this.r, width - this.r);
        this.y = constrain(this.y, this.r, height - this.r);
    }

    draw() {
        ellipse(this.x, this.y, this.r, this.r);
    }
}

function cart2polar(x, y) {
    return [Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), Math.atan2(y, x)];
}

function polar2cart(size, dir) {
    return [size * Math.cos(dir), size * Math.sin(dir)]
}

function random(min = -1, max = 1) {
    return (Math.random() * (max - min)) + min;
}