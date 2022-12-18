var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

var score = 0;


var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// setInterval (function (){
//      ctx.clearRect(0, 0, width, height);
//      score++;
//      drawScore();
// }, 100);

function drawBorder (){
     ctx.fillStyle = "Gray";
     ctx.fillRect(0, 0, width, blockSize);
     ctx.fillRect(0, height - blockSize, width, blockSize);
     ctx.fillRect(0, 0, blockSize, height);
     ctx.fillRect(width - blockSize, 0, blockSize, height);
};

function drawScore (){
     ctx.font = "20px Courier";
     ctx.fillStyle = "White";
     ctx.textAlign = "left";
     ctx.textBaseline = "top";
     ctx.fillText("Score" + score, blockSize, blockSize);
};

function gameOver (){
     ctx.font = "60px Courier";
     ctx.fillStyle = "Red";
     ctx.textAlign = "center";
     ctx.textBaseline = "middle";
     ctx.fillText("GAME OVER", width/2, height/2);
     playing = false;
};

var circle = function (x, y, radius, fillCircle) {
     ctx.beginPath();
     ctx.arc(x, y, radius, 0, Math.PI * 2, false);
     if (fillCircle) {
          ctx.fill();
     } else {
          ctx.stroke();
     }
};

var Block = function (col, row){
     this.col = col;
     this.row = row;
};

Block.prototype.drawSquare = function (color){
     var x = this.col * blockSize;
     var y = this.row * blockSize;
     ctx.fillStyle = color;
     ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color){
     var centerX = this.col * blockSize + blockSize / 2;
     var centerY  = this.row * blockSize + blockSize / 2;
     ctx.fillStyle = color;
     circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock){
     return this.col === otherBlock.col && this.row === otherBlock.row;
};


var Snake = function (){
     this.segments = [
          new Block(7,5),
          new Block(6,5),
          new Block (5,5)
     ];
     this.direction = "right";
     this.nextDirection = "right";
};

var arrayColorsPar = ["Yellow", "Red", "SkyBlue", "Blue"];
var arrayColorsNePar = ["White", "Green", "Pink", "Purple"];

     var colorPar = arrayColorsPar[Math.floor(Math.random() * 4)];
     var colorNePar = arrayColorsNePar[Math.floor(Math.random() * 4)];

Snake.prototype.draw = function () {
     this.segments[0].drawSquare("Green");
     for (var i = 1; i < this.segments.length; i++){
          if(i % 2 == 0){
               this.segments[i].drawSquare(colorPar);
          } else if (i % 2 !== 0){
               this.segments[i].drawSquare(colorNePar);
          }
          
     }
};

Snake.prototype.move = function (){
     var head = this.segments[0];
     var newHead;

     this.direction = this.nextDirection;

     if (this.direction === "right"){
          newHead = new Block(head.col + 1, head.row);
     } else if (this.direction === "down"){
          newHead = new Block(head.col, head.row + 1);
     } else if (this.direction === "left"){
          newHead = new Block(head.col - 1, head.row);
     } else if (this.direction ==="up"){
          newHead = new Block(head.col, head.row - 1);
     }

     if (this.checkCollision(newHead)) {
          gameOver();
          return;
     }

     this.segments.unshift(newHead);

     if (newHead.equal(apple.position)){
          score++;
          animationTime -=5;
          apple.move(this.segments);
     } else {
          this.segments.pop();
     }
};


Snake.prototype.checkCollision = function (head){
     var leftCollision = (head.col === 0);
     var topCollision = (head.row === 0);
     var rigthCollision = (head.col === widthInBlocks - 1);
     var bottomCollision = (head.row === heightInBlocks - 1);

     var wallCollision = leftCollision || topCollision || rigthCollision || bottomCollision;

     var selfCollision = false;

     for (var i = 0; i < this.segments.length; i++){
          if (head.equal(this.segments[i])){
               selfCollision = true;
          }
     }
     return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection){
     if (this.direction === "up" && newDirection === "down") {
          return;
     } else if (this.direction === "right" && newDirection === "left"){
          return;
     } else if (this.direction === "down" && newDirection === "up") {
          return;
     } else if (this.direction === "left" && newDirection === "right"){
          return;
     }

     this.nextDirection = newDirection;
};


var Apple = function (){
     this.position = new Block(10, 10);
};

Apple.prototype.draw = function (){
     this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function (occupiedBlocks){
     var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
     var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
     this.position = new Block(randomCol, randomRow);

     var index = occupiedBlocks.length - 1;
     while (index >= 0){
          if (this.position.equal(occupiedBlocks[index])) {
               this.move(occupiedBlocks);
               return;
          }
          index--;
     }
};

var snake = new Snake();
var apple = new Apple();

var animationTime = 100;
var playing = true;

function gameLoop (){
     ctx.clearRect(0, 0, width, height);
     drawScore();
     snake.move();
     snake.draw();
     apple.draw();
     drawBorder();
     if (playing === true){
          setTimeout(gameLoop, animationTime);
     }
};
     
gameLoop();

var directions = {
     65: "left",
     87: "up",
     68: "right",
     83: "down"
};

$("body").keydown(function (event){
     var newDirection = directions[event.keyCode];
     if (newDirection !== undefined){
          snake.setDirection(newDirection);
     }
});