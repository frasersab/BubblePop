console.log('Why hello there you snooping my code');

// game variables
let bubbles = [];
let countVirus = 0;
const cellNumStart = 40;
const cellNumberDeath = 15;
let countCell = cellNumStart;
let audioLibrary = [];
let font;

// game sizes
const gameWidth = 600;
const gameHeight = 400;
const gameTextHeight = 40;
const healthBarWidth = 300;
const healthBarHeight = 20;
const healthBarCorner = ((gameHeight + (gameTextHeight / 2)) - (healthBarHeight / 2));

// colours
let colourBackground = 'rgb(255, 168, 168)';
let colourBackgroundText = 'rgb(205, 118, 118)';
let colourMouse = 'white';
let colourCell = 'rgb(143, 218, 255)';
let colourVirus = 'red';

// sizes
let sizeMouse = 20;
let sizeCell = 30;
let sizeVirus = 25;

// timers
let timeGameStart;
let timeVirusOld;
let timeRegenOld;
let timeDuration;
let timeVirus = 1000;
let timeRegen = 10000;

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
    font = 'Calibri';
}

// -- Setup --
function setup() {
    let canvas = createCanvas(gameWidth, gameHeight + gameTextHeight);
    frameRate(60);
    noCursor();
    textFont(font);
    strokeWeight(1);
    stroke(60);
}

// -- Mouse Pressed --
function mousePressed() {
    // check if in canvas
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        // start screen or end screen
        if (gameState == 0 || gameState == 2) {
            gameState = 1;
            timeGameStart = millis();
            timeVirusOld = 0;
            timeRegenOld = 0;


            bubbles = [];                   // remove all cells
            sizeMouse = 20;                 // reset mouse size
            countCell = cellNumStart;       // reset countCell

            // generate cells
            for (i = 0; i < cellNumStart; i++) {
                let b = new Bubble(
                    random(sizeCell / 2, width - (sizeCell / 2)),
                    random(sizeCell / 2, height - (sizeCell / 2)),
                    sizeCell,
                    sizeMouse,
                    colourCell);
                bubbles.push(b);
            }
        }

        // playing screen
        else if (gameState == 1) {

        }
    }
}

// -- Draw --
function draw() {
    // draw the background
    background(colourBackground);
    // draw white blood cell (mouse)
    fill(colourMouse);
    ellipse(mouseX, mouseY, sizeMouse);
    // --start screen--
    if (gameState == 0) {
        push();
        fill('White');
        textSize(50);
        textAlign(CENTER, CENTER);

        text('Click to Start', width / 2, height / 2);
        pop();

    }

    // --playing screen--
    else if (gameState == 1) {
        // do bubble intersection check, draw and delete dead bubbles
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
        if (millis() - timeVirusOld >= timeVirus) {
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
            timeVirusOld = millis();
        }

        // regenerate a cell
        if ((millis() - timeRegenOld >= 1000) && (countCell < cellNumStart)) {
            let b = new Bubble(
                random(sizeCell / 2, width - (sizeCell / 2)),
                random(sizeCell / 2, height - (sizeCell / 2)),
                sizeCell,
                sizeMouse,
                colourCell);
            bubbles.push(b);

            countCell++;
            timeRegenOld = millis();
        }

        if (countCell < cellNumberDeath) {
            gameState = 2;
            timeDuration = int((millis() - timeGameStart) / 1000);
        }
        // Game text
        push()
        fill(colourBackgroundText)
        rect(0, height - gameTextHeight, width, gameTextHeight);

        fill('white')
        textAlign(LEFT, CENTER);
        textSize(25);
        text('Health', 10, (height - gameTextHeight) + gameTextHeight / 2);

        timeDuration = int((millis() - timeGameStart) / 1000);
        let timeText = 'Time ' + timeDuration + 's';
        text(timeText, 410, (height - gameTextHeight) + gameTextHeight / 2);

        fill('red');
        rect(90, healthBarCorner, healthBarWidth, healthBarHeight);

        fill('green');
        rect(90, healthBarCorner, healthBarWidth * ((countCell - cellNumberDeath + 1) / (cellNumStart - cellNumberDeath + 1)), healthBarHeight);

        pop()


    }

    // --end of game--
    else if (gameState == 2) {
        push()
        fill('white');
        textAlign(CENTER, CENTER);
        textSize(50);

        text('You died', width / 2, (height / 2) - 40);

        textSize(30);

        text('You lasted: ' + timeDuration + 's', width / 2, (height / 2));
        text('Click to play again', width / 2, (height / 2) + 35);
        pop()
    }
}