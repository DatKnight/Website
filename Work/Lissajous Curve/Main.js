let fps = 10;
let pi = Math.PI;
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

	//Background colour for the canvas
	this.backColour = 'black';

	//Getters and Setters for the CanvasId
	this.getCanvasId = function() {return this.canvasId;}
	this.setCanvasId = function($object) {this.canvasId = $object;}

	//Create two new sine waves within main
	this.sine1 = new Sine();
	this.sine2 = new Sine();

	//Create a lissajous curve
	this.lissajous = new Lissajous();

	//Create a new inputHandler within main
	this.inputHandler = new inputHandler();
	this.inputHandler.setSine1(this.sine1);
	this.inputHandler.setSine2(this.sine2);
	this.inputHandler.setLissajous(this.lissajous);
	this.inputHandler.setContext(this.canvasContext);

	//Draws background
	this.drawBack = function(){
		main.canvasContext.fillStyle = "black";
		main.canvasContext.fillRect(0, 0, main.canvasX, main.canvasY);
	}

	//Checks for any user input and
	//forces a reDraw on the object and all
	//dependant objects below it, thus redrawing
	//the whole screen
	/**this.reDraw = function(){

		//Check if user is giving input, and if so draw the frame
		if(main.inputHandler.getDraw() == true){

			//Clear the window before redrawing it
			//main.canvasContext.clearRect(0, 0, main.canvasX, main.canvasY);

			//Draw background
			//main.drawBack();

			//Draw the sine waves
			main.sine1.reDraw(main.canvasContext);
			main.sine2.reDraw(main.canvasContext);

			//Draw the lissajous curve
			main.lissajous.reDraw(main.canvasContext);

		}

		//Wait until the next frame and call this function again
		setTimeout(function () {main.reDraw();}, 1000/fps);

	}**/

	//Set all the requesite variables and jumpstart the recursive
	//functions
	this.initialise = function(){

		console.log('Initializing...');

		//Setup listeners to react to mouse movement and clicks
		main.canvas.addEventListener('mousedown',main.inputHandler.mouseDown);
		main.canvas.addEventListener('mouseup',main.inputHandler.mouseUp);
		main.canvas.addEventListener('mousemove',main.inputHandler.mouseMove);
		console.log('Created listeners');

		//Place sine waves on screen and assign them colours
		main.sine1.setX(300);
		main.sine1.setY(20);
		main.sine1.setColour('red');
		main.sine1.setPhase(0.3 * pi);
		main.sine1.setFreq(3);
		main.sine2.setX(300);
		main.sine2.setY(160)
		main.sine2.setColour('blue');
		main.sine2.setPhase(0);

		//Place lissajous curve
		main.lissajous.setX(20);
		main.lissajous.setY(20);
		main.lissajous.setSine1(main.sine1);
		main.lissajous.setSine2(main.sine2);
		main.lissajous.calcWaves();

		//Draw the initial frame
		main.drawBack();
		main.sine1.reDraw(this.canvasContext);
		main.sine2.reDraw(this.canvasContext);
		main.lissajous.reDraw(this.canvasContext);

		//Start drawing everything on screen
		//main.reDraw();
		//console.log('Started drawing frames at ' + fps + ' fps');

		console.log('Initialized');

	}
	return main;
}

/**=========================================================================================================================**/

