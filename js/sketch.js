console.log('Why hello there you snooping my code');

let bubbles = [];
let virus = [];
let audioLibrary = [];
let font;

let colourBackground = 'rgb(255, 168, 168)'
let colourMouse = 'white';
let colourCell = 'rgb(143, 218, 255)';
let colourVirus = 'red';

let sizeMouse = 30;
let sizeCell = 30;
let sizeVirus = 25;

let timeGameStart;
let timeGameOld;

let gameState = 0;
// 0 - start screen
// 1 - playing screen
// 2 - end of game screen

function preload() {
    audioLibrary[0] = loadSound('./audio/Fraser pop1.mp3');
    audioLibrary[1] = loadSound('./audio/Reamonn pop1.mp3');
    audioLibrary[2] = loadSound('./audio/Reamonn pop2.mp3');
    audioLibrary[3] = loadSound('./audio/Reamonn pop3.mp3');
    audioLibrary[4] = loadSound('./audio/Reamonn pop4.mp3');
    audioLibrary[5] = loadSound('./audio/Reamonn pop5.mp3');
    audioLibrary[6] = loadSound('./audio/Reamonn pop6.mp3');

    font = loadFont('./fonts/OpenSans-Regular.ttf');
}

function setup() {
    createCanvas(600, 400);
    frameRate(60);
    noCursor();
    textFont(font);
    strokeWeight(1);
    stroke(60);

    for (i = 0; i < 10; i++) {
        let b = new Bubble(
            random(sizeCell / 2, width - (sizeCell / 2)),
            random(sizeCell / 2, height - (sizeCell / 2)),
            sizeCell,
            sizeMouse,
            colourCell);
        bubbles.push(b);
    }
}

function mousePressed() {
    // start screen
    if (gameState == 0) {
        gameState = 1;
        timeGameStart = millis();
        timeGameOld = 0;
    }

    // playing screen
    else if (gameState == 1) {

    }
}

function draw() {
    // --start screen--
    if (gameState == 0) {
        // draw the background
        background(colourBackground);

        fill('White');
        textSize(50);

        textAlign(CENTER, CENTER);
        text('Click to Start', width / 2, height / 2);


    }

    // --playing screen--
    else if (gameState == 1) {
        // draw the background
        background(colourBackground);

        // draw the bubbles, and remove the dead ones
        for (i = 0; i < bubbles.length; i++) {
            if (bubbles[i].alive) {
                // draw bubble if alive
                bubbles[i].draw();
            } else {
                // remove bubble from array if dead and reset i counter
                bubbles.splice(i, 1);
                i--;
            }
        }

        // draw the virus, and remove the dead ones
        for (i = 0; i < virus.length; i++) {
            if (virus[i].alive) {
                // draw bubble if alive
                virus[i].draw();
            } else {
                // remove bubble from array if dead and reset i counter
                virus.splice(i, 1);
                i--;
            }
        }

        // bring in virus
        if (millis() - timeGameOld >= 1000) {
            let v = new Bubble(
                random(sizeVirus / 2, width - (sizeVirus / 2)),
                random(sizeVirus / 2, height - (sizeVirus / 2)),
                sizeVirus,
                sizeMouse,
                colourVirus);
            virus.push(v);
            timeGameOld = millis();
        }

    }

    // --end of game--
    else if (gameState == 2) {
        // draw the background
        background(colourBackground);
    }

    // draw white blood cell (mouse)
    fill(colourMouse);
    ellipse(mouseX, mouseY, sizeMouse);
}