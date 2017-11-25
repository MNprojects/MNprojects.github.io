// General set up
var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback, 1000/100) 
};


var canvas = document.getElementById('jsGameApp');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
context.font = "30px Impact";
//context.
function ScoreCard() {
    this.x = 280;
    this.y = 30;
    this.player1Score = 0;
    this.player2Score = 0;
    
}


window.onload = function(){
document.body.appendChild(canvas);
animate(step);
};

var step = function() {
update();
render();
animate(step);
};



// Defining the classes
function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.speedX = 0;
this.speedY = 0;
}

Paddle.prototype.render = function() {
context.fillStyle = "#FF0000";
context.fillRect(this.x, this.y, this.width, this.height);
};



function Player() {
this.paddle = new Paddle(10,175,8,55);
}

function Computer() {
this.paddle = new Paddle(582,175,8,55)
}

function Ball(x, y) {
this.x = x;
this.y = y;
this.speedX = -3;
this.speedY = 0;
this.radius = 5;
}


Player.prototype.render = function() {
this.paddle.render();
};

Computer.prototype.render = function() {
this.paddle.render();
};

Ball.prototype.render = function() {
context.beginPath();
context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
context.fillStyle = "#000000";
context.fill();
};

ScoreCard.prototype.render = function() {
    context.fillText(this.player1Score + ":" + this.player2Score, this.x, this.y);
    
}

// create objects of the classes
var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);
var scorecard = new ScoreCard();


// render the objects
var render = function() {
context.fillStyle = "#c6feff";
context.fillRect(0,0,width,height);
player.render();
computer.render();
ball.render();
scorecard.render();

};

Ball.prototype.update = function(paddle1, paddle2) {
this.x += this.speedX;
this.y += this.speedY;
// matches the radius of the ball so the edges of the ball hit the paddles rather than the centre
var topX = this.x - 5;
var topY = this.y - 5;
var bottomX = this.x + 5;
var bottomY = this.y + 5;

//ball hits the bottom wall
if(this.y - 5 < 0){
    this.y = 5;
    this.speedY = -this.speedY;
} else if(this.y + 5 > 400){ 
    //ball hits the top wall
    this.y = 395;
    this.speedY = -this.speedY;
}

//a point was scored 
if(this.x < 0) {
    this.speedY = 0;
    this.speedX = -3;
    this.y = 200;
    this.x = 300;
    scorecard.player2Score += 1;
} else if(this.x > 600) {
    this.speedY = 0;
    this.speedX = -3;
    this.y = 200;
    this.x = 300;
    scorecard.player1Score += 1;
}

if(topX < 300) {
    if(topY < (paddle1.y + paddle1.height) && bottomY > paddle1.y && topX < (paddle1.x + paddle1.width) && bottomX > paddle1.x) {
      // hit the player's paddle
      if(this.speedX < -15) {
          this.speedX = -(this.speedX);
          this.speedY += (paddle1.speedY / 2);
          this.x += this.speedX;
      } else {
      this.speedX = -(this.speedX)+0.5;
      this.speedY += (paddle1.speedY / 2);
      this.x += this.speedX;
    }
    }
  } else {
    if(topY < (paddle2.y + paddle2.height) && bottomY > paddle2.y && topX < (paddle2.x + paddle2.width) && bottomX > paddle2.x) {
      // hit the computer's paddle
      if(this.speedX > 10) {
        this.speedX = -(this.speedX)
        this.speedY += (paddle2.speedY / 3);
        this.x += this.speedX;
      } else {
        this.speedX = -(this.speedX)-0.5;
        this.speedY += (paddle2.speedY / 3);
        this.x += this.speedX;
      }
    }
}
};


// Player movements. 38 = Up arrow key. 40 = down key.
var keysDown = {};

window.addEventListener("keydown", function(event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
for(var key in keysDown) {
    var value = Number(key);
    if(value === 38) {
        this.paddle.move(0, -5);
    } else if (value === 40) {
    this.paddle.move(0, 5);
    } else {
    // resets the y momentum that is passed to the ball on returning it.
    this.paddle.move(0,0);
    }
}

};

ScoreCard.prototype.update = function() {
    this.render();
}

Paddle.prototype.move = function(x, y) {
this.x += x;
this.y += y;
this.speedX = x;
this.speedY = y;
if(this.y < 0) { // all the way to the left
this.y = 0;
this.speedY = 0;
} else if (this.y + this.height > 400) { // all the way to the right
this.y = 400 - this.height;
this.speedY = 0;
}
}


// AI controls - tries to line the middle of the paddle with the centre of the ball.
Computer.prototype.update = function(ball) {
var y_pos = ball.y;
var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
if(diff < 0 && diff < -4) { // max speed left, same as the player
  diff = -5;
} else if(diff > 0 && diff > 4) { // max speed right
  diff = 5;
}
this.paddle.move(0, diff);
if(this.paddle.y < 0) {
  this.paddle.y = 0;
} else if (this.paddle.y + this.paddle.height > 400) {
  this.paddle.y = 400 - this.paddle.height;
}
};


var update = function() {
player.update();
computer.update(ball);
ball.update(player.paddle, computer.paddle);
};