/*
*INPUT HANDLER
*Object that interprets all user input and executes the corresponding functions
*/
function inputHandler(){

	//Store mouse coordinates
	this.mx = null;
	this.my = null;

	//Create a reference to the current object
	let self = this;

	//Create references for sine waves so
	//input can be detected
	this.sine1 = null;
	this.sine2 = null;

	//Create a reference for the lissajous
	//curve so that it can be updated
	this.lissajous = null;

	//Flag to track when drawing should be done
	this.canvasContext = null;;

	//Flag to track when the mouse is held down
	this.mDown = false;

	//Variables to track the position the mouse
	//was in when the mouse button is pressed
	this.ox = null;
	this.oy = null;

	//Getters and setters
	this.getDraw = function(){return self.drawing;}
	this.setSine1 = function($val){self.sine1 = $val;}
	this.setSine2 = function($val){self.sine2 = $val;}
	this.setLissajous = function($val){self.lissajous = $val;}
	this.setContext = function($val){self.canvasContext = $val;}

  //Detect if user is giving active input
	this.mouseDown = function(){
		self.mDown = true;
		self.ox = self.mx
	}

	//Detect if user stops giving active input
	this.mouseUp = function(){
		self.mDown = false;
	}

  //Get mouse position and update coordinates
  this.mouseMove = function(eventObject){
    self.mx = eventObject.clientX;
    self.my = eventObject.clientY;
		if(self.mDown == true){
			self.checkWave();
		}
  }

	//Check if mouse is over a wave and the mouse button
	//is pressed, if so start changing the phase of that wave
	this.checkWave = function(){
		let mdiff = null;
		let phasediff = null;
		if(self.mx > self.sine1.x && self.mx < self.sine1.x + self.sine1.xd){
			if(self.my > self.sine1.y && self.my < self.sine1.y + self.sine1.yd){
					mdiff = self.sine1.xd - self.mx;
					phasediff = ((mdiff/self.sine1.xd) * 2 * pi) * 1.1
					self.sine1.setPhase(phasediff);
					self.sine1.reDraw(self.canvasContext);
					self.lissajous.calcWaves();
					self.lissajous.reDraw(self.canvasContext);
			}
		}
		if(self.mx > self.sine2.x && self.mx < self.sine2.x + self.sine2.xd){
			if(self.my > self.sine2.y && self.my < self.sine2.y + self.sine2.yd){
				mdiff = self.sine2.xd - self.mx;
				phasediff = ((mdiff/self.sine2.xd) * 2 * pi) * 1.1
				self.sine2.setPhase(phasediff);
				self.sine2.reDraw(self.canvasContext);
				self.lissajous.calcWaves();
				self.lissajous.reDraw(self.canvasContext);
			}
		}
	}

	return self;
}

/**=========================================================================================================================**/

/*
*SLIDER
*Object that represents a slider to change a sine wave's frequency value
*/
function Slider(){

	//Create a self reference
	let self = this;

	//x and y coordinates for the sine
  this.x = null;
  this.y = null;

	//Dimensions of slider
	this.xd = 280;
	this.yd = 120;

	//Slider position
	this.position = null;

	//Amount of positions the slider has
	this.positions = null;

	return self;
}

/**=========================================================================================================================**/

/*
*SINE
*Object that represents a sine wave that the user can manipulate
*/
function Sine(){

  //Create a self reference
  let self = this;

	//x and y coordinates for the sine
  this.x = null;
  this.y = null;

	//Dimensions of wave
	this.xd = 280;
	this.yd = 120;

	//Phase shift of the sine from 0
	this.phase = null;

	//Frequency of the sine wave in Hz
	this.freq = 2;

	//Array that stores the wave shape
	this.wave = [];

	//Colour of sine
	this.colour = null;

	//Setters and getters
	this.setPhase = function($val){
		self.phase = $val;
		self.calcWave();
	}
	this.setColour = function($val){self.colour = $val;}
	this.setX = function($val){self.x = $val;}
	this.setY = function($val){self.y = $val;}
	this.setFreq = function($val){
		self.freq = $val;
		self.calcWave();
	}

	this.getPhase = function(){return self.phase;}
	this.getX = function(){return self.x;}
	this.getY = function(){return self.y;}

	//Function to decide what the wave looks like and change the wave array to match
	this.calcWave = function(){
		for(let i = 0; i < this.xd; i++){
			self.wave[i] = -Math.sin((i/self.xd)*2*self.freq*pi + self.phase)/2;
		}
	}

	//Draw a line between two points
  this.drawLine = function($canvasContext, $point1, $point2){
    $canvasContext.strokeStyle = self.colour;
    $canvasContext.beginPath();
    $canvasContext.moveTo($point1[0],$point1[1]);
    $canvasContext.lineTo($point2[0],$point2[1]);
    $canvasContext.stroke();
  }

	//Draw background for wave
	this.drawBack = function($canvasContext){
		$canvasContext.fillStyle = 'green';
		$canvasContext.fillRect(self.x-1,self.y-1,self.xd+2,self.yd+2);
	}

	//Draw sine wave
	this.reDraw = function($canvasContext){
		$canvasContext.clearRect(self.x-1, self.y-1, self.xd+2, self.yd+2);
		self.drawBack($canvasContext);
		let lastx = self.x;
		let lasty = self.y + (self.yd/2) + (self.yd * self.wave[0]);
		let ydiff = self.y + (self.yd/2);
		let nextx = null;
		let nexty = null;
		for(let x = 0; x < self.xd; x++){
			nextx = lastx + 1;
			nexty = ydiff + (self.yd * self.wave[x]);
			self.drawLine($canvasContext, [lastx,lasty], [nextx,nexty]);
			lastx = nextx;
			lasty = nexty;
		}
	}

  return self;
}

