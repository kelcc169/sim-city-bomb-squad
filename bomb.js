console.log('loaded!');

//variables
const STARTING_TIME = 30;
var gameOver = true;
var remainingTime = 0;
var delayHandle = null;
var timerHandle = null;

var wiresToCut = [];
var wiresCut = {
    blue: false,
    green: false,
    red: false,
    white: false,
    yellow: false
};

//DOM references
var timerText;
var startBtn;
var resetBtn;
var wireBox;

//Event Listeners
document.addEventListener('DOMContentLoaded', function(e) {
    timerText = document.getElementById('timertext');
    startBtn = document.getElementById('start');
    resetBtn = document.getElementById('reset');
    wireBox = document.getElementById('wirebox');
    resetBtn.disabled = true;

    startBtn.addEventListener('click', function (e) {
        timerHandle = setInterval(updateClock, 1000);
        initGame();
        startBtn.disabled = true;
        timerText.classList.add('red')
        timerText.classList.remove('green')
    });

    resetBtn.addEventListener('click', function (e) {
        reset();
    });

    wireBox.addEventListener('click', function (e) {
        if (!wiresCut[e.target.id] && !gameOver) {
            //change the image
            e.target.src = "img/cut-" + e.target.id + "-wire.png";
            //mark as cut
            wiresCut[e.target.id] = true;
            //was it correct?
            var wireIndex = wiresToCut.indexOf(e.target.id);
            if (wireIndex > -1) {
                console.log(e.target.id + " was correct")
                wiresToCut.splice(wireIndex, 1);
                if (checkForWin()) {
                    endGame(true);
                }
            } else {
                console.log(e.target.id + " was incorrect")
                delayhandle = setTimeout(function() {
                    endGame(false);
                    console.log("boom!");
                }, 750);
            }
        }
    });
});

//functions!
function checkForWin() {
    //if the wiresToCut is empty
    return wiresToCut.length ? false : true;
}

function endGame(win) {
    //clear the timers
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    //change the game to over
    gameOver = true;
    //enable reset button
    resetBtn.disabled = false;
    //win/lose scenarios
    if (win) {
        console.log("you saved the city! like Batman!");
        timerText.classList.remove('red');
        timerText.classList.add('green');
    } else {
        console.log('oops');
        document.body.classList.remove('unexploded');
        document.body.classList.add('exploded');
    };
};

function updateClock() {
    remainingTime--;
    if (remainingTime <= 0) {
        endGame(false);
    };
    timerText.textContent = "0:00:" + remainingTime;
};

function initGame() {
    gameOver = false;
    //empty array
    wiresToCut.length = 0;
    //set time
    remainingTime = STARTING_TIME;
    timerText.textContent = "0:00:" + remainingTime;
    //populate wiresToCut with wires
    for (let wire in wiresCut) {
        var rand = Math.random();
        if (rand > 0.5) {
            wiresToCut.push(wire);
        }
    }
    console.log(wiresToCut);
    resetBtn.disabled = true;
    startBtn.disabled = false;
};

function reset() {
    gameOver = false;
    var wireImages = wirebox.children;
    for (let i = 0; i < wireImages.length; i++) {
        wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png"
    }
    document.body.classList.add('unexploded');
    document.body.classList.remove('exploded')
    timerText.classList.add('green')
    timerText.classList.remove('red')
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    for (let wire in wiresCut) {
        wiresCut[wire] = false;
    }
    initGame();
} 