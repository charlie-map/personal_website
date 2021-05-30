function setup() {
	let AMOUNT = 300;

	createCanvas($(window).width(), $(window).height() - 42);
	background(0);

	for (let i = 0; i < AMOUNT; i++) {
		walker[i] = new Walker($(window).width() * 0.5, $(window).height() * 0.5, colors[floor(random(4))]);
	}
}

function draw() {
	for (let i = 0; i < walker.length; i++) {
		walker[i].update();
		walker[i].display();
	}
}

$(document).mousemove((event) => {
	mouse_x = event.pageX;
	mouse_y = event.pageY;
});

function Walker(startx, starty, color) {
	this.x = startx;
	this.y = starty;
	this.color = color;
	this.out_of = 5.4;
	this.odds = 3;

	this.update = function() {

		// weight towards the mouse x and y
		// this.x += floor(random(0, 2)) == 0 ? -1 : 1;
		this.x += mouse_x > this.x ? random(0, this.out_of) < this.odds ? 1 : -1 : random(0, this.out_of) < this.odds ? -1 : 1;
		this.y += mouse_y > this.y ? random(0, this.out_of) < this.odds ? 1 : -1 : random(0, this.out_of) < this.odds ? -1 : 1;
	}

	this.display = function(r, g, b) {

		stroke(this.color);
		point(this.x, this.y);
	}
}