/**=========================================================================================================================**/

/*
*LISSAJOUS CURVE
*Object that represents a lissajous curve made up of the two sine waves on the screen
*/
function Lissajous(){

  //Create a self reference
  let self = this;

	//Create references for two sine waves
	this.sine1 = null;
	this.sine2 = null;

	//Wave arrays for child sine waves
	this.wave1 = [];
	this.wave2 = [];

	//x and y coordinates for the sine
  this.x = null;
  this.y = null;

	//Dimensions of wave
	this.xd = 260;
	this.yd = 260;

	//Setters and getters
	this.setX = function($val){self.x = $val;}
	this.setY = function($val){self.y = $val;}
	this.setSine1 = function($val){self.sine1 = $val;}
	this.setSine2 = function($val){self.sine2 = $val;}

	this.getX = function(){return self.x;}
	this.getY = function(){return self.y;}

	//Draw a line between two points
  this.drawLine = function($canvasContext, $point1, $point2){
    $canvasContext.strokeStyle = 'white';
    $canvasContext.beginPath();
    $canvasContext.moveTo($point1[0],$point1[1]);
    $canvasContext.lineTo($point2[0],$point2[1]);
    $canvasContext.stroke();
  }

	//Draw background for curve
	this.drawBack = function($canvasContext){
		$canvasContext.fillStyle = 'green';
		$canvasContext.fillRect(self.x-1,self.y-1,self.xd+2,self.yd+2);
	}

	//Calculate wave arrays for child sine waves
	this.calcWaves = function(){
		for(let i = 0; i < self.xd; i++){
			self.wave1[i] = -Math.sin((i/self.xd)*2*self.sine1.freq*pi + self.sine1.phase)/2;
		}
		for(let i = 0; i < self.yd; i++){
			self.wave2[i] = -Math.sin((i/self.yd)*2*self.sine2.freq*pi + self.sine2.phase)/2;
		}
	}


	this.reDraw = function($canvasContext){
		$canvasContext.clearRect(self.x-1, self.y-1, self.xd+2, self.yd+2);
		self.drawBack($canvasContext);
		let xarray = self.wave1;
		let yarray = self.wave2;
		let lastx = null;
		let lasty = null;
		let nextx = null;
		let nexty = null;
		let xdiff = self.x + (self.xd/2);
		let ydiff = self.y + (self.yd/2);
		lastx = self.x + (self.xd/2) - (xarray[0] * self.xd);
		lasty = self.y + (self.yd/2) - (yarray[0] * self.yd);
		for(let i = 1; i < self.xd; i++){
			nextx =	xdiff - (xarray[i] * self.xd);
			nexty =	ydiff - (yarray[i] * self.yd);
			self.drawLine($canvasContext, [lastx,lasty], [nextx,nexty])
			lastx = nextx;
			lasty = nexty;

		}
	}

  return self;
}
