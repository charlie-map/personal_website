let screen_width, screen_height;
const AMOUNT = 100;

let walkers = [];

function setup() {

	let start_x = $(window).width() * 0.1;
	let start_y = $(window).height() * 0.15;
	screen_width = $(window).width() * 0.8;
	screen_height = $(window).height() * 0.7;

	createCanvas($(window).width(), $(window).height() - 42);
	background(0);

	for (let i = 0; i < AMOUNT; i++) {
		walkers[i] = new Walker(random(start_x, screen_width), random(start_y, screen_height), colors[floor(random(4))]);
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