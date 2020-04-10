console.log('Why hello there you snooping my code');

// game variables
let bubbles = [];
let countVirus = 0;
const cellNumStart = 40;
const cellNumberDeath = 18;
let countCell = cellNumStart;
let audioLibrary = [];
let font;
let posMouseX;
let posMouseY;
let randomSpeed;

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
let colourVirus2 = 'rgb(50, 50, 50)';
let colourVirus3 = 'rgb(252, 186, 3)';

// sizes
const sizeMouseStart = 25;
let sizeMouse = sizeMouseStart;
let sizeCell = 30;
let sizeVirus = 25;
let sizeVirus2 = 18;
let sizeVirus3 = 40;

// timers
let timeGameStart;
let timeVirusOld;
let timeVirus2Old;
let timeVirus3Old;
let timeRegenOld;
let timeDuration;

let noInitialVirus;
let timeVirus = 2500;
let timeVirus2 = 10000;
let timeVirus3 = 8000;
let timeVirusEnter = 2;
let timeVirus2Enter = 20;
let timeVirus3Enter = 45;
let timeRegen = 10000;

let spacePause = false;
let spacePauseTime = 3000;
let timePauseStart;
let spacePauseCounter;
const spacePauseMax = 3;

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
            timeVirus2Old = 0;
            timeVirus3Old = 0;
            timeRegenOld = 0;
            timePauseStart = 0;
            spacePauseCounter = spacePauseMax;
            noInitialVirus = true;


            bubbles = [];                   // remove all cells
            sizeMouse = sizeMouseStart;     // reset mouse size
            countCell = cellNumStart;       // reset countCell

            // generate cells

            for (i = 0; i < cellNumStart; i++) {
                randomSpeed = random(20, 60);
                let b = new Bubble(
                    random(sizeCell / 2, width - (sizeCell / 2)),
                    random(sizeCell / 2, height - (sizeCell / 2)),
                    sizeCell,
                    sizeMouse,
                    colourCell,
                    'cell',
                    randomSpeed);
                bubbles.push(b);
            }
        }

        // playing screen
        else if (gameState == 1) {

        }
    }
}

function keyPressed() {
    // Spacebar
    if ((keyCode == 32) && !spacePause) {
        if (spacePauseCounter >= 1) {
            spacePause = true;
            timePauseStart = millis();
            spacePauseCounter--;
        }
    }
}

