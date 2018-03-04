var fps = 30;
var $gravity = 1;
var $friction = 1;

console.log('Main.js loaded');

function test(){console.log('Main.js linked successfully');}

/**=========================================================================================================================**/

//MAIN
//Main function to act as
//foundation for the rest
function Main($canvasId){

	console.log('Setting up main class with Id: ' + $canvasId);

	//Set up a reference to the main object
	let main = this;

	//Main variables required to set up class
	this.canvas = document.getElementById($canvasId);
	this.canvasX = this.canvas.width;
	this.canvasY = this.canvas.height;
	this.canvasContext = this.canvas.getContext("2d");

	//Getters and Setters for the CanvasId
	this.getCanvasId = function() {return this.canvasId;}
	this.setCanvasId = function($object) {this.canvasId = $object;}

	//Create a new player object within the main
	this.player = new Player();

	//Create a new inputHandler within main
	this.inputHandler = new inputHandler();
	this.inputHandler.setPlayer(this.player);

	//Create a physics object to handle physics operations
	this.physics = new Physics(this.canvas.width,this.canvas.height);
	this.physics.setPlayer(this.player);

	//Forces a reDraw on the object and all
	//dependant objects below it, thus redrawing
	//the whole screen
	this.reDraw = function($canvasContext){

		//Clear the window before redrawing it
		$canvasContext.clearRect(0, 0, this.canvasX, this.canvasY);

		//Draw the background colour
		$canvasContext.fillStyle = "black";
		$canvasContext.fillRect(0, 0, this.canvasX, this.canvasY);

		//Draw player
		this.player.reDraw($canvasContext);

		//Wait until the next frame and call this function again
		let self = this;
		setTimeout(function () {self.reDraw($canvasContext);}, 1000/fps);
		return self;

	}

	//Set all the requesite variables and jumpstart the recursive
	//functions
	this.initialise = function(){

		console.log('Initializing...');

		//Setup listeners to react to keypresses
		//window.addEventListener('click',function(){console.log('click')});
		window.addEventListener('keydown',main.inputHandler.onKeyDown);
		window.addEventListener('keyup',main.inputHandler.onKeyUp);
		console.log('Created listeners');

		//Start physics engine
		main.physics.engineLoop();
		console.log('Started physics engine');

		//Start drawing everything on screen
		main.reDraw(this.canvasContext);
		console.log('Started drawing frames at ' + fps + ' fps');

		console.log('Initialized');

	}
	return main;
}

/**=========================================================================================================================**/

/**
*PLAYER
*Object that contains all data about the player like coordinates, image location, etc
*Also has internal methods to get and set as well as update postition on screen
**/
function Player(){

	let player = this;

	//Player's coordinates
	this.x = 300;
	this.y = 300;

	//Player's dimensions
	this.height = 10;
	this.width = 10;

	//Player's velocity on the x-axis and y-axis
	this.xVelocity = 0;
	this.yVelocity = 0;

	//Player's acceleration on the x and y axis
	this.xAccel = 0;
	this.yAccel = 0;

	//Player's terminal velocities on each axis
	this.xTerm = 10;
	this.yTerm = 10;

	//Track when player is touching the ground or a wall
	this.touchGround = null;
	this.touchWall = null;

	//Track when player is moving left or right
	this.movingLeft = false;
	this.movingRight = false;

	//Set acceleration flag to start moving left
	this.moveLeft = function(){
		player.movingLeft = true;
	}

	//Set acceleration flag to start moving right
	this.moveRight = function(){
		player.movingRight = true;
	}

	//Set acceleration flag to stop moving left
	this.stopLeft = function(){
		player.movingLeft = false;
	}

	//Set acceleration flag to stop moving right
	this.stopRight = function(){
		player.movingRight = false;
	}

	//Set upwards velocity to jump
	this.jump = function(){
		player.yVelocity = -15;
	}

	this.stop = function(){
		player.xVelocity = 0;
		player.xAccel = 0;
	}

	//Get image for player
	//this.sprite = new Image();
	//this.sprite.src = null;

	//Getter functions to return x and y coordinates
	this.getX = function(){return this.x;}
	this.getY = function(){return this.y;}

	//Draw player
	this.reDraw = function($canvasContext){
		$canvasContext.fillStyle = 'white';
		$canvasContext.fillRect(player.x-player.width/2,player.y-player.height,player.width,player.height);

	}

	return player;

}

