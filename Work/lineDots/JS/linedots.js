var fps = 30;
var dotSpeed = 10;
var dotDis = 30;

/**
*Main
*Base object for all other objects, forces a redraw every frame
**/
function Main($canvasId){

  //Set up reference to main object
  let main = this;

  //Get canvas and set up context
	this.canvas = document.getElementById($canvasId);
	this.canvasX = this.canvas.width;
	this.canvasY = this.canvas.height;
	this.canvasContext = this.canvas.getContext("2d");

  //Create new dotcontroller object
  this.dotController = new DotController();

  //Draw everything
  this.draw = function($canvasContext){

    $canvasContext.fillStyle = 'black';
    $canvasContext.fillRect(0,0,main.canvasX,main.canvasY);

    main.dotController.draw($canvasContext);

    setTimeout(function(){main.draw($canvasContext);}, 1000/fps);
  }

  //Start up the program and trigger the redrawing of frames
  this.initialise = function (){

    //Add an initial amount of dots underneath the dotController
    main.dotController.addDots(100);

    //Start drawing frames
    main.draw(main.canvasContext);

  }

  return main;

}

/**
*Dot Controller
*Object that deals with all of the dots on the screen and draws lines between them
**/
function DotController(){

  let self = this;

  //Array of all dots under this controller
  this.dots = [];

  //Calculate the distance between two points
  this.getDistance = function($point1,$point2){
    var xdis = $point1[0] - $point2[0];
    var ydis = $point1[1] - $point2[1];
    var dis = Math.sqrt(xdis * xdis + ydis * ydis);
    return dis;
  }

  //Add a single dot to the array
  this.addDot = function(){
    var dot = new Dot();
    dot.setPosition([
      Math.floor(Math.random() * 290) + 10,
      Math.floor(Math.random() * 290) + 10]);

    var vel = [];
    if((Math.random() - 0.5) < 0){
      vel[0] = -(Math.random() + 0.5);
    }
    else{
      vel[0] = Math.random() + 0.5;
    }
    if((Math.random() - 0.5) < 0){
      vel[1] = -(Math.random() + 0.5);
    }
    else{
      vel[1] = Math.random() + 0.5;
    }

    dot.setVel(vel);
    self.dots.push(dot);

  }

  //Add a defined amount of dots to the array
  this.addDots = function($num){
    console.log('Adding ' + $num + ' dots');
    for(i = 0; i < $num; i++){
      self.addDot();
    }
    console.log(self.dots.length + ' added');
  }

  //Check distances between given dot and all other dots
  //If distance is sufficient, draw line between them
  this.checkDistances = function($dotReference, $canvasContext){
    let dot1xy = self.dots[$dotReference].getPosition();
    let xdis = null;
    let dot2xy = null;
    let dis = null;
    let opacity = null;

    for(let i = 0; i < self.dots.length; i ++){
      dot2xy = self.dots[i].getPosition();
      xdis = dot1xy[0] - dot2xy[1];

      if(xdis < dotDis || xdis > -dotDis){
        dis = self.getDistance(dot1xy,dot2xy);

        if(dis <= dotDis){
          opacity = 1.1 - (dotDis / dis);
          self.drawLine($canvasContext,dot1xy,dot2xy,opacity);
        }

      }

    }
  }

  //Draw a line between two points
  this.drawLine = function($canvasContext, $point1, $point2, $opacity){
    $canvasContext.strokeStyle = 'white';
    $canvasContext.globalAlpha = $opacity;
    $canvasContext.beginPath();
    $canvasContext.moveTo($point1[0],$point1[1]);
    $canvasContext.lineTo($point2[0],$point2[1]);
    $canvasContext.stroke();
    $canvasContext.globalAlpha = 1;
  }

  //Force all stored dots to draw
  this.draw = function($canvasContext){

    for(i = 0; i < self.dots.length; i ++){
      self.dots[i].draw($canvasContext);
      self.dots[i].move();
      self.checkDistances(i,$canvasContext);
    }
  }

  return self;

}

/**
*Dot
*Simple object to represent a single free floating dot
**/
function Dot(){

  let dot = this;

  //The dot's potition on the axes
  this.x = null;
  this.y = null;

  //The dot's movement on the axes
  this.xVel = null;
  this.yVel = null;

  //Setters and getters for position
  this.setPosition = function($val){dot.x = $val[0];dot.y = $val[1];}
  this.getPosition = function(){return [dot.x,dot.y];}

  //Setters for movement
  this.setVel = function($val){dot.xVel = $val[0];dot.yVel = $val[1];}

  //Method where the dot asks itself where to go next and changes its postition
  //based on its movement
  this.move = function(){
    dot.x += dot.xVel;
    dot.y += dot.yVel;
    //console.log(dot.xVel,dot.yVel)
    dot.checkCollision();
    //setTimeout(function(){dot.move()},1000/dotSpeed);
  }

  //Method to check whether or not this dot has collided with the walls of the
  //area they move in
  this.checkCollision = function(){
    if(dot.x <= 10 && dot.xVel <= 0 || dot.x >= 290 && dot.xVel >= 0 ){
      dot.xVel = dot.xVel * -1;
    }
    if(dot.y <= 10 && dot.yVel <= 0 || dot.y >= 290 && dot.yVel >= 0 ){
      dot.yVel = dot.yVel * -1;
    }
  }

  //Method to draw this dot
  this.draw = function($canvasContext){

    $canvasContext.strokeStyle = 'white';
    $canvasContext.fillStyle = 'white';
    $canvasContext.beginPath();
    $canvasContext.arc(dot.x,dot.y,1,0,2 * Math.PI);
    $canvasContext.fill();
    $canvasContext.stroke();

  }

  return dot;

}
