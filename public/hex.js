const HEX_SIZE = 40;

let hexes = [];

let colors = [
	[13, 115, 119],
	[20, 255, 236],
	[158, 52, 0],
	[235, 88, 16]
];

function setup() {
	createCanvas($(window).width(), $(window).height() - 42);

	let random_subtract = floor(random(-30, -10));
	let build_x, build_y

	for (let x = 0; x < $(window).width()/HEX_SIZE + 50; x++) {
		hexes[x] = [];
		for (let y = 0; y < $(window).height()/HEX_SIZE + 50; y++) {
			build_x = y % 2 == 0 ? x * HEX_SIZE + random_subtract : x * HEX_SIZE - (HEX_SIZE / 2) + random_subtract;
			build_y = y * HEX_SIZE + random_subtract;
			hexes[x][y] = new OBJHexes(build_x, build_y);
		}
	}

	background(0);
	fill(0);
	stroke(255);
}

function draw() {
	for (let x = 0; x < hexes.length; x++) {
		for (let y = 0; y < hexes[x].length; y++) {
			hexes[x][y].display();
		}
	}
}

$(document).mousemove((event) => {
	hexes[floor(event.pageX / HEX_SIZE)][floor(event.pageY / HEX_SIZE)].color = colors[3];
	hexes[floor(event.pageX / HEX_SIZE)][floor(event.pageY / HEX_SIZE)].change = 80;
});

function OBJHexes(hex_x, hex_y) {
	this.x = hex_x;
	this.y = hex_y;
	this.color = colors[0];
	this.change = 0;

	this.display = function(){
		if (this.change != 0) {
			this.change--;
			this.color = color(red(this.color) - 5, green(this.color) - 5, blue(this.color) - 5);
			if (this.change == 0) this.color = 0;
		}
		stroke(this.color);

		let y_subtract = HEX_SIZE / 2 - 5;/*this.y / HEX_SIZE % 2 == 1 ? HEX_SIZE / 2 - 15 : HEX_SIZE / 2;*/
		beginShape();
		vertex(this.x, this.y - 25);
		vertex(this.x + (HEX_SIZE / 2), this.y - y_subtract);
		vertex(this.x + (HEX_SIZE / 2), this.y + y_subtract);
		vertex(this.x, this.y + 25);
		vertex(this.x - (HEX_SIZE / 2), this.y + y_subtract);
		vertex(this.x - (HEX_SIZE / 2), this.y - y_subtract);
		endShape(CLOSE);
	}
}