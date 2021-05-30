const AMOUNT = 200;

let walkers = [];

function setup() {

	createCanvas($(window).width(), $(window).height() - 42);
	background(0);

	for (let i = 0; i < AMOUNT; i++) {
		walkers[i] = new Walker($(window).width() * 0.5, $(window).height() * 0.5, colors[floor(random(4))]);
	}
}

function draw() {
	for (let i = 0; i < AMOUNT; i++) {
		walkers[i].update();
		walkers[i].display();
	}
}

function Walker(startx, starty, color) {
	this.x = startx;
	this.y = starty;
	this.color = color;

	this.update = function() {

		// weight towards the mouse x and y
		this.x += floor(random(0, 2)) == 0 ? -1 : 1;
		// this.y += y > this.y ? random(0, OUT_OF) < ODDS ? 1 : -1 : random(0, OUT_OF) < ODDS ? -1 : 1;
		this.y += floor(random(0, 2)) == 0 ? -1 : 1;
	}

	this.display = function(r, g, b) {

		stroke(this.color);
		point(this.x, this.y);
	}
}