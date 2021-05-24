let screen_width, screen_height;

let walkers = [];

function make_walking() {
	let start_x = $(window).width() * 0.1;
	let start_y = $(window).height() * 0.15;
	screen_width = $(window).width() * 0.8;
	screen_height = $(window).height() * 0.7;

	createCanvas(screen_width, screen_height);

	for (let i = 0; i < 100; i++) {
		walkers[i] = new Walker(random(start_x, screen_width), random(start_y, screen_height), colors[floor(random(4))]);
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