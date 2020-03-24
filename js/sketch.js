console.log('Why hello there you snooping my code');
// TODO
// - Add virus convert feature
// - Add timer
// - Make difficuilty increase


let bubbles = [];
let countVirus = 0;
let countCell = 40;
let audioLibrary = [];
let font;

let colourBackground = 'rgb(255, 168, 168)'
let colourMouse = 'white';
let colourCell = 'rgb(143, 218, 255)';
let colourVirus = 'red';

let sizeMouse = 20;
let sizeCell = 30;
let sizeVirus = 25;

let timeGameStart;
let timeGameOld;
let timeDuration;
let timeVirus = 1000;

let gameState = 0;
// 0 - start screen
// 1 - playing screen
// 2 - end of game screen

function preload() {
    // audioLibrary[0] = loadSound('./audio/Fraser pop1.mp3');
    // audioLibrary[1] = loadSound('./audio/Reamonn pop1.mp3');
    // audioLibrary[2] = loadSound('./audio/Reamonn pop2.mp3');
    // audioLibrary[3] = loadSound('./audio/Reamonn pop3.mp3');
    // audioLibrary[4] = loadSound('./audio/Reamonn pop4.mp3');
    // audioLibrary[5] = loadSound('./audio/Reamonn pop5.mp3');
    // audioLibrary[6] = loadSound('./audio/Reamonn pop6.mp3');
    audioLibrary[0] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Fraser pop1.mp3');
    audioLibrary[1] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop1.mp3');
    audioLibrary[2] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop2.mp3');
    audioLibrary[3] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop3.mp3');
    audioLibrary[4] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop4.mp3');
    audioLibrary[5] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop5.mp3');
    audioLibrary[6] = loadSound('https://raw.githubusercontent.com/frasersab/BubblePop/master/audio/Reamonn pop6.mp3');

    //font = loadFont('./fonts/OpenSans-Regular.ttf');
    font = loadFont('Calibri');
}

// -- Setup --
function setup() {
    let canvas = createCanvas(600, 400);
    frameRate(60);
    noCursor();
    textFont(font);
    strokeWeight(1);
    stroke(60);

    for (i = 0; i < countCell; i++) {
        let b = new Bubble(
            random(sizeCell / 2, width - (sizeCell / 2)),
            random(sizeCell / 2, height - (sizeCell / 2)),
            sizeCell,
            sizeMouse,
            colourCell);
        bubbles.push(b);
    }
}

// -- Mouse Pressed --
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

// -- Draw --
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

        // do each bubble intersection check, draw and delete dead bubbles
        for (i = 0; i < bubbles.length; i++) {
            // check for intersection with other bubbles (do not check self or already checked combos)
            for (j = i; j < bubbles.length; j++) {
                if (j == i) { continue; }
                // check for intersection between bubble[i] and bubble[j]
                if (bubbles[i].intersects(bubbles[j])) {
                    // i is cell, j is virus
                    if ((bubbles[i].type == 'cell') && (bubbles[j].type == 'virus')) {
                        bubbles[i].type = 'virus';
                        bubbles[i].size = sizeVirus;
                        bubbles[i].colour = colourVirus;
                        countCell--;
                        countVirus++;
                    }
                    // i is virus, j is cell
                    else if (bubbles[i].type == 'virus' && bubbles[j].type == 'cell') {
                        bubbles[j].type = 'virus';
                        bubbles[j].size = sizeVirus;
                        bubbles[j].colour = colourVirus;
                        countCell--;
                        countVirus++;
                    }
                }
            }
            if (bubbles[i].alive) {
                // draw bubble if alive
                bubbles[i].sizeMouse = sizeMouse;
                bubbles[i].draw();
            } else {
                if (bubbles[i].type == 'virus') {
                    countVirus--;
                }
                if (bubbles[i].type == 'cell') {
                    countCell--;
                    sizeMouse += 3;
                }
                // remove bubble from array if dead and reset i counter
                bubbles.splice(i, 1);
                i--;
            }
        }

        // bring in virus
        if (millis() - timeGameOld >= timeVirus) {
            timeVirus = 3000;
            let v = new Bubble(
                random(sizeVirus / 2, width - (sizeVirus / 2)),
                random(sizeVirus / 2, height - (sizeVirus / 2)),
                sizeVirus,
                sizeMouse,
                colourVirus,
                'virus');
            bubbles.push(v);
            countVirus++;
            timeGameOld = millis();
        }

        push()
        fill('grey');
        textSize(20);
        textAlign(LEFT, TOP);
        text(countCell, 10, 10);
        pop()

        if (countCell < 15) {
            gameState = 2;
            timeDuration = int((millis() - timeGameStart) / 1000);
        }
    }

    // --end of game--
    else if (gameState == 2) {
        // draw the background
        background(colourBackground);

        push()
        fill('White');
        textAlign(CENTER, CENTER);

        textSize(50);
        text('You died', width / 2, height / 2);

        textSize(30);

        text('You lasted: ' + timeDuration + 's', width / 2, (height / 2) + 40);
        pop()
    }

    // draw white blood cell (mouse)
    fill(colourMouse);
    ellipse(mouseX, mouseY, sizeMouse);
}