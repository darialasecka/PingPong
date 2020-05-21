const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const cw = canvas.width;
const ch = canvas.height;

const ballRadius = 10;
let ballX;// = cw / 2;
let ballY;// = ch / 2;
let ballSpeedX;// = 5;
let ballSpeedY;// = 5;

const playerWidth = 10;
const playerHeight = 100;
const player1X = 20;
const player2X = cw - playerWidth - 20;

let player1Y;// = (ch - playerHeight)/2;
let player2Y;// = (ch - playerHeight)/2;

var player1Points;// = 0;
var player2Points;// = 0;

const playerSpeed = 15;

var gameOver = true;

//set default values before every game
function setDefault(){
    ballX = cw / 2;
    ballY = ch / 2;
    ballSpeedX = 3.5;
    ballSpeedY = 3.5;

    player1Y = (ch - playerHeight)/2;
    player2Y = (ch - playerHeight)/2;

    randomizeBallDirection();

    player1Points = 0;
    player2Points = 0;
}

//draw background
function background() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cw, ch);

    //dotted line
    for(let linePosition = 10; linePosition < ch; linePosition += 15) {
        ctx.fillStyle = 'grey';
        ctx.fillRect((cw - 2)/2, linePosition, 2, 10)
    }
}

//draw ball, collision, counting points, ball movement
function ball() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    if (ballX >= cw - ballRadius) {
        player1Points ++;
        nextRound();
        if(player1Points == 3) gameOver = true;
    }
    if (ballX <= ballRadius) {
        player2Points ++;
        nextRound();
        if(player2Points == 3) gameOver = true;
    }
    if (ballY <= ballRadius || ballY >= ch - ballRadius) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }

    if (ballX <= player1X + playerWidth && ballY > player1Y && ballY < player1Y + playerHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX >= player2X - playerWidth && ballY > player2Y && ballY < player2Y + playerHeight) {
        ballSpeedX = -ballSpeedX;
    }


    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

window.addEventListener('keydown', movement);

function movement(e) {
    var key = e.key;
    //determining playing with keyboard or mouse
    if((key == "ArrowLeft" || key == "ArrowRight") && gameOver) {
        if(movementWith.localeCompare("mouse") == 0) movementWith = "keyboard";
        else movementWith = "mouse";
        init();
    }
    //move player if playing with keyboard
    if(!gameOver && movementWith.localeCompare("keyboard") == 0){
        if(key == "w" || key == "ArrowUp") { //w - up
            player1Y -= playerSpeed;
        }
        if (key == "s" || key == "ArrowDown") { //s - down
            player1Y += playerSpeed;
        }

        if (player1Y <= 0) {
            player1Y = 0;
        }
        if (player1Y >= ch - playerHeight) {
            player1Y = ch - playerHeight;
        }

    }
}

canvas.addEventListener("mousemove", playerPosition);

var topCanvas = canvas.offsetTop + playerHeight / 2; //to control the middle of player

//manage movement if chooden mouse
function playerPosition(evt) {
    if(!gameOver && movementWith.localeCompare("mouse") == 0){
        player1Y = evt.clientY - topCanvas;

        if (player1Y <= 0) {
            player1Y = 0;
        }
        if (player1Y >= ch - playerHeight) {
            player1Y = ch - playerHeight;
        }
    }
}

//draw player1
function player1() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player1X, player1Y, playerWidth, playerHeight)
}

//draw player2 - CPU
function player2() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(player2X, player2Y, playerWidth, playerHeight)
}

//speed up ball movement
function speedUp() {
    let speed = 0.1

    //when ball is slower it's accelerates faster
    if(ballSpeedX >= 5) speed = 0.1;
    else speed = 0.4;

    if (ballSpeedX > 0 && ballSpeedX < 10) {
        ballSpeedX += speed;
    } else if (ballSpeedX < 0 && ballSpeedX > -10) {
        ballSpeedX -= speed;
    }

    if (ballSpeedY > 0 && ballSpeedY < 10) {
        ballSpeedY += speed;
    } else if (ballSpeedY < 0 && ballSpeedY > -10) {
        ballSpeedY -= speed;
    }
}

//simple CPU AI
function CPU() {
    const middle = player2Y + playerHeight / 2 ;
    if (ballX > cw / 2) {
        if (middle - ballY > 200) {
            player2Y -= 15;
        } else if (middle - ballY > 50) {
            player2Y -= 6;
        }
        else if (middle - ballY < -200) {
            player2Y += 15;
        } else if (middle - ballY < -50) {
            player2Y += 6;
        }
    } 
    if (ballX <= cw/2 && ballX > 100) {
        if (middle - ballY > 100) {
            player2Y -= 3;
        }
        if (middle - ballY < -100) {
            player2Y += 3;
        }
    }

    if (player2Y <= 0) {
        player2Y = 0;
    }
    if (player2Y >= ch - playerHeight) {
        player2Y = ch - playerHeight;
    }

}

//show points
function points(){
    ctx.fillStyle = 'white'
    ctx.font = "50px bold Arial";
    ctx.textAlign = 'center';
    ctx.fillText(player1Points, cw/4, 50);
    ctx.fillStyle = 'lime';
    ctx.fillText(player2Points, cw/4 * 3, 50);
}

//what needs to happen between every round
function nextRound(){
    background();
    points();
    ballX = cw / 2;
    ballY = ch / 2;
    ballSpeedX = 3.5;
    ballSpeedY = 3.5;

    player1Y = (ch - playerHeight)/2;
    player2Y = (ch - playerHeight)/2;
    randomizeBallDirection();
}

function randomizeBallDirection() { //otherwise always started moving to bottom right
    let x = Math.round(Math.random());
    let y = Math.round(Math.random())

    if(x == 1) ballSpeedX = -ballSpeedX;
    if(y == 1) ballSpeedY = -ballSpeedY;
}

//what to show after game ended
function gameOver() {

}

//repeat every frame
function game() {
    background();
    ball();
    player1();
    player2();
    CPU();
    points();
    if(gameOver == true) {
        clearInterval(loop);

        ctx.fillStyle = 'white'
        ctx.font = "30px bold Arial";
        ctx.textAlign = 'center';
        ctx.fillText("Game Over!", cw/2, ch/2 - 35);
        ctx.fillText(player1Points + " / " + player2Points, cw/2, ch/2);
        ctx.font = "15px bold Arial";
        ctx.fillText("Press space to restart", cw/2, ch/2 + 20);

        ctx.fillText("Press right/left arrow to change beetween kayboard and mouse", cw/2, ch/2 + 50);
        ctx.fillText("Currentyl using " + movementWith, cw/2, ch/2 + 65);
    }
}

let loop;
window.addEventListener('keypress', start)

let movementWith = "mouse"; //default value


//start game if space is pressed
function start (e) {
    var key = e.key;

    if(key == " " && gameOver){
        setDefault();
        gameOver = false;
        loop = setInterval(game, 1000/60);
    }
}

//starting screen
function init() {
    setDefault();
    background();
    player1();
    player2();
    points();

    ctx.fillStyle = 'white'
    ctx.font = "20px bold Arial";
    ctx.textAlign = 'center';
    ctx.fillText("First to 3 points wins!", cw/2, ch/2 - 20);
    ctx.font = "15px bold Arial";
    ctx.fillText("Press space to start", cw/2, ch/2);

    ctx.fillText("Press right/left arrow to change beetween kayboard and mouse", cw/2, ch/2 + 50);
    ctx.fillText("Currentyl using " + movementWith, cw/2, ch/2 + 65);

}

init();