/**=========================================================================================================================**/

/**
*PHYSICS
*Object that handles all of the physics in the game
*Deals with object velocity and acceleration and applies friction, gravity, etc.
**/
function Physics($canvasWidth, $canvasHeight){

	//Create a reference to the current object
	let self = this;

	//Setter to set player reference to call functions
	this.setPlayer = function($object){
		self.player = $object;
	}

	//Main physics loop, applies all calculations required
	//between the current frame and the next
	//Uses an acceleration-based system, where objects move
	//based on the acceleration they experience
	this.engineLoop = function(){

		//Reset overall player acceleration to 0
		self.player.yAccel = 0;
		self.player.xAccel = 0;

		//Reset player's touchGround and touchWall flags
		self.player.touchGround = false;
		self.player.touchWall = false;

		//Check if player is moving left or right
		//if so, apply acceleration
		if(self.player.movingLeft == true){
			self.player.xAccel -= 2;
		}
		else if (self.player.movingRight == true) {
			self.player.xAccel += 2;
		}

		//Apply gravity acceleration
		self.player.yAccel += $gravity;

		//Check if player has collided with the ground
		//If so, provide ground acceleration and set velocity to 0
		if((self.player.y + self.player.height) > $canvasHeight - 5){
			self.player.yAccel += -$gravity;
			if(self.player.yVelocity > 0){self.player.yVelocity = 0;}
			self.player.touchGround = true;
		}

		//Check if player is both on the ground and moving
		//If so, apply friction acceleration
		if(self.player.touchGround == true && self.player.xVelocity != 0){
			if(self.player.xVelocity > 0){
				self.player.xVelocity -= $friction;
			}
			else if (self.player.xVelocity < 0) {
				self.player.xVelocity += $friction;
			}
		}

		//Apply acceleration and velocity calculations to player
		self.player.xVelocity += self.player.xAccel;
		self.player.x += self.player.xVelocity;
		self.player.yVelocity += self.player.yAccel;
		self.player.y += self.player.yVelocity;

		//Check to see if player has accelerated beyond terminal
		//velocity and set it back if so
		if(self.player.xVelocity > self.player.xTerm){
			self.player.xVelocity = self.player.xTerm;
		}
		else if(self.player.xVelocity < -self.player.xTerm){
			self.player.xVelocity = -self.player.xTerm;
		}

		if(self.player.yVelocity > self.player.yTerm){
			self.player.yVelocity = self.player.yTerm;
		}
		else if(self.player.yVelocity < -self.player.yTerm){
			self.player.yVelocity = -self.player.yTerm;
		}



		//Wait until next frame and call this function again
		setTimeout(function () {self.engineLoop();}, 1000/fps);
	}


	return self;
}

/**=========================================================================================================================**/

/*
*INPUT HANDLER
*Object that interprets all incoming keypresses and executes the corresponding functions
*/
function inputHandler(){

	this.keys = {
		UP_ARROW: 38,
		LEFT_ARROW: 37,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40
	}

	//Store mouse coordinates
	this.mx = null;
	this.my = null;

	//Create an external object reference for the player
	this.player = null;

	//Create a reference to the current object
	let self = this;

	//Setter to set player reference to call functions
	this.setPlayer = function($object){
		self.player = $object;
		}

	//Get key code for interpretation
	this.onKeyDown = function($event){
		var input = $event.keyCode;
		if(input == 37){
			self.player.moveLeft();
		}
		else if (input == 39) {
			self.player.moveRight();
		}
		else if (input == 38) {
			self.player.jump();
		}
		else if (input == 40) {
			self.player.stop();
		}
	}

	this.onKeyUp = function($event){
		var input = $event.keyCode;
		if(input == 37){
			self.player.stopLeft();
		}
		else if (input == 39) {
			self.player.stopRight();
		}
		else if (input == 38) {

		}
	}

	this.onClick = function(){


	}
	return self;
}