// -- Draw --
function draw() {
    // draw the background
    background(colourBackground);

    // draw white blood cell (mouse)
    push();
    fill(colourMouse);
    if (gameState == 1) {
        posMouseX = constrain(mouseX, 0 + (sizeMouse / 2), gameWidth - (sizeMouse / 2));
        posMouseY = constrain(mouseY, 0 + (sizeMouse / 2), gameHeight - (sizeMouse / 2));
    } else {
        posMouseX = constrain(mouseX, 0 + (sizeMouse / 2), width - (sizeMouse / 2));
        posMouseY = constrain(mouseY, 0 + (sizeMouse / 2), height - (sizeMouse / 2));
    }
    ellipse(posMouseX, posMouseY, sizeMouse);
    pop();

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
        // calculate time duration
        timeDuration = int((millis() - timeGameStart) / 1000);

        // do bubble intersection check, draw and delete dead bubbles
        for (i = 0; i < bubbles.length; i++) {
            // check for intersection with other bubbles (do not check self or already checked combos)
            for (j = i; j < bubbles.length; j++) {
                if (j == i) { continue; }
                // check for intersection between bubble[i] and bubble[j]
                if (bubbles[i].intersects(bubbles[j])) {
                    // normal virus
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
                    // Virus 2 or 3
                    // i is cell, j is virus
                    if ((bubbles[i].type == 'cell') && ((bubbles[j].type == 'virus2') || ((bubbles[j].type == 'virus3')))) {
                        // bubbles[i].type = 'virus2';
                        // bubbles[i].size = sizeVirus2;
                        // bubbles[i].colour = colourVirus2;
                        bubbles[i].alive = false;
                        audioLibrary[Math.trunc(random(0, audioLibrary.length))].play();
                        //countCell--;
                        //countVirus++;
                    }
                    // i is virus, j is cell
                    else if ((bubbles[j].type == 'cell') && ((bubbles[i].type == 'virus2') || ((bubbles[i].type == 'virus3')))) {
                        // bubbles[j].type = 'virus2';
                        // bubbles[j].size = sizeVirus2;
                        // bubbles[j].colour = colourVirus2;
                        bubbles[j].alive = false;
                        audioLibrary[Math.trunc(random(0, audioLibrary.length))].play();
                        //countCell--;
                        //countVirus++;
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
                    sizeMouse += sizeMouse / 90;
                }
                // remove bubble from array if dead and reset i counter
                bubbles.splice(i, 1);
                i--;
            }
        }

        // bring in virus
        if ((millis() - timeVirusOld >= timeVirus) || (((timeDuration >= timeVirusEnter)) && noInitialVirus)) {
            noInitialVirus = false;
            randomSpeed = random(40, 60);
            let v = new Bubble(
                random(sizeVirus / 2, width - (sizeVirus / 2)),
                random(sizeVirus / 2, height - (sizeVirus / 2)),
                sizeVirus,
                sizeMouse,
                colourVirus,
                'virus',
                randomSpeed);
            bubbles.push(v);
            countVirus++;
            timeVirusOld = millis();
        }

        // bring in virus2
        if ((millis() - timeVirus2Old >= timeVirus2) && (timeDuration >= timeVirus2Enter)) {
            randomSpeed = random(50, 80);
            let v = new Bubble(
                random(sizeVirus2 / 2, width - (sizeVirus2 / 2)),
                random(sizeVirus2 / 2, height - (sizeVirus2 / 2)),
                sizeVirus2,
                sizeMouse,
                colourVirus2,
                'virus2',
                randomSpeed);
            bubbles.push(v);
            countVirus++;
            timeVirus2Old = millis();
        }

        // bring in virus3
        if ((millis() - timeVirus3Old >= timeVirus3) && (timeDuration >= timeVirus3Enter)) {
            randomSpeed = random(50, 80);
            let v = new Bubble(
                random(sizeVirus3 / 2, width - (sizeVirus3 / 2)),
                random(sizeVirus3 / 2, height - (sizeVirus3 / 2)),
                sizeVirus3,
                sizeMouse,
                colourVirus3,
                'virus3',
                randomSpeed);
            bubbles.push(v);
            countVirus++;
            timeVirus3Old = millis();
        }

        // regenerate a cell
        randomSpeed = random(20, 60);
        if ((millis() - timeRegenOld >= 1000) && (countCell < cellNumStart)) {
            let b = new Bubble(
                random(sizeCell / 2, width - (sizeCell / 2)),
                random(sizeCell / 2, height - (sizeCell / 2)),
                sizeCell,
                sizeMouse,
                colourCell,
                'cell',
                randomSpeed);
            bubbles.push(b);

            countCell++;
            timeRegenOld = millis();
        }

        if (countCell < cellNumberDeath) {
            gameState = 2;
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
        text(timeText, 475, (height - gameTextHeight) + gameTextHeight / 2);

        // health Bar
        fill('red');
        rect(90, healthBarCorner, healthBarWidth, healthBarHeight);

        fill('green');
        rect(90, healthBarCorner, healthBarWidth * ((countCell - cellNumberDeath + 1) / (cellNumStart - cellNumberDeath + 1)), healthBarHeight);

        // pause numbers
        fill('white');
        if (spacePauseCounter >= 1) {
            rect(405, healthBarCorner, 15, healthBarHeight);
        }
        if (spacePauseCounter >= 2) {
            rect(425, healthBarCorner, 15, healthBarHeight);
        }
        if (spacePauseCounter >= 3) {
            rect(445, healthBarCorner, 15, healthBarHeight);
        }
        pop()

        if (timeDuration > 30) {
            //timeVirus = 2500;
        }
        else if (timeDuration > 60) {
            //timeVirus = 2000;
            timeVirus2 = 8000;
            timeVirus3 = 7000;
        }
        else if (timeDuration > 90) {
            //timeVirus = 2000;
            timeVirus2 = 7500;
            timeVirus3 = 6500;
        }
        else if (timeDuration > 120) {
            timeVirus = 2000;
            timeVirus2 = 6500;
            timeVirus3 = 5500;
        }
        else if (timeDuration > 150) {
            timeVirus = 2000;
            timeVirus2 = 6000;
            timeVirus3 = 5000;
        }
        else if (timeDuration > 180) {
            timeVirus = 1000;
            timeVirus2 = 6000;
            timeVirus3 = 5000;
        }

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