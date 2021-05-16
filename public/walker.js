const AMOUNT = 150;
const ODDS = 2.25, OUT_OF = 4; // for going towards the mouse

let walkers = [];
let colors = [[13, 115, 119], [20, 255, 236], [158, 52, 0], [235, 88, 16]];
let x = $(window).width() / 2;

let background_image;

function preload() {
	//background_image = loadImage("https://cuteboys.me/singleBoy");
}

function setup() {
	createCanvas($(window).width(), $(window).height());
	// background_image.resize($(window).width(), $(window).height());

	for (let i = 0; i < AMOUNT; i++) {
		walkers.push(new Walker(random(0, $(window).width()), 0, colors[floor(random(0, colors.length))]));
		// walkers.push(new Walker($(window).width() / 2, 0, background_image.get(x, y)));
	}
}

function draw() {
	// loop through the walkers - update them and draw them

	// background_image.loadPixels()
	for (let i = 0; i < AMOUNT; i++) {
		// let posn = (walkers[i].y * background_image.width + walkers[i].x) * 4;
		walkers[i].update();
		walkers[i].display();
	}
}

$(document).mousemove((event) => {
	x = event.pageX;
	y = event.pageY;
});

function Walker(startx, starty, color) {
	this.x = startx;
	this.y = starty;
	this.color = color;

	this.update = function() {

		// weight towards the mouse x and y
		this.x += x > this.x ? random(0, OUT_OF) < ODDS ? 1 : -1 : random(0, OUT_OF) < ODDS ? -1 : 1;
		// this.y += y > this.y ? random(0, OUT_OF) < ODDS ? 1 : -1 : random(0, OUT_OF) < ODDS ? -1 : 1;
		this.y += random(0, OUT_OF) < ODDS ? 1 : -1;
	}

	this.display = function(r, g, b) {

		stroke(this.color);
		point(this.x, this.y);
	}